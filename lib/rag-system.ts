import { openai } from "@ai-sdk/openai";
import { cosineSimilarity, embed } from "ai";
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

// Búsqueda semántica con embeddings pre-computados
export async function findRelevantContext(query: string): Promise<string> {
  try {
    const db = getVectorDB();

    // 1. Generar embedding solo de la query del usuario (única llamada API)
    const { embedding: queryEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    });

    // 2. Calcular similitud coseno con documentos pre-embedidos (sin costo)
    const results = db
      .map((doc) => ({
        content: doc.content,
        category: doc.category,
        similarity: cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4); // Top 4 documentos más relevantes

    // 3. Log para debugging (solo en desarrollo)
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

    // 4. Si no hay resultados relevantes (similarity muy baja), retornar info general
    if (results.length === 0 || results[0].similarity < 0.3) {
      return `${knowledgeBase.personal.name} es ${knowledgeBase.personal.title}. ${knowledgeBase.personal.summary}`;
    }

    // 5. Retornar los chunks más relevantes
    return results.map((r) => r.content).join("\n\n");
  } catch (error) {
    console.error("❌ Error en búsqueda semántica:", error);
    // Fallback: retornar información general
    return `${knowledgeBase.personal.name} es ${knowledgeBase.personal.title} especializado en ${knowledgeBase.personal.specialization}.`;
  }
}

/**
 * Obtener contexto específico para respuestas breves
 */
export async function getQuickContext(
  query: string,
): Promise<{ context: string; type: "brief" | "detailed" }> {
  const lowerQuery = query.toLowerCase();

  // Preguntas que requieren respuestas muy breves
  if (lowerQuery.match(/^(hola|hi|hey|buenas|saludos)/)) {
    return {
      context: `${knowledgeBase.personal.name}, ${knowledgeBase.personal.title}`,
      type: "brief",
    };
  }

  // Para todo lo demás, usar el sistema RAG con embeddings
  const context = await findRelevantContext(query);
  return {
    context,
    type: "detailed",
  };
}
