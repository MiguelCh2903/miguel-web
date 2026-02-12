"use client";

import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  id: number;
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

// Datos estáticos de proyectos con imágenes predefinidas
const projects: Project[] = [
  {
    id: 1,
    title: "Asistente de Productividad con IA",
    description:
      "Aplicación de gestión de proyectos basada en IA conversacional con arquitectura MCP y flujos orquestados con n8n, integrando LLMs para gestionar tareas, calendario y notas",
    images: ["/projects/productivity-mcp/1.avif"],
    tags: [
      "MCP",
      "Next.js",
      "TypeScript",
      "OpenAI",
      "n8n",
      "Telegram Bot",
      "Prisma",
    ],
  },
  {
    id: 4,
    title: "Robot Guía Móvil con LLMs",
    description:
      "Robot móvil autónomo orientado a la atención de usuarios mediante interacción en lenguaje natural basada en modelos de lenguaje generativos",
    images: ["/projects/robot-guia/1.avif"],
    tags: ["LLMs", "LangChain", "OpenAI", "Python", "ESP32", "TTS"],
  },
  {
    id: 2,
    title: "Sistema LiDAR Volumétrico",
    description:
      "Estimación y reconstrucción volumétrica mediante aprendizaje no supervisado con tecnología LiDAR para aplicaciones industriales",
    images: [
      "/projects/lidar/1.avif",
      "/projects/lidar/2.avif",
      "/projects/lidar/3.avif",
    ],
    tags: ["Unsupervised Learning", "Computer Vision", "LiDAR", "Python"],
  },
  {
    id: 3,
    title: "Detección de Anomalías",
    description:
      "Sistema de ML para detección de anomalías en series temporales para aplicaciones industriales",
    images: ["/projects/anomalias/1.avif", "/projects/anomalias/2.avif"],
    tags: ["Machine Learning", "Time Series", "Python", "TensorFlow"],
  },
  {
    id: 7,
    title: "Geolocalización de Postes",
    description:
      "Sistema de detección y geolocalización automática de postes urbanos usando YOLO en Nvidia Jetson con integración de LiDAR y GPS",
    images: [
      "/projects/agentes/1.avif",
      "/projects/agentes/2.avif",
      "/projects/agentes/3.avif",
    ],
    tags: ["YOLO", "Nvidia Jetson", "Python", "LiDAR", "GPS"],
  },
  {
    id: 5,
    title: "Hexápodo con RL",
    description:
      "Robot hexápodo de exploración con movimiento optimizado mediante aprendizaje por refuerzo y visión artificial",
    images: [
      "/projects/hexapodo/1.avif",
      "/projects/hexapodo/2.avif",
      "/projects/hexapodo/3.gif",
    ],
    tags: ["Reinforcement Learning", "Computer Vision", "ROS2", "Python"],
  },
];

export function ProjectsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  const [cardImageIndexes, setCardImageIndexes] = useState<
    Record<number, number>
  >({});

  // Auto-rotate images in cards every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCardImageIndexes((prev) => {
        const newIndexes = { ...prev };
        for (const project of projects) {
          if (project.images.length > 1) {
            const currentIndex = prev[project.id] || 0;
            newIndexes[project.id] = (currentIndex + 1) % project.images.length;
          }
        }
        return newIndexes;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleNextImage = () => {
    if (selectedProject) {
      setDialogImageIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedProject) {
      setDialogImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1,
      );
    }
  };

  const openDialog = (project: Project) => {
    setSelectedProject(project);
    setDialogImageIndex(0);
  };

  return (
    <div className="py-12 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-3">
          <Rocket className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Proyectos Destacados</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[280px]">
          {projects.map((project, index) => {
            const currentImageIndex = cardImageIndexes[project.id] || 0;
            const currentImage = project.images[currentImageIndex];
            const isAward = project.id === 6;

            return (
              <button
                type="button"
                key={project.id}
                className={`
                  group relative overflow-hidden rounded-2xl border border-border bg-card
                  transition-all duration-500 ease-out cursor-pointer text-left
                  ${index === 0 || index === 5 ? "md:col-span-2 md:row-span-1" : "md:col-span-2"}
                  ${hoveredId === project.id ? "scale-[1.02] z-10 shadow-2xl border-primary/50" : "scale-100"}
                  ${hoveredId && hoveredId !== project.id ? "scale-[0.98] opacity-80" : ""}
                `}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => openDialog(project)}
              >
                {/* Background Image with Crossfade */}
                <div className="absolute inset-0">
                  {project.images.map((img, imgIdx) => (
                    <div
                      key={img}
                      className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
                      style={{
                        backgroundImage: `url(${img})`,
                        opacity: imgIdx === currentImageIndex ? 1 : 0,
                      }}
                    />
                  ))}
                  {/* Gradient overlay - always visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
                </div>

                {/* Award Badge */}
                {isAward && (
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    <span>Finalista</span>
                  </div>
                )}

                {/* Content - always visible */}
                <div className="relative h-full flex flex-col justify-end p-5 text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags - always visible */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[11px] font-medium bg-white/15 backdrop-blur-sm rounded-full border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-[11px] font-medium bg-white/10 backdrop-blur-sm rounded-full">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Image indicator */}
                  {project.images.length > 1 && (
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      {project.images.map((_, idx) => (
                        <div
                          key={`indicator-${project.id}-${idx}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex
                              ? "bg-white w-4"
                              : "bg-white/40 w-1.5"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Project Dialog */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedProject?.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {selectedProject?.description}
              </DialogDescription>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6">
                {/* Image Carousel */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                  <Image
                    src={selectedProject.images[dialogImageIndex]}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-contain"
                    priority
                    quality={85}
                    unoptimized={selectedProject.images[
                      dialogImageIndex
                    ].endsWith(".gif")}
                  />

                  {/* Navigation Buttons */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all md:opacity-0 md:group-hover:opacity-100"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {dialogImageIndex + 1} / {selectedProject.images.length}
                      </div>

                      {/* Dot Indicators */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {selectedProject.images.map((img, idx) => (
                          <button
                            type="button"
                            key={img}
                            onClick={() => setDialogImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === dialogImageIndex
                                ? "bg-white w-8"
                                : "bg-white/50 w-2 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
