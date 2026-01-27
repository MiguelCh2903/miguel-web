/**
 * Configuración del orden de las secciones del portfolio
 *
 * Para cambiar el orden, simplemente reordena los elementos del array.
 * Puedes comentar o descomentar secciones para mostrarlas u ocultarlas.
 */

import { Hero } from "./Hero";
import { EducationSection } from "./Education";
import { SkillsSection } from "./Skills";
import { ExperienceSection } from "./Experience";
import { ProjectsSection } from "./Projects";
import { ContactSection } from "./Contact";
import { Footer } from "./Footer";

export const sections = [
  { id: "hero", component: Hero, name: "Hero" },
  { id: "education", component: EducationSection, name: "Educación" },
  { id: "skills", component: SkillsSection, name: "Habilidades" },
  { id: "experience", component: ExperienceSection, name: "Experiencia" },
  { id: "projects", component: ProjectsSection, name: "Proyectos" },
  { id: "contact", component: ContactSection, name: "Contacto" },
  { id: "footer", component: Footer, name: "Footer" },
] as const;

// Ejemplo: Si quieres cambiar el orden, solo reorganiza:
// export const sections = [
//   { id: "hero", component: Hero, name: "Hero" },
//   { id: "skills", component: SkillsSection, name: "Habilidades" },
//   { id: "experience", component: ExperienceSection, name: "Experiencia" },
//   { id: "projects", component: ProjectsSection, name: "Proyectos" },
//   { id: "education", component: EducationSection, name: "Educación" },
// ];
