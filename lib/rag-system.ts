import { openai } from "@ai-sdk/openai";
import { cosineSimilarity, embed } from "ai";
import type { RAGSource } from "./chat-types";
import precomputedEmbeddings from "./embeddings.json";
import knowledgeBase from "./knowledge-base.json";

// Interfaz para documentos con embeddings
interface EmbeddedDocument {
  content: string;
  category: string;
  embedding: number[];
}

/**
 * Sistema RAG con embeddings vectoriales pre-computados
 *
 * Los embeddings se generan UNA SOLA VEZ con el script:
 *   pnpm tsx scripts/generate-embeddings.ts
 *
 * Ventajas:
 * - ✅ $0 costo por usuario (embeddings ya generados)
 * - ✅ Latencia ~0ms (sin llamadas API)
 * - ✅ Funciona en Edge Runtime sin API keys
 * - ✅ No requiere saldo en producción
 */

// Cargar embeddings pre-computados (sin costo) - Lazy loading
let vectorDB: EmbeddedDocument[] | null = null;

function getVectorDB(): EmbeddedDocument[] {
  if (!vectorDB) {
    vectorDB = precomputedEmbeddings as EmbeddedDocument[];
    console.log(
      `✅ Vector DB cargado: ${vectorDB.length} documentos con embeddings pre-computados`,
    );
  }
  return vectorDB;
}

// Resultado de búsqueda con metadatos
export interface RAGResult {
  context: string;
  categories: string[];
  sources: RAGSource[];
}

// Búsqueda semántica — retorna contexto + categorías de los chunks recuperados
export async function findRelevantContextWithMeta(query: string): Promise<RAGResult> {
  try {
    const db = getVectorDB();

    const { embedding: queryEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    });

    const results = db
      .map((doc) => ({
        content: doc.content,
        category: doc.category,
        similarity: cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Query:", query);
      console.log(
        "📊 Top resultados:",
        results.map((r) => ({
          category: r.category,
          similarity: r.similarity.toFixed(3),
          preview: r.content.substring(0, 80) + "...",
        })),
      );
    }

    if (results.length === 0 || results[0].similarity < 0.35) {
      return {
        context: `${knowledgeBase.personal.name} es ${knowledgeBase.personal.title}. ${knowledgeBase.personal.summary}`,
        categories: ["personal"],
        sources: [],
      };
    }

    return {
      context: results.map((r) => r.content).join("\n\n"),
      categories: results.map((r) => r.category),
      sources: results.map((r) => ({
        category: r.category,
        similarity: r.similarity,
        preview: r.content.substring(0, 100),
      })),
    };
  } catch (error) {
    console.error("❌ Error en búsqueda semántica:", error);
    return {
      context: `${knowledgeBase.personal.name} es ${knowledgeBase.personal.title}. ${knowledgeBase.personal.summary}`,
      categories: ["personal"],
      sources: [],
    };
  }
}

