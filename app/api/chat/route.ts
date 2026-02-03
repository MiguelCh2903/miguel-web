import { createGroq } from "@ai-sdk/groq";
import {
  createAgentUIStreamResponse,
  stepCountIs,
  ToolLoopAgent,
  tool,
} from "ai";
import { z } from "zod";
import { findRelevantContext } from "@/lib/rag-system";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

// Definir herramienta RAG para el agente
const ragTool = tool({
  description:
    "Busca información relevante sobre Miguel Chumacero en su base de conocimiento personal. Usa esta herramienta cuando necesites información sobre su experiencia laboral, proyectos, educación, habilidades técnicas o cualquier otro dato biográfico o profesional.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "La pregunta o tema sobre el que necesitas información de Miguel",
      ),
  }),
  execute: async ({ query }) => {
    const context = await findRelevantContext(query);
    return context;
  },
});

// Crear agente autónomo con instrucciones
const portfolioAgent = new ToolLoopAgent({
  model: groq("llama-3.3-70b-versatile"),
  instructions: `Eres el asistente del portfolio de Miguel Chumacero, Ingeniero Mecatrónico.

**INSTRUCCIONES:**
1. Para preguntas sobre Miguel, usa 'searchKnowledge' UNA VEZ y responde de forma BREVE y DIRECTA usando solo la información relevante.
2. Responde ÚNICAMENTE lo que se pregunta. No agregues contexto extra.
3. Sé conciso: 2-4 oraciones para preguntas simples.
4. NUNCA uses frases ambiguas como "es posible que...", "puede no ser exhaustiva".
5. Después de usar la herramienta, responde INMEDIATAMENTE. NO la llames múltiples veces.
6. Para saludos, responde brevemente sin usar herramientas.

Responde en español de forma profesional, segura y concisa. NO inventes información.`,
  tools: {
    searchKnowledge: ragTool,
  },
  temperature: 0.3,
  stopWhen: stepCountIs(3),
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    return createAgentUIStreamResponse({
      agent: portfolioAgent,
      uiMessages: messages,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response(
      JSON.stringify({ error: "Error processing chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
