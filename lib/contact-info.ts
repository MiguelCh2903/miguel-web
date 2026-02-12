// Información de contacto personal centralizada
// IMPORTANTE: Si actualizas esta información, también actualízala en lib/knowledge-base.json

export const contactInfo = {
  name: "Miguel Chumacero",
  email: "miguel.chumacero.b@gmail.com",
  location: "Lima, Perú",

  social: {
    github: "https://github.com/MiguelCh2903",
  },

  // Bio corta para el Hero
  tagline: "AI Engineer Jr. | Agentes IA y LLMs",
  description:
    "Perfil enfocado en agentes de IA, LLMs, RAG y automatización inteligente, con experiencia aplicada en proyectos de visión computacional y sistemas reales.",

  // Áreas de especialización
  expertise: ["Agentes IA", "LLMs y RAG", "Automatización Inteligente"],

  // CV
  cv: {
    filename: "Miguel_Chumacero_CV.pdf",
    path: "/cv.pdf",
  },
} as const;
