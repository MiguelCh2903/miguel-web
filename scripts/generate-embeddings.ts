import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

interface KnowledgeBase {
  personal: { name: string; title: string; summary: string };
  contact: { email: string; github: string; location: string; phone?: string };
  education: Array<{
    institution: string;
    program: string;
    period?: string;
    status?: string;
    highlights?: string[];
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    summary: string;
    highlights?: string[];
  }>;
  skills: Record<string, string[]>;
  professional_projects: Array<Project>;
  personal_projects: Array<Project>;
}

interface Project {
  name: string;
  summary: string;
  details: string;
  tech: string[];
  status: string;
  year: string;
}

interface DocumentChunk {
  content: string;
  category: string;
}

async function loadKnowledgeBase(): Promise<KnowledgeBase> {
  const kbPath = path.join(process.cwd(), "lib", "knowledge-base.json");
  const raw = await readFile(kbPath, "utf-8");
  return JSON.parse(raw) as KnowledgeBase;
}

function toProjectChunk(project: Project, bucket: "professional" | "personal"): DocumentChunk {
  return {
    category: `${bucket}_project_detail`,
    content: [
      `Proyecto: ${project.name}`,
      `Resumen: ${project.summary}`,
      `Detalles: ${project.details}`,
      `Tecnologías: ${project.tech.join(", ")}`,
      `Estado: ${project.status}`,
      `Año: ${project.year}`,
    ].join(". "),
  };
}

function buildChunks(kb: KnowledgeBase): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];

  chunks.push({
    category: "personal",
    content: `${kb.personal.name} es ${kb.personal.title}. ${kb.personal.summary}`,
  });

  chunks.push({
    category: "summary",
    content: `Perfil objetivo: AI Engineer Jr. con enfoque en agentes IA, LLMs, RAG, automatización y aplicaciones reales.`,
  });

  chunks.push({
    category: "contact",
    content: `Contacto de ${kb.personal.name}: email ${kb.contact.email}, GitHub ${kb.contact.github}, ubicación ${kb.contact.location}${kb.contact.phone ? `, teléfono ${kb.contact.phone}` : ""}.`,
  });

  for (const edu of kb.education) {
    chunks.push({
      category: "education",
      content: [
        `Educación en ${edu.institution}`,
        `Programa: ${edu.program}`,
        edu.status ? `Estado: ${edu.status}` : null,
        edu.period ? `Periodo: ${edu.period}` : null,
        edu.highlights?.length ? `Puntos clave: ${edu.highlights.join("; ")}` : null,
      ]
        .filter(Boolean)
        .join(". "),
    });

    // Crear chunk adicional para idiomas si es un curso de idiomas
    if (edu.program.toLowerCase().includes("inglés") || edu.program.toLowerCase().includes("ingles") || edu.program.toLowerCase().includes("english")) {
      chunks.push({
        category: "education",
        content: `${kb.personal.name} domina ${edu.program}. Capacitación completada en ${edu.institution} durante el período ${edu.period || "2018-2022"}. Comunicación fluida en inglés: conversación, lectura, escritura y comprensión auditiva.`,
      });
    }
  }

  for (const exp of kb.experience) {
    chunks.push({
      category: "experience",
      content: [
        `Experiencia en ${exp.company}`,
        `Rol: ${exp.role}`,
        `Periodo: ${exp.period}`,
        `Resumen: ${exp.summary}`,
        exp.highlights?.length ? `Logros: ${exp.highlights.join("; ")}` : null,
      ]
        .filter(Boolean)
        .join(". "),
    });
  }

  for (const [key, skills] of Object.entries(kb.skills)) {
    chunks.push({
      category: `skills_${key}`,
      content: `Habilidades en ${key}: ${skills.join(", ")}.`,
    });
  }

  chunks.push({
    category: "professional_projects_overview",
    content: `Proyectos profesionales: ${kb.professional_projects.map((p) => p.name).join(", ")}.`,
  });
  chunks.push({
    category: "personal_projects_overview",
    content: `Proyectos personales: ${kb.personal_projects.map((p) => p.name).join(", ")}.`,
  });

  for (const project of kb.professional_projects) {
    chunks.push(toProjectChunk(project, "professional"));
  }
  for (const project of kb.personal_projects) {
    chunks.push(toProjectChunk(project, "personal"));
  }

  return chunks;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY no está configurada en el entorno.");
  }

  const kb = await loadKnowledgeBase();
  const chunks = buildChunks(kb);

  console.log(`Generando embeddings para ${chunks.length} chunks...`);

  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks.map((c) => c.content),
  });

  const output = chunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }));

  const outPath = path.join(process.cwd(), "lib", "embeddings.json");
  await writeFile(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Embeddings actualizados en ${outPath}`);
}

main().catch((error) => {
  console.error("Error generando embeddings:", error);
  process.exit(1);
});
