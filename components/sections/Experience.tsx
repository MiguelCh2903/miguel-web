import { Briefcase, ChevronRight } from "lucide-react";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "Industrias Pacha SAC",
    role: "Desarrollador de IA y Visión Computacional",
    period: "Abril 2025 - Enero 2026",
    description:
      "Desarrollo de soluciones de visión computacional e inteligencia artificial para aplicaciones industriales. Implementación de tecnologías avanzadas de sensores LiDAR y sistemas de detección automatizada para optimización de procesos y análisis de datos urbanos.",
    highlights: [
      "Desarrollo de sistema de estimación y reconstrucción volumétrica mediante IA no supervisada con tecnología LiDAR para aplicaciones industriales",
      "Diseño e implementación de interfaz gráfica de visualización 3D para reconstrucción de geometrías complejas",
      "Implementación de modelo de IA para detección de anomalías en series temporales",
      "Calibración de sistemas LiDAR-cámara y diseño de carcasa funcional para entornos industriales",
      "Desarrollo de sistema de geolocalización de elementos urbanos mediante visión computacional",
    ],
  },
  {
    company: "Centro Avanzado de Mecatrónica Inteligente (CAMI-UNI)",
    role: "Investigador & Project Lead",
    period: "Enero 2024 - Diciembre 2025",
    description:
      "Universidad Nacional de Ingeniería · Unidad de Investigación de la Facultad de Ingeniería Mecánica",
    highlights: [
      "Participación activa en proyectos de mecatrónica enfocados en Inteligencia Artificial, Visión Computacional, Robótica, IoT y Automatización",
      "Liderazgo en proyectos de IA, coordinando equipos multidisciplinarios para el desarrollo de soluciones inteligentes",
      "Experiencia en trabajo colaborativo, contribuyendo a proyectos en equipo con enfoque en innovación tecnológica",
      "Desarrollo de agentes conversacionales inteligentes que permiten interacción natural y contextual con sistemas automatizados",
      "Integración de sistemas robóticos con control autónomo mediante aprendizaje por refuerzo",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Experiencia</h2>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-10">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Company & Role */}
              <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold">{exp.company}</h3>
                    <p className="mt-1 text-lg font-medium text-primary">
                      {exp.role}
                    </p>
                  </div>
                  <span className="text-base font-medium text-muted-foreground">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-3">
                {exp.highlights.map((highlight, hIndex) => (
                  <li
                    key={hIndex}
                    className="flex gap-3 text-base leading-relaxed"
                  >
                    <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
