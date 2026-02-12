import { openai } from "@ai-sdk/openai";
import {
	createAgentUIStreamResponse,
	stepCountIs,
	ToolLoopAgent,
	tool,
} from "ai";
import { z } from "zod";
import { findRelevantContextWithMeta } from "@/lib/rag-system";
import knowledgeBase from "@/lib/knowledge-base.json";

export const runtime = "edge";

// Mapeo de categorías RAG → sección del portfolio
const CATEGORY_TO_SECTION: Record<string, string> = {
	professional_projects_overview: "projects",
	professional_project_detail: "projects",
	personal_projects_overview: "projects",
	personal_project_detail: "projects",
	project_detail: "projects",
	experience: "experience",
	expertise_automation_workflows: "skills",
	expertise_ai_agents: "skills",
	expertise_python_development: "skills",
	expertise_priority: "skills",
	skills_generative_ai_llms: "skills",
	skills_software_dev_mlops: "skills",
	skills_ml_computer_vision: "skills",
	skills_robotics_embedded: "skills",
	stack: "skills",
	education: "education",
	contact: "contact",
	personal: "hero",
	summary: "hero",
};

const SECTION_NAMES: Record<string, string> = {
	projects: "Proyectos",
	experience: "Experiencia",
	skills: "Habilidades",
	education: "Educación",
	contact: "Contacto",
};

// Inferir sección de navegación basada en las categorías retornadas por RAG
function inferNavigationSection(categories: string[]): { section: string; title: string } | null {
	for (const cat of categories) {
		const section = CATEGORY_TO_SECTION[cat];
		if (section) {
			return { section, title: SECTION_NAMES[section] };
		}
	}
	return null;
}

// ============================================
// HERRAMIENTAS DEL AGENTE
// ============================================

// searchKnowledge: busca info Y retorna acción de nav automática según categorías del RAG
const searchKnowledge = tool({
	description:
		"Busca información sobre Miguel Chumacero en su base de conocimiento: experiencia, proyectos, habilidades, logros.",
	inputSchema: z.object({
		query: z
			.string()
			.describe("Tema a buscar sobre Miguel"),
	}),
	execute: async ({ query }) => {
		const { context, categories, sources } = await findRelevantContextWithMeta(query);

		// Inferir la sección de navegación automáticamente
		const nav = inferNavigationSection(categories);

		return {
			type: "knowledge",
			content: context,
			sources,
			...(nav && { action: "navigate", section: nav.section, title: nav.title }),
		};
	},
});

const navigateToSection = tool({
	description:
		"Navega a una sección del portfolio. Secciones disponibles: hero, education, skills, experience, projects, contact.",
	inputSchema: z.object({
		section: z
			.enum(["hero", "education", "skills", "experience", "projects", "contact"])
			.describe("Sección destino"),
	}),
	execute: async ({ section }) => {
		const names: Record<string, string> = {
			hero: "Inicio",
			education: "Educación",
			skills: "Habilidades",
			experience: "Experiencia",
			projects: "Proyectos",
			contact: "Contacto",
		};
		return { action: "navigate", section, title: names[section] };
	},
});

const downloadCV = tool({
	description: "Descarga el CV de Miguel en PDF.",
	inputSchema: z.object({
		format: z.enum(["pdf"]).default("pdf"),
	}),
	execute: async () => ({
		action: "download",
		file: "cv.pdf",
		filename: "Miguel_Chumacero_CV.pdf",
	}),
});

const getContactInfo = tool({
	description:
		"Retorna información de contacto de Miguel: email, GitHub, ubicación.",
	inputSchema: z.object({
		type: z
			.enum(["all", "email", "github", "location"])
			.default("all"),
	}),
	execute: async ({ type }) => {
		const { email, github, location } = knowledgeBase.contact;
		if (type === "email") return { type: "contact", data: { email } };
		if (type === "github") return { type: "contact", data: { github } };
		if (type === "location") return { type: "contact", data: { location } };
		return {
			type: "contact",
			data: { email, github, location },
			action: "showContact",
		};
	},
});

const showProjectDetails = tool({
	description:
		"Busca detalles de un proyecto específico de Miguel por nombre o palabra clave.",
	inputSchema: z.object({
		projectName: z
			.string()
			.describe("Nombre o keyword del proyecto (ej: LiDAR, robot, hexápodo, domótico)"),
	}),
	execute: async ({ projectName }) => {
		const all = [
			...knowledgeBase.professional_projects,
			...knowledgeBase.personal_projects,
		];
		const term = projectName.toLowerCase();
		const project = all.find(
			(p) =>
				p.name.toLowerCase().includes(term) ||
				p.summary.toLowerCase().includes(term) ||
				p.tech.some((t) => t.toLowerCase().includes(term)),
		);

		if (!project) {
			return {
				type: "project",
				found: false,
				message: `Proyectos disponibles: ${all.map((p) => p.name).join(", ")}`,
			};
		}
		return {
			type: "project",
			found: true,
			name: project.name,
			summary: project.summary,
			tech: project.tech,
			details: project.details,
			status: project.status,
			year: project.year,
			action: "navigate",
			section: "projects",
		};
	},
});

const explainAIConcept = tool({
	description:
		"Explica conceptos de IA (RAG, MCP, agentes, embeddings, function calling, agentic workflows, LLMs) y los relaciona con la experiencia real de Miguel. Ideal para demostrar profundidad técnica.",
	inputSchema: z.object({
		concept: z
			.string()
			.describe("Concepto de IA a explicar (ej: RAG, MCP, agentes, embeddings, function calling)"),
	}),
	execute: async ({ concept }) => {
		const conceptMap: Record<string, { explanation: string; miguelContext: string }> = {
			rag: {
				explanation:
					"Retrieval Augmented Generation (RAG) combina recuperación semántica con generación de texto. Un vector DB almacena embeddings de documentos; en runtime se buscan los chunks más relevantes por similitud coseno y se inyectan como contexto al LLM antes de generar la respuesta.",
				miguelContext:
					"Este mismo chat usa RAG con embeddings pre-computados (text-embedding-3-small) sobre el CV de Miguel. Miguel ha implementado pipelines RAG en proyectos de automatización con LangChain y arquitecturas multi-agente con LangGraph.",
			},
			mcp: {
				explanation:
					"Model Context Protocol (MCP) es un estándar abierto de Anthropic para conectar LLMs con herramientas externas de forma estandarizada. Define un protocolo cliente-servidor donde el modelo puede invocar tools, recursos y prompts expuestos por servidores MCP.",
				miguelContext:
					"Miguel tiene experiencia directa implementando arquitecturas MCP para workflows de productividad personal: conecta herramientas como Telegram, calendarios y gestores de tareas a modelos de lenguaje para automatización agentica.",
			},
			agentes: {
				explanation:
					"Los agentes de IA son sistemas donde un LLM toma decisiones en un loop: (1) percibe el estado actual, (2) razona sobre qué acción tomar, (3) ejecuta una tool call, (4) observa el resultado y repite hasta completar el objetivo. Patrones clave: ReAct, Plan-and-Execute, reflexión.",
				miguelContext:
					"Miguel diseña agentes conversacionales con LangGraph y frameworks como el AI SDK de Vercel (usado en este chat). Ha implementado sistemas multi-agente con roles especializados para automatización de workflows empresariales.",
			},
			embeddings: {
				explanation:
					"Los embeddings son representaciones vectoriales densas de texto que capturan semántica. Dos textos con significado similar tendrán vectores cercanos en el espacio de alta dimensión. Son la base de la búsqueda semántica, sistemas RAG y clasificación sin supervisión.",
				miguelContext:
					"Miguel generó y administra los embeddings de su propio portfolio usando text-embedding-3-small de OpenAI. Ha trabajado con embeddings para sistemas de búsqueda semántica en proyectos de automatización.",
			},
			"function calling": {
				explanation:
					"Function calling (o tool use) permite a los LLMs invocar funciones estructuradas con inputs y outputs tipados. El modelo decide cuándo y cómo usar las tools disponibles basándose en el contexto, generando JSON válido con los parámetros necesarios.",
				miguelContext:
					"Este chat demuestra function calling en acción: el agente usa searchKnowledge, navigateToSection, explainAIConcept y otras tools según el contexto. Miguel diseña sistemas de tool use para agentes en producción.",
			},
			"agentic workflows": {
				explanation:
					"Los workflows agénticos son pipelines donde múltiples agentes colaboran en tareas complejas: un orquestador delega subtareas a agentes especializados, que retornan resultados que se sintetizan en una respuesta final. Permiten resolver problemas que superan el contexto de un solo LLM.",
				miguelContext:
					"Miguel implementa agentic workflows con n8n y LangGraph para automatización empresarial. Su proyecto de asistente personal multi-agente conecta herramientas de productividad a través de workflows orquestados.",
			},
			llms: {
				explanation:
					"Los Large Language Models son modelos de transformers entrenados con RLHF sobre grandes corpus de texto. Distinguir capacidades: razonamiento (GPT-4o, Claude Opus), velocidad (GPT-4o-mini, Haiku), código (Codex, DeepSeek), multimodal (GPT-4V, Gemini). La elección del modelo impacta directamente costo/latencia/calidad.",
				miguelContext:
					"Miguel trabaja con APIs de OpenAI, Anthropic, Google AI y Groq. Ha optimizado el balance costo-latencia-calidad eligiendo modelos según el caso de uso: GPT-4o-mini para este chat, Claude para razonamiento complejo, Groq para latencia ultra-baja.",
			},
		};

		const key = concept.toLowerCase().replace(/[áéíóú]/g, (c) =>
			({ á: "a", é: "e", í: "i", ó: "o", ú: "u" }[c] ?? c),
		);

		const match = Object.entries(conceptMap).find(([k]) =>
			key.includes(k) || k.includes(key),
		);

		if (match) {
			return {
				type: "ai_concept",
				concept: match[0],
				explanation: match[1].explanation,
				miguelContext: match[1].miguelContext,
			};
		}

		// Fallback: buscar en knowledge base
		const { context } = await findRelevantContextWithMeta(`${concept} Miguel Chumacero experiencia`);
		return {
			type: "ai_concept",
			concept,
			explanation: `Concepto relacionado con el trabajo de Miguel en IA y automatización.`,
			miguelContext: context,
		};
	},
});

const compareSkills = tool({
	description:
		"Compara las habilidades de Miguel con requisitos típicos de roles AI Engineer, ML Engineer o Data Scientist. Ideal para reclutadores que evalúan fit cultural y técnico.",
	inputSchema: z.object({
		role: z
			.string()
			.describe("Rol o requisitos a comparar (ej: AI Engineer, ML Engineer, Data Scientist, fullstack con IA)"),
	}),
	execute: async ({ role }) => {
		const { context } = await findRelevantContextWithMeta(
			`habilidades técnicas stack experiencia Miguel Chumacero ${role}`,
		);

		const roleProfiles: Record<string, { required: string[]; nice: string[] }> = {
			"ai engineer": {
				required: ["LLMs", "RAG", "embeddings", "Python", "API integration", "agentes"],
				nice: ["LangChain", "LangGraph", "MCP", "vector DBs", "prompt engineering"],
			},
			"ml engineer": {
				required: ["Python", "ML frameworks", "model training", "deployment", "Docker"],
				nice: ["MLOps", "feature engineering", "computer vision", "pipelines CI/CD"],
			},
			"data scientist": {
				required: ["Python", "estadística", "análisis exploratorio", "modelos predictivos"],
				nice: ["visualización", "SQL", "A/B testing", "NLP"],
			},
		};

		const roleKey = Object.keys(roleProfiles).find((k) => role.toLowerCase().includes(k)) ?? "ai engineer";
		const profile = roleProfiles[roleKey] ?? roleProfiles["ai engineer"];

		return {
			type: "skill_comparison",
			role,
			requiredSkills: profile.required,
			niceToHave: profile.nice,
			miguelProfile: context,
			summary: `Evaluación de fit de Miguel para el rol de ${role} basada en su experiencia real.`,
		};
	},
});

const getProjectTechStack = tool({
	description:
		"Proporciona un deep dive en la arquitectura técnica de un proyecto específico de Miguel, explicando decisiones de diseño, stack tecnológico y desafíos resueltos.",
	inputSchema: z.object({
		projectName: z
			.string()
			.describe("Nombre del proyecto (ej: LiDAR volumétrico, arquitectura MCP, robot guía, hexápodo)"),
	}),
	execute: async ({ projectName }) => {
		const all = [
			...knowledgeBase.professional_projects,
			...knowledgeBase.personal_projects,
		];
		const term = projectName.toLowerCase();
		const project = all.find(
			(p) =>
				p.name.toLowerCase().includes(term) ||
				p.summary.toLowerCase().includes(term) ||
				p.tech.some((t) => t.toLowerCase().includes(term)),
		);

		if (!project) {
			return {
				type: "tech_stack",
				found: false,
				available: all.map((p) => ({ name: p.name, tech: p.tech })),
			};
		}

		// Enriquecer con contexto RAG sobre el proyecto
		const { context } = await findRelevantContextWithMeta(
			`arquitectura técnica stack ${project.name} decisiones diseño`,
		);

		return {
			type: "tech_stack",
			found: true,
			name: project.name,
			tech: project.tech,
			summary: project.summary,
			details: project.details,
			year: project.year,
			status: project.status,
			ragContext: context,
			action: "navigate",
			section: "projects",
		};
	},
});

// ============================================
// PROMPT BASE
// ============================================

const BASE_PROMPT = `Eres "Miguel AI" — el agente de ventas y representante técnico del portfolio de Miguel Chumacero.
Misión: convertir cada conversación en una oportunidad de demostrar el valor único de Miguel para roles como AI Engineer Jr., con foco en agentes, LLMs, RAG y automatización.

Perfil real de Miguel:
- AI Engineer Jr. con formación en Ingeniería Mecatrónica en la UNI (Lima, Perú)
- Experiencia en agentes conversacionales, arquitectura MCP, RAG, embeddings y agentic workflows
- APIs LLM: OpenAI, Anthropic, Google AI y Groq — sabe elegir el modelo correcto según el caso
- Stack principal: Python, FastAPI, TypeScript/Next.js, Docker, n8n, LangChain, LangGraph
- Este chat mismo es evidencia: implementado con AI SDK, tool calling, RAG vectorial y streaming

## ORDEN AL MENCIONAR PROYECTOS
Cuando el usuario pregunte por proyectos, sigue este orden de presentación:
1. EXPERIENCIA INDUSTRIAL (Industrias Pacha SAC): mencionarla primero y brevemente como validación de IA en producción real (LiDAR, anomaly detection, visión computacional industrial)
2. PROYECTOS LLM/AGENTES — estos son los que definen el perfil, desarrollarlos con detalle:
   - Asistente de Productividad con IA (MCP): agentic workflows, MCP server, n8n, tool calling
   - Robot Guía Móvil con LLMs: LangChain, diálogo en lenguaje natural, pipeline NLP+TTS
   - Asistente Personal (LangGraph): agentes multi-etapa, flujos conversacionales avanzados
3. Proyectos adicionales según lo que pregunta el usuario

## HERRAMIENTAS (OBLIGATORIO USAR)
Siempre usa las herramientas disponibles ANTES de responder. Las herramientas tienen datos reales; tu conocimiento base no.
- searchKnowledge: búsqueda semántica en el CV/portfolio
- explainAIConcept: para preguntas sobre tecnologías de IA → úsala para demostrar profundidad técnica Y conectar con la experiencia de Miguel
- compareSkills: para evaluaciones de fit, requisitos de roles, perfiles de contratación
- getProjectTechStack: para preguntas sobre arquitectura o stack técnico de proyectos específicos
- showProjectDetails: para información general de proyectos
- navigateToSection: para llevar al usuario a la sección correcta del portfolio
- getContactInfo: para datos de contacto

## ESTILO (CARISMATICO Y SALES-ORIENTED)
- Habla con confianza y entusiasmo genuino sobre el trabajo de Miguel
- Español natural y fluido — nada de respuestas corporativas genéricas
- 3-5 oraciones directas. Hasta 8 para temas técnicos complejos
- Usa terminología AI de forma natural: "agentic workflows", "tool use", "retrieval augmented generation", "embeddings vectoriales"
- Incluye métricas concretas cuando existan; nunca inventes números
- Cierra cada respuesta con un call-to-action: ver proyectos, descargar CV, contactar, hacer otra pregunta
- NUNCA inventes logros, cargos, cifras, clientes o tecnologías no confirmadas

## FOLLOW-UP SUGGESTIONS (OBLIGATORIO)
Al FINAL de cada respuesta, SIEMPRE agrega exactamente esto (incluyendo el delimitador):
---FOLLOWUPS---["pregunta corta 1","pregunta corta 2","pregunta corta 3"]

Las preguntas deben ser cortas (máx 8 palabras), relevantes al tema y variadas.
Ejemplo: ---FOLLOWUPS---["¿Qué proyectos usaron LangGraph?","¿Cómo descargo el CV?","¿Cuál es su experiencia con RAG?"]

## LÍMITES
- SOLO respondes sobre Miguel Chumacero y su trabajo
- Si la pregunta no es sobre Miguel, responde: "Solo puedo ayudarte con información sobre Miguel y su trabajo. ¿Te gustaría saber sobre sus proyectos, experiencia o habilidades?"
- Incluye igualmente el bloque ---FOLLOWUPS--- al final`;

// ============================================
// DETECCIÓN DE INTENT SERVER-SIDE
// ============================================

function extractUserText(messages: unknown[]): string {
	const msgs = messages as Array<{ role?: string; content?: unknown; parts?: unknown[] }>;
	const lastUser = [...msgs].reverse().find((m) => m.role === "user");
	if (!lastUser) return "";

	if (typeof lastUser.content === "string") return lastUser.content;

	if (lastUser.parts && Array.isArray(lastUser.parts)) {
		return lastUser.parts
			.filter((p: unknown) => (p as { type?: string }).type === "text")
			.map((p: unknown) => (p as { text?: string }).text || "")
			.join(" ");
	}

	if (Array.isArray(lastUser.content)) {
		return lastUser.content
			.filter((c: unknown) => (c as { type?: string }).type === "text")
			.map((c: unknown) => (c as { text?: string }).text || "")
			.join(" ");
	}

	return "";
}

function getIntentInstruction(userText: string): string {
	const t = userText.toLowerCase().trim();
	const isOnTopic = /\b(miguel|chumacero|portfolio|portafolio|cv|curr[ií]culum|curriculum|resume|proyecto|proyectos|experiencia|habilidad|skills|stack|contacto|llm|llms|agente|agentes|rag|mcp|openai|langchain|langgraph|ia|ai|embedding|embeddings|inglés|ingles|idioma|idiomas|language|languages|english)\b/i.test(t);

	// Saludo simple → sin herramientas, respuesta directa
	if (/^(hola|hi|hey|buenas|saludos|hello|good morning|buenas tardes|buenas noches)[\s!.?]*$/.test(t)) {
		return "\n\nEl usuario dijo un saludo. Responde directamente con un saludo amistoso, preséntate como 'Miguel AI' y ofrece ayuda. NO llames a ninguna herramienta. Incluye el bloque ---FOLLOWUPS--- al final.";
	}

	// Detección de preguntas fuera de tema
	const offTopicPatterns = [
		/^(qué|que|cuál|cual|cómo|como|dónde|donde|cuánto|cuanto|por qué|porque)\s+(es|son|fue|era|está|hay|significa|queda)/i,
		/^(escribe|genera|crea|haz|programa|resuelve|traduce|dame el código|write|code)/i,
		/\b(ayuda con|help with|fix this|debug|resolver este|capital de|receta|clima|presidente|película|canción)\b/i,
		/\b(quién ganó|who won|cuánto es|math|calculate|conversión|convertir)\b/i,
	];

	if (!isOnTopic && offTopicPatterns.some((p) => p.test(t))) {
		return "\n\nEsta pregunta NO es sobre Miguel Chumacero. Responde amablemente que solo puedes ayudar con información sobre Miguel. Incluye igualmente el bloque ---FOLLOWUPS--- al final con preguntas sobre Miguel.";
	}

	// Conceptos de IA → explainAIConcept
	if (/\b(qu[eé] es|c[oó]mo funciona|expl[ií]ca|qu[eé] significa|defin[eé])\b.*\b(rag|mcp|agente|embedding|function calling|agentic|llm|prompt|vector|transformer|rlhf|fine.?tun)\b/i.test(t) ||
		/\b(rag|mcp|agente|embedding|function calling|agentic workflow)\b.*\b(qu[eé]|c[oó]mo|explicar)\b/i.test(t)) {
		const conceptMatch = t.match(/\b(rag|mcp|agentes?|embeddings?|function calling|agentic workflows?|llms?)\b/i);
		const concept = conceptMatch ? conceptMatch[0] : "IA";
		return `\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a explainAIConcept con concept '${concept}'. 2) Si es relevante, llama a searchKnowledge para más contexto sobre la experiencia de Miguel. 3) Explica el concepto Y conecta con la experiencia real de Miguel de forma entusiasta.`;
	}

	// Fit para contratación / comparación de skills
	if (/\b(requisitos?|fit|candidato|reclutador|recruiter|contratar|hire|hiring|vacante|puesto|perfil.*rol|comparar|compara|cumple|apto|ideal)\b/i.test(t)) {
		const roleMatch = t.match(/\b(ai engineer|ml engineer|data scientist|fullstack|backend|frontend|senior|junior)\b/i);
		const role = roleMatch ? roleMatch[0] : "AI Engineer";
		return `\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a compareSkills con role '${role}'. 2) Llama a searchKnowledge con query 'fortalezas clave perfil AI Engineer Jr de Miguel para oportunidades laborales'. 3) Presenta el fit de forma convincente resaltando puntos fuertes.`;
	}

	// Arquitectura técnica / stack de un proyecto
	if (/\b(arquitectura|stack t[eé]cnico|c[oó]mo construyo|c[oó]mo est[aá] hecho|tecnolog[ií]as que us[oó]|dise[nñ]o t[eé]cnico|implementaci[oó]n)\b/i.test(t)) {
		const projectMatch = t.match(/\b(lidar|geolocali|anomal|mcp|robot|hex[aá]podo|dom[oó]tico|dron|multi.?agent|portfolio|chat)\b/i);
		if (projectMatch) {
			return `\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a getProjectTechStack con projectName '${projectMatch[0]}'. 2) Explica la arquitectura técnica con detalle, las decisiones de diseño y los desafíos resueltos.`;
		}
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a searchKnowledge con query 'stack tecnológico arquitectura proyectos Miguel'. 2) Explica las decisiones técnicas de sus proyectos principales.";
	}

	// Proyectos (general)
	if (/proyect/i.test(t) && !/[a-z]+ específico/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a searchKnowledge con query 'proyectos de Miguel Chumacero'. 2) Llama a navigateToSection con section 'projects'. 3) Presenta primero la experiencia industrial (Pacha, brevemente), luego enfócate en los proyectos de LLMs y agentes: Asistente MCP, Robot Guía con LangChain, Asistente Personal con LangGraph.";
	}

	// Proyecto específico por keyword
	const projectKeywords: [RegExp, string][] = [
		[/lidar|volumétric|volumetric|reconstrucción 3d/i, "LiDAR volumétrico"],
		[/geolocali|postes|urbano/i, "geolocalización urbana"],
		[/anomal/i, "anomalías"],
		[/mcp|productividad|telegram|workflow/i, "arquitectura mcp"],
		[/robot guía|robot.*guia|guía.*robot/i, "robot guía"],
		[/hexápodo|hexapodo/i, "hexápodo"],
		[/domótico|domotico|home|iot(?! )/i, "domótico"],
		[/dron|drone|vuelo/i, "drones"],
		[/multi.?agent|asistente personal/i, "asistente personal"],
	];

	for (const [pattern, keyword] of projectKeywords) {
		if (pattern.test(t)) {
			return `\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a showProjectDetails con projectName '${keyword}'. 2) Llama a navigateToSection con section 'projects'. 3) Explica el proyecto con sus detalles técnicos e impacto.`;
		}
	}

	// Experiencia laboral
	if (/experiencia|trabajo|empresa|pacha|cami|profesional|rol |cargo/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a searchKnowledge con query 'experiencia laboral profesional de Miguel'. 2) Llama a navigateToSection con section 'experience'. 3) Responde destacando logros concretos con métricas.";
	}

	// Habilidades / stack
	if (/habilidad|skill|tecnolog|stack|python|typescript|react|librer[ií]as|frameworks/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a searchKnowledge con query 'habilidades técnicas stack de Miguel'. 2) Llama a navigateToSection con section 'skills'. 3) Explica las áreas de expertise con entusiasmo.";
	}

	// Contacto
	if (/contact|email|github|comunicar|escribir|hablar|mensaje|reach/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a getContactInfo con type 'all'. 2) Llama a navigateToSection con section 'contact'. 3) Proporciona los datos y ofrece ayuda adicional.";
	}

	// CV / descargar
	if (/cv|curr[ií]culum|curriculum|descargar|download|resume/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: Llama a downloadCV. Confirma la descarga y ofrece más información.";
	}

	// Educación
	if (/educaci[oó]n|estudio|universidad|carrera|título|uni\b/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a searchKnowledge con query 'educación académica de Miguel'. 2) Llama a navigateToSection con section 'education'. 3) Responde con la información obtenida.";
	}

	// Idiomas / inglés
	if (/idioma|ingl[eé]s|english|habla.*ingl|nivel.*ingl|bilingü?e|bilingual|certific.*idioma|icpna/i.test(t)) {
		return "\n\n[ACCIÓN OBLIGATORIA]: 1) Llama a searchKnowledge con query 'inglés avanzado ICPNA certificación idiomas educación Miguel Chumacero'. 2) Confirma directamente que Miguel tiene nivel Inglés Avanzado, completado en el ICPNA entre 2018 y 2022. NO digas que no puedes responder sobre Miguel.";
	}

	// Preguntas generales que necesitan búsqueda
	return "\n\n[ACCIÓN OBLIGATORIA]: Llama a searchKnowledge con la pregunta del usuario como query. Responde basándote exclusivamente en la información obtenida. Si la información recuperada no es relevante, busca una segunda vez con una variación de la query antes de concluir que no hay información disponible.";
}

// ============================================
// TOOLS MAP (constante, no se recrea)
// ============================================

const TOOLS = {
	searchKnowledge,
	navigateToSection,
	downloadCV,
	getContactInfo,
	showProjectDetails,
	explainAIConcept,
	compareSkills,
	getProjectTechStack,
} as const;

// ============================================
// ENDPOINT API
// ============================================

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();

		// Extraer texto del último mensaje y detectar intent
		const userText = extractUserText(messages);
		const intentInstruction = getIntentInstruction(userText);

		// Últimos 10 mensajes para contexto conversacional amplio
		const trimmedMessages = messages.slice(-10);

		// Crear agente con instrucciones dinámicas según el intent
		const agent = new ToolLoopAgent({
			model: openai("gpt-4o-mini"),
			instructions: BASE_PROMPT + intentInstruction,
			tools: TOOLS,
			temperature: 0.3,
			maxOutputTokens: 500,
			stopWhen: stepCountIs(4),
		});

		return createAgentUIStreamResponse({
			agent,
			uiMessages: trimmedMessages,
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
