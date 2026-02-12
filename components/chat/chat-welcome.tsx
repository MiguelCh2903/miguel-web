"use client";

import { Bot, Briefcase, Cpu, Rocket, Users } from "lucide-react";

interface StarterCard {
  icon: typeof Bot;
  label: string;
  description: string;
  message: string;
}

const STARTER_CARDS: StarterCard[] = [
  {
    icon: Cpu,
    label: "Experiencia en IA",
    description: "RAG, agentes, LLMs",
    message: "¿Cuál es la experiencia de Miguel en IA y agentes?",
  },
  {
    icon: Rocket,
    label: "Proyectos destacados",
    description: "Portfolio técnico",
    message: "Muéstrame los proyectos más destacados de Miguel",
  },
  {
    icon: Briefcase,
    label: "Stack tecnológico",
    description: "Herramientas y frameworks",
    message: "¿Cuál es el stack tecnológico de Miguel?",
  },
  {
    icon: Users,
    label: "Fit para tu equipo",
    description: "Evaluación de candidato",
    message: "¿Cómo se compara Miguel con los requisitos de un AI Engineer?",
  },
];

interface ChatWelcomeProps {
  onSendMessage: (message: string) => void;
}

export function ChatWelcome({ onSendMessage }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6">
      {/* Avatar + Status */}
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Bot className="h-8 w-8" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-base font-semibold text-foreground">Miguel AI</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Agente RAG con tool calling
        </p>
      </div>

      {/* Intro text */}
      <p className="text-center text-sm text-muted-foreground leading-relaxed max-w-[260px]">
        Soy el asistente de{" "}
        <span className="font-medium text-foreground">Miguel Chumacero</span>.
        Pregúntame sobre su experiencia, proyectos o habilidades en IA.
      </p>

      {/* Starter cards grid */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {STARTER_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onSendMessage(card.message)}
              className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground leading-tight">
                  {card.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
