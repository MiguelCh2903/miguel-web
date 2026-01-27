// Información de contacto personal centralizada
// IMPORTANTE: Si actualizas esta información, también actualízala en lib/knowledge-base.json

export const contactInfo = {
  name: "Miguel Chumacero",
  email: "miguelangel.chumacerom@gmail.com",
  location: "Lima, Perú",

  social: {
    github: "https://github.com/miguelchumacero",
    linkedin: "https://www.linkedin.com/in/miguelchumacero",
  },

  // Bio corta para el Hero
  tagline: "Ingeniería Mecatrónica",
  description:
    "Desarrollador especializado en sistemas inteligentes, visión artificial y automatización avanzada. Transformando ideas en soluciones tecnológicas de vanguardia.",

  // Áreas de especialización
  expertise: ["Machine Learning", "Computer Vision", "Sistemas Autónomos"],

  // CV
  cv: {
    filename: "Miguel_Chumacero_CV.pdf",
    path: "/cv.pdf",
  },
} as const;
