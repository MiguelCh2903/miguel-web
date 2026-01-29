import { createGroq } from "@ai-sdk/groq";
import { ToolLoopAgent, tool, stepCountIs, createAgentUIStreamResponse } from "ai";
import { z } from "zod";
import { findRelevantContext } from "@/lib/rag-system";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

// Definir herramienta RAG para el agente
const ragTool = tool({
  description: "Busca información relevante sobre Miguel Chumacero en su base de conocimiento personal. Usa esta herramienta cuando necesites información sobre su experiencia laboral, proyectos, educación, habilidades técnicas o cualquier otro dato biográfico o profesional.",
  inputSchema: z.object({
    query: z.string().describe("La pregunta o tema sobre el que necesitas información de Miguel"),
  }),
  execute: async ({ query }) => {
    console.log("🔧 Herramienta RAG llamada con query:", query);
    const context = await findRelevantContext(query);
    console.log("📚 Contexto recuperado:", context.substring(0, 200) + "...");
    return context;
  },
});

// Crear agente autónomo con instrucciones
const portfolioAgent = new ToolLoopAgent({
  model: groq("llama-3.3-70b-versatile"),
  instructions: `Eres un asistente IA del portfolio de Miguel Chumacero, Ingeniero Mecatrónico especializado en Sistemas Inteligentes y Automatización.

**TU COMPORTAMIENTO:**
1. Cuando te pregunten sobre Miguel (experiencia, proyectos, habilidades, educación, etc.), USA la herramienta 'searchKnowledge' PRIMERO para obtener información precisa.
2. Responde de forma CONCISA y PROFESIONAL (2-4 oraciones máximo).
3. Si la herramienta no devuelve información relevante, admítelo honestamente.
4. Para saludos simples, responde directamente sin usar herramientas.
5. Responde en el mismo idioma que la pregunta (español o inglés).

**REGLAS ESTRICTAS:**
- ❌ NO inventes información que no esté en los resultados de la herramienta
- ❌ NO menciones tecnologías, empresas o proyectos que no aparezcan en el contexto
- ✅ Sé preciso y usa SOLO la información proporcionada por las herramientas`,
  tools: {
    searchKnowledge: ragTool,
  },
  temperature: 0.3,
  stopWhen: stepCountIs(5), // Máximo 5 pasos para evitar loops infinitos
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("📨 Mensajes recibidos:", JSON.stringify(messages, null, 2));

    // Usar createAgentUIStreamResponse para streaming con el agente
    return createAgentUIStreamResponse({
      agent: portfolioAgent,
      uiMessages: messages,
      onStepFinish: async ({ usage, toolCalls }) => {
        console.log("📊 Paso completado:", {
          tokens: usage?.totalTokens,
          tools: toolCalls?.map(tc => tc.toolName),
        });
      },
    });

  } catch (error) {
    console.error("❌ Error en POST /api/chat:", error);
    return new Response(
      JSON.stringify({ error: "Error processing chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
