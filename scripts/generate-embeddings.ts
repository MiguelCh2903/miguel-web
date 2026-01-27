/**
 * Script para pre-generar embeddings de la knowledge base
 *
 * Uso:
 *   pnpm tsx scripts/generate-embeddings.ts
 *
 * Este script se ejecuta UNA SOLA VEZ (o cuando actualices el contenido)
 * y genera todos los embeddings que se usarán en producción.
 *
 * Costo aproximado: ~$0.0004 USD por ejecución (20 chunks * ~100 tokens c/u)
 */

import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import knowledgeBase from "../lib/knowledge-base.json";

// Cargar variables de entorno desde .env (usa .env.example como plantilla)
config({ path: path.join(process.cwd(), '.env') });

interface EmbeddedDocument {
  content: string;
  category: string;
  embedding: number[];
}

function createDocumentChunks(): Array<{ content: string; category: string }> {
  const chunks: Array<{ content: string; category: string }> = [];

  // Chunk 1: Información personal
  chunks.push({
    content: `${knowledgeBase.personal.name} es ${knowledgeBase.personal.title} especializado en ${knowledgeBase.personal.specialization}. ${knowledgeBase.personal.summary}. Ubicación: ${knowledgeBase.personal.location}. Idiomas: ${knowledgeBase.personal.languages.join(", ")}.`,
    category: "personal",
  });

  // Chunks de experiencia laboral (cada experiencia = 1 chunk)
  knowledgeBase.experience.forEach((exp: any) => {
    chunks.push({
      content: `Experiencia: ${exp.position} en ${exp.company} (${exp.period}). ${exp.description} Responsabilidades principales: ${exp.responsibilities.join("; ")}.`,
      category: "experience",
    });
  });

  // Chunks de proyectos (cada proyecto = 1 chunk)
  knowledgeBase.projects.forEach((project: any) => {
    const achievement = project.achievement || "";
    chunks.push({
      content: `Proyecto: ${project.title} (${project.category}). ${project.description} Tecnologías: ${project.technologies.join(", ")}. Estado: ${project.status}. ${achievement}`,
      category: "project",
    });
  });

  // Chunk de educación
  const edu = knowledgeBase.education;
  const highlights = ((edu.highlights as string[]) || []).join(". ");
  chunks.push({
    content: `Educación: ${edu.degree} en ${edu.institution}, ${edu.location} (${edu.period}). Estado: ${edu.status}. ${highlights}`,
    category: "education",
  });

  // Chunks de áreas de expertise
  Object.entries(knowledgeBase.areas_expertise).forEach(
    ([key, area]: [string, any]) => {
      chunks.push({
        content: `Área de expertise: ${area.title}. ${area.description} Habilidades: ${area.skills.join(", ")}.`,
        category: `expertise_${key}`,
      });
    },
  );

  // Chunk de habilidades técnicas
  chunks.push({
    content: `Habilidades Técnicas: Programación (${knowledgeBase.technical_skills.programming.join(", ")}), Frameworks AI/ML (${knowledgeBase.technical_skills.ai_ml_frameworks.join(", ")}), Herramientas de Robótica (${knowledgeBase.technical_skills.robotics_tools.join(", ")}), Desarrollo Web (${knowledgeBase.technical_skills.web_development.join(", ")}), Diseño de Hardware (${knowledgeBase.technical_skills.hardware_design.join(", ")}), Herramientas (${knowledgeBase.technical_skills.tools.join(", ")}).`,
    category: "technical_skills",
  });

  return chunks;
}

async function generateEmbeddings() {
  console.log("🔄 Generando embeddings para la knowledge base...\n");

  const chunks = createDocumentChunks();
  console.log(`📊 Total de chunks a procesar: ${chunks.length}\n`);

  const vectorDB: EmbeddedDocument[] = [];
  let totalTokens = 0;

  // Generar embeddings uno por uno con progress
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(
      `⏳ [${i + 1}/${chunks.length}] Procesando: ${chunk.category}...`,
    );

    try {
      const { embedding, usage } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: chunk.content,
      });

      vectorDB.push({
        content: chunk.content,
        category: chunk.category,
        embedding,
      });

      totalTokens += usage?.tokens || 0;
      console.log(` ✅ (${usage?.tokens || 0} tokens)`);
    } catch (error) {
      console.log(` ❌ ERROR`);
      console.error(`Error procesando chunk ${i}:`, error);
      process.exit(1);
    }
  }

  // Guardar embeddings en archivo JSON
  const outputPath = path.join(process.cwd(), "lib", "embeddings.json");
  fs.writeFileSync(outputPath, JSON.stringify(vectorDB, null, 2));

  // Calcular costo aproximado
  const costPer1KTokens = 0.00002; // $0.00002 / 1K tokens para text-embedding-3-small
  const totalCost = (totalTokens / 1000) * costPer1KTokens;

  console.log("\n✅ ¡Embeddings generados exitosamente!");
  console.log(`\n📊 Estadísticas:`);
  console.log(`   - Total de documentos: ${vectorDB.length}`);
  console.log(`   - Total de tokens: ${totalTokens}`);
  console.log(
    `   - Dimensiones por embedding: ${vectorDB[0].embedding.length}`,
  );
  console.log(`   - Costo aproximado: $${totalCost.toFixed(6)} USD`);
  console.log(`   - Archivo guardado: ${outputPath}`);
  console.log(
    `\n💡 Este archivo se usará en producción (sin costos adicionales por usuario)`,
  );
}

// Ejecutar
generateEmbeddings().catch((error) => {
  console.error("\n❌ Error fatal:", error);
  process.exit(1);
});
