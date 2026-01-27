import { Sparkles, Code, Brain, Cpu, Wrench } from "lucide-react";

const skillCategories = [
  {
    title: "Machine Learning & Computer Vision",
    icon: Brain,
    description: "Desarrollo de sistemas inteligentes",
    skills: [
      { name: "Python", level: "expert" },
      { name: "TensorFlow", level: "expert" },
      { name: "PyTorch", level: "expert" },
      { name: "OpenCV", level: "expert" },
      { name: "scikit-learn", level: "expert" },
      { name: "LangChain", level: "expert" },
      { name: "LangGraph", level: "expert" },
      { name: "OpenAI API", level: "expert" },
    ],
  },
  {
    title: "Desarrollo",
    icon: Code,
    description: "Frameworks y herramientas modernas",
    skills: [
      { name: "C/C++", level: "expert" },
      { name: "FastAPI", level: "expert" },
      { name: "TypeScript", level: "intermediate" },
      { name: "React", level: "intermediate" },
      { name: "Next.js", level: "intermediate" },
      { name: "PostgreSQL", level: "intermediate" },
      { name: "Git", level: "expert" },
    ],
  },
  {
    title: "Robótica & Sistemas Autónomos",
    icon: Cpu,
    description: "Infraestructura y control inteligente",
    skills: [
      { name: "ROS2", level: "expert" },
      { name: "Linux", level: "expert" },
      { name: "Docker", level: "intermediate" },
      { name: "LiDAR", level: "expert" },
      { name: "Sensores", level: "expert" },
      { name: "Control Adaptativo", level: "expert" },
    ],
  },
  {
    title: "Hardware & Diseño",
    icon: Wrench,
    description: "Mecatrónica y prototipado",
    skills: [
      { name: "SolidWorks", level: "expert" },
      { name: "Fusion 360", level: "expert" },
      { name: "KiCad", level: "expert" },
      { name: "Prototipado", level: "expert" },
      { name: "PCB Design", level: "expert" },
      { name: "Arduino/ESP32", level: "expert" },
    ],
  },
];

const levelColors = {
  expert: "bg-primary text-primary-foreground",
  intermediate: "bg-muted text-foreground",
};

const levelLabels = {
  expert: "Experto",
  intermediate: "Intermedio",
};

export function SkillsSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Habilidades</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Especialización en desarrollo de sistemas inteligentes, visión
            artificial y automatización con aprendizaje automático
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group rounded-lg border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                {/* Category Header */}
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="group/skill relative">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                          levelColors[skill.level as keyof typeof levelColors]
                        } hover:scale-105`}
                      >
                        {skill.name}
                      </span>
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/skill:opacity-100">
                        {levelLabels[skill.level as keyof typeof levelLabels]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
