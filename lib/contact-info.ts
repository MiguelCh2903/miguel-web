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
  tagline: "Ingeniería Mecatrónica",
  description:
    "Desarrollador especializado en sistemas inteligentes, visión artificial y automatización avanzada. Transformando ideas en soluciones tecnológicas de vanguardia.",

  // Áreas de especialización
  expertise: ["Desarrollo de Software", "Inteligencia Artificial", "Sistemas Autónomos"],

  // CV
  cv: {
    filename: "Miguel_Chumacero_CV.pdf",
    path: "/cv.pdf",
  },
} as const;
