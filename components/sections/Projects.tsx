"use client";

import { Rocket } from "lucide-react";
import { useState } from "react";

// Proyectos destacados - Priorizando IA y ML
const projects = [
  {
    id: 1,
    title: "Agentes Conversacionales",
    description:
      "Desarrollo de asistentes de productividad con LangGraph, RAG y servicios de IA (OpenAI, Deepgram, ElevenLabs)",
    image: "/placeholder-project-1.jpg",
    tags: ["LangChain", "RAG", "OpenAI", "Python"],
  },
  {
    id: 2,
    title: "Robot Guía con LLMs",
    description:
      "Prototipo de robot móvil basado en modelos de lenguaje para gestión autónoma de consultas en espacios de exposición",
    image: "/projects/eva.jpeg",
    tags: ["LLMs", "OpenAI", "ROS2", "Python"],
  },
  {
    id: 3,
    title: "Sistema LiDAR Volumétrico",
    description:
      "Estimación y reconstrucción volumétrica mediante aprendizaje no supervisado con tecnología LiDAR para aplicaciones industriales",
    image: "/projects/color_balls.png",
    tags: ["Unsupervised Learning", "Computer Vision", "LiDAR", "Python"],
  },
  {
    id: 4,
    title: "Hexápodo con RL",
    description:
      "Robot hexápodo de exploración con movimiento optimizado mediante aprendizaje por refuerzo y visión artificial",
    image: "/projects/hex.png",
    tags: ["Reinforcement Learning", "Computer Vision", "ROS2", "Python"],
  },
  {
    id: 5,
    title: "Detección de Anomalías",
    description:
      "Sistema de ML para detección de anomalías en series temporales para aplicaciones industriales",
    image: "/projects/sag02.png",
    tags: ["Machine Learning", "Time Series", "Python", "TensorFlow"],
  },
  {
    id: 6,
    title: "🏆 Robot Inchworm ISSSP",
    description:
      "Robot con adherencia electrostática y percepción multisensorial - Ganador de Spatial Payload Competition",
    image: "/placeholder-project-6.jpg",
    tags: ["Robótica", "Sensores", "Control", "Mecatrónica"],
  },
];

export function ProjectsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="proyectos" className="py-20 px-6 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-3">
          <Rocket className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Proyectos Destacados</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`
                group relative overflow-hidden rounded-2xl border border-border bg-card
                transition-all duration-500 ease-out cursor-pointer
                ${index === 0 || index === 5 ? "md:col-span-2 md:row-span-1" : "md:col-span-2"}
                ${hoveredId === project.id ? "scale-105 z-10 shadow-2xl" : "scale-100"}
                ${hoveredId && hoveredId !== project.id ? "scale-95 opacity-70" : ""}
              `}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundColor: `hsl(var(--muted))`,
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
