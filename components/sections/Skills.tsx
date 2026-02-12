import { Brain, Code, Cpu, Sparkles } from "lucide-react";

const skillCategories = [
  {
    title: "Inteligencia Artificial Generativa & LLMs",
    icon: Brain,
    description: "Desarrollo de agentes inteligentes y sistemas conversacionales",
    skills: [
      "AI Agents",
      "Agentic Workflows",
      "LangChain",
      "Prompt Engineering",
      "RAG",
      "MCPs",
      "Chroma",
      "OpenAI API",
      "Anthropic API",
      "Google AI",
      "N8N",
    ],
  },
  {
    title: "Desarrollo de Software & MLOps",
    icon: Code,
    description: "Backend, APIs y herramientas modernas",
    skills: [
      "Python",
      "FastAPI",
      "Git",
      "Docker",
      "Linux",
      "PostgreSQL",
      "MongoDB",
      "TypeScript",
      "React",
    ],
  },
  {
    title: "Machine Learning & Computer Vision",
    icon: Sparkles,
    description: "Modelos de aprendizaje profundo y visión artificial",
    skills: [
      "PyTorch",
      "TensorFlow",
      "YOLO",
      "OpenCV",
      "NLP",
    ],
  },
  {
    title: "Robótica & Sistemas Embebidos",
    icon: Cpu,
    description: "Control autónomo y sistemas inteligentes",
    skills: [
      "ROS2",
      "C/C++",
      "Reinforcement Learning",
      "Arduino/ESP32",
      "LiDAR",
    ],
  },
];

export function SkillsSection() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Habilidades</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Especialización en desarrollo de agentes de IA, sistemas conversacionales
            y automatización con modelos de lenguaje de última generación
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
                    <span
                      key={skillIndex}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-primary/20 hover:scale-105 cursor-default"
                    >
                      {skill}
                    </span>
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
