import { Calendar, GraduationCap, MapPin } from "lucide-react";

interface EducationItem {
  degree: string;
  institution: string;
  faculty?: string;
  period: string;
  status: string;
  location: string;
  highlights?: string[];
}

const education: EducationItem[] = [
  {
    degree: "Ingeniería Mecatrónica",
    institution: "Universidad Nacional de Ingeniería",
    faculty: "Estudiante de Ingeniería Mecatrónica - 10mo ciclo",
    period: "2021 - Actualidad",
    status: "En curso",
    location: "Lima, Perú",
    highlights: [
      "Gestión, organización y participación en proyectos Mecatrónicos, participación en Expoferias tecnológicas y adquisición de conocimientos en Inteligencia Artificial, Agentes Conversacionales, Desarrollo de Software y Robótica.",
      "Director del área de Automatización y Robótica del Centro Avanzado de Mecatrónica Inteligente (Periodo 2024-2025)",
      "Cursos destacados: Inteligencia Artificial, Control de Procesos, Gestión de Proyectos",
    ],
  },
  {
    degree: "Inglés Avanzado",
    institution: "Instituto Cultural Peruano Norteamericano - ICPNA",
    period: "2018 - 2022",
    status: "Completado",
    location: "Lima, Perú",
  },
];

export function EducationSection() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Educación</h2>
        </div>

        {/* Education Cards */}
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div
              key={index}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-lg font-medium text-muted-foreground">
                    {edu.institution}
                  </p>
                  {edu.faculty && (
                    <p className="text-sm text-muted-foreground">
                      {edu.faculty}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{edu.location}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {edu.status}
                  </span>
                </div>

                {/* Highlights */}
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="mt-4">
                    <ul className="space-y-2">
                      {edu.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
