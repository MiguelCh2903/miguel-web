"use client";

import { Mail, Sparkles } from "lucide-react";
import { DownloadCVButton } from "@/components/download-cv-button";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/contact-info";

const SKILLS = [
  "AI",
  "Deep Learning",
  "Computer Vision",
  "LLMs & Agentes",
  "Python",
  "TensorFlow",
  "PyTorch",
  "Robótica",
  "RAG",
  "LangChain",
  "LangGraph",
  "FastAPI",
  "Docker",
  "n8n",
  "OpenCV",
  "ROS2",
  "TypeScript",
  "OpenAI API",
  "MCP",
  "Anthropic",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute right-0 top-1/2 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-muted-foreground">{contactInfo.tagline}</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold leading-normal tracking-tight text-transparent sm:text-6xl md:text-7xl md:leading-normal">
            {contactInfo.name}
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-2xl text-lg leading-[1.7] text-muted-foreground sm:text-xl sm:leading-[1.7]">
            Experiencia en{" "}
            {contactInfo.expertise.map((skill, index) => (
              <span key={skill}>
                <strong className="font-semibold text-foreground">
                  {skill}
                </strong>
                {index < contactInfo.expertise.length - 1 &&
                  (index === contactInfo.expertise.length - 2 ? " y " : ", ")}
              </span>
            ))}
            . Transformando ideas en soluciones tecnológicas de vanguardia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="gap-2 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => {
                window.location.href = `mailto:${contactInfo.email}`;
              }}
            >
              <Mail className="h-4 w-4" />
              Contactar
            </Button>
            <DownloadCVButton />
            <Button
              size="lg"
              variant="outline"
              className="gap-2 hover:shadow-sm transition-shadow"
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Ver Proyectos
            </Button>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex items-center gap-4">
            <a
              href={contactInfo.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-all duration-200 hover:bg-muted hover:text-primary hover:shadow-sm active:scale-95"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="GitHub"
              >
                <title>GitHub</title>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Skills Marquee */}
          <div className="relative mt-16 w-full max-w-2xl overflow-hidden marquee-container">
            {/* Fade left */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10" />
            {/* Fade right */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="flex gap-3 marquee-track">
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm whitespace-nowrap"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
