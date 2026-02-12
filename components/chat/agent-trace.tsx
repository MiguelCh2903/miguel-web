"use client";

import {
  ArrowRight,
  BarChart2,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  Download,
  FileText,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Rocket,
  Scale,
  Search,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { ChatPart, RAGSource, TraceStep } from "@/lib/chat-types";

// ============================================
// HELPERS
// ============================================

function getToolIcon(toolName: string) {
  switch (toolName) {
    case "navigateToSection":   return MapPin;
    case "downloadCV":           return Download;
    case "getContactInfo":       return Mail;
    case "searchKnowledge":      return Search;
    case "showProjectDetails":   return Rocket;
    case "explainAIConcept":     return Sparkles;
    case "compareSkills":        return Scale;
    case "getProjectTechStack":  return Layers;
    default:                     return Bot;
  }
}

function getToolLabel(toolName: string): string {
  switch (toolName) {
    case "searchKnowledge":     return "RAG: búsqueda semántica";
    case "navigateToSection":   return "Navegando a sección";
    case "downloadCV":           return "Preparando descarga de CV";
    case "getContactInfo":       return "Consultando datos de contacto";
    case "showProjectDetails":   return "Cargando detalles del proyecto";
    case "explainAIConcept":     return "Explicando concepto de IA";
    case "compareSkills":        return "Comparando habilidades con el rol";
    case "getProjectTechStack":  return "Analizando arquitectura técnica";
    default:                     return "Ejecutando herramienta";
  }
}

function inferIntent(toolSteps: TraceStep[]): string {
  const names = toolSteps.map((s) => s.toolName).filter(Boolean);
  if (names.includes("explainAIConcept"))    return "Concepto IA";
  if (names.includes("compareSkills"))       return "Evaluación de fit";
  if (names.includes("getProjectTechStack")) return "Stack técnico";
  if (names.includes("showProjectDetails"))  return "Detalle de proyecto";
  if (names.includes("downloadCV"))          return "Descarga CV";
  if (names.includes("getContactInfo"))      return "Contacto";
  if (names.includes("searchKnowledge")) {
    const searchStep = toolSteps.find((s) => s.toolName === "searchKnowledge");
    const query = (searchStep?.input as { query?: string } | undefined)?.query;
    if (query) {
      const short = query.length > 32 ? `${query.slice(0, 32)}…` : query;
      return `RAG · "${short}"`;
    }
    return "Búsqueda RAG";
  }
  if (names.includes("navigateToSection"))   return "Navegación";
  return "Respuesta directa";
}

function buildTraceSteps(parts: ChatPart[]): TraceStep[] {
  const hasText = parts.some((p) => p.type === "text" && p.text?.trim());

  // AI SDK v6: tool parts are type "dynamic-tool" with state machine.
  // Multiple parts can share the same toolCallId (streaming → input-available → output-available).
  // Keep the most complete state per tool call.
  const toolMap = new Map<string, ChatPart & { toolName: string }>();
  for (const p of parts) {
    if (p.type === "dynamic-tool" && p.toolName) {
      const key = p.toolCallId ?? p.toolName;
      const existing = toolMap.get(key);
      // Prefer output-available over earlier states
      if (!existing || p.state === "output-available" || p.state === "output-failed") {
        toolMap.set(key, p as ChatPart & { toolName: string });
      }
    }
  }

  const toolCalls = Array.from(toolMap.values());

  const steps: TraceStep[] = [
    { id: "intent", label: "Analizando intención", status: "done" },
  ];

  for (let i = 0; i < toolCalls.length; i++) {
    const call = toolCalls[i];
    const callId = call.toolCallId ?? `${call.toolName}-${i}`;
    const isDone = call.state === "output-available";
    const output = isDone ? (call.output as Record<string, unknown>) : undefined;

    let sources: RAGSource[] | undefined;
    if (output && Array.isArray((output as { sources?: unknown }).sources)) {
      sources = (output as { sources: RAGSource[] }).sources;
    }

    steps.push({
      id: `tool-${callId}`,
      label: getToolLabel(call.toolName),
      status: isDone ? "done" : "running",
      toolName: call.toolName,
      input: call.input,
      output,
      sources,
    });
  }

  if (toolCalls.length > 0 || hasText) {
    steps.push({
      id: "compose",
      label: "Generando respuesta",
      status: hasText ? "done" : "running",
    });
  }

  return steps;
}

// ============================================
// RAG SOURCES PANEL
// ============================================

function SimilarityBar({ similarity }: { similarity: number }) {
  const pct = Math.round(similarity * 100);
  const color =
    similarity >= 0.7 ? "bg-green-500" : similarity >= 0.5 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground w-7 text-right shrink-0">{pct}%</span>
    </div>
  );
}

function RAGSourcesPanel({ sources }: { sources: RAGSource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <BarChart2 className="h-3 w-3" />
        <span>Chunks recuperados ({sources.length})</span>
      </div>
      {sources.map((src, i) => (
        <div key={i} className="rounded-md border border-border/50 bg-background/60 p-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-medium text-foreground">
              {src.category.replace(/_/g, " ")}
            </span>
            <span className="text-[9px] text-muted-foreground font-mono">chunk {i + 1}</span>
          </div>
          <SimilarityBar similarity={src.similarity} />
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{src.preview}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// TOOL-SPECIFIC OUTPUT PANELS
// ============================================

function ToolInputPanel({ input }: { input: unknown }) {
  if (!input || typeof input !== "object" || Object.keys(input).length === 0) return null;
  return (
    <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-blue-400 mb-1.5">
        <ArrowRight className="h-3 w-3" />
        <span>Input</span>
      </div>
      <div className="space-y-0.5">
        {Object.entries(input as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex gap-1.5 text-[10px]">
            <span className="text-blue-400/70 font-mono shrink-0">{k}:</span>
            <span className="text-foreground/90 font-mono break-all">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchKnowledgeOutput({ output, sources }: { output: Record<string, unknown>; sources?: RAGSource[] }) {
  const content = output.content as string | undefined;
  return (
    <div className="space-y-1.5">
      {content && (
        <div className="rounded-md bg-muted/40 border border-border/40 p-2">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
            <FileText className="h-3 w-3" />
            <span>Contexto recuperado</span>
          </div>
          <p className="text-[10px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {content.length > 600 ? content.slice(0, 600) + "…" : content}
          </p>
        </div>
      )}
      {sources && sources.length > 0 && <RAGSourcesPanel sources={sources} />}
    </div>
  );
}

function ExplainConceptOutput({ output }: { output: Record<string, unknown> }) {
  const explanation = output.explanation as string | undefined;
  const miguelContext = output.miguelContext as string | undefined;
  return (
    <div className="space-y-1.5">
      {explanation && (
        <div className="rounded-md bg-muted/40 border border-border/40 p-2">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
            <Brain className="h-3 w-3" />
            <span>Concepto</span>
          </div>
          <p className="text-[10px] text-foreground/80 leading-relaxed">
            {explanation.length > 400 ? explanation.slice(0, 400) + "…" : explanation}
          </p>
        </div>
      )}
      {miguelContext && (
        <div className="rounded-md bg-primary/5 border border-primary/20 p-2">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-primary/70 mb-1.5">
            <Bot className="h-3 w-3" />
            <span>En el contexto de Miguel</span>
          </div>
          <p className="text-[10px] text-foreground/80 leading-relaxed">
            {miguelContext.length > 400 ? miguelContext.slice(0, 400) + "…" : miguelContext}
          </p>
        </div>
      )}
    </div>
  );
}

function CompareSkillsOutput({ output }: { output: Record<string, unknown> }) {
  const required = output.requiredSkills as string[] | undefined;
  const nice = output.niceToHave as string[] | undefined;
  const miguelProfile = output.miguelProfile as string | undefined;
  return (
    <div className="space-y-1.5">
      {required && required.length > 0 && (
        <div className="rounded-md bg-muted/40 border border-border/40 p-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">Requisitos del rol</div>
          <div className="flex flex-wrap gap-1">
            {required.map((s) => (
              <span key={s} className="text-[9px] rounded px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {nice && nice.length > 0 && (
        <div className="rounded-md bg-muted/40 border border-border/40 p-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">Nice to have</div>
          <div className="flex flex-wrap gap-1">
            {nice.map((s) => (
              <span key={s} className="text-[9px] rounded px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {miguelProfile && (
        <div className="rounded-md bg-muted/40 border border-border/40 p-2">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">Perfil RAG de Miguel</div>
          <p className="text-[10px] text-foreground/80 leading-relaxed">
            {miguelProfile.length > 400 ? miguelProfile.slice(0, 400) + "…" : miguelProfile}
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectOutput({ output }: { output: Record<string, unknown> }) {
  if (output.found === false) {
    return (
      <p className="text-[10px] text-muted-foreground italic">
        {(output.message as string) || "Proyecto no encontrado"}
      </p>
    );
  }
  const tech = output.tech as string[] | undefined;
  const details = (output.details as string | undefined) ?? (output.ragContext as string | undefined);
  const name = output.name as string | undefined;
  const year = output.year as string | undefined;
  const status = output.status as string | undefined;
  return (
    <div className="rounded-md bg-muted/40 border border-border/40 p-2 space-y-1.5">
      {name && (
        <div className="text-[11px] font-semibold text-foreground">{name}</div>
      )}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        {year && <span>📅 {year}</span>}
        {status && <span>● {status}</span>}
      </div>
      {tech && tech.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tech.map((t) => (
            <span key={t} className="text-[9px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground border border-border/50">
              {t}
            </span>
          ))}
        </div>
      )}
      {details && (
        <p className="text-[10px] text-foreground/80 leading-relaxed">
          {details.length > 400 ? details.slice(0, 400) + "…" : details}
        </p>
      )}
    </div>
  );
}

function ContactOutput({ output }: { output: Record<string, unknown> }) {
  const data = output.data as Record<string, string> | undefined;
  if (!data) return null;
  return (
    <div className="rounded-md bg-muted/40 border border-border/40 p-2 space-y-0.5">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex gap-1.5 text-[10px]">
          <span className="text-muted-foreground font-mono capitalize shrink-0">{k}:</span>
          <span className="text-foreground break-all">{v}</span>
        </div>
      ))}
    </div>
  );
}

function NavigateOutput({ output }: { output: Record<string, unknown> }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-green-400">
      <MapPin className="h-3 w-3" />
      <span>
        → <span className="font-medium">{(output.title as string) ?? output.section}</span>
      </span>
    </div>
  );
}

function ToolOutputPanel({ step }: { step: TraceStep }) {
  const output = step.output as Record<string, unknown> | undefined;
  if (!output) return null;

  switch (step.toolName) {
    case "searchKnowledge":
      return <SearchKnowledgeOutput output={output} sources={step.sources} />;
    case "explainAIConcept":
      return <ExplainConceptOutput output={output} />;
    case "compareSkills":
      return <CompareSkillsOutput output={output} />;
    case "showProjectDetails":
    case "getProjectTechStack":
      return <ProjectOutput output={output} />;
    case "getContactInfo":
      return <ContactOutput output={output} />;
    case "navigateToSection":
      return <NavigateOutput output={output} />;
    case "downloadCV":
      return (
        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
          <Download className="h-3 w-3" />
          <span>Archivo: {output.filename as string}</span>
        </div>
      );
    default:
      return null;
  }
}

// ============================================
// TOOL STEP CARD
// ============================================

function ToolStepCard({ step }: { step: TraceStep }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = step.toolName ? getToolIcon(step.toolName) : Bot;
  const isRunning = step.status === "running";

  // For searchKnowledge, sources come via step.sources
  // For other tools, we render output-specific panels
  const hasInput = Boolean(step.input && typeof step.input === "object" && Object.keys(step.input as object).length > 0);
  const hasOutput = Boolean(step.output);
  const hasDetails = hasInput || hasOutput;

  return (
    <div className="rounded-md border border-border/50 bg-background/40 overflow-hidden">
      <button
        type="button"
        onClick={() => hasDetails && setExpanded((v) => !v)}
        className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors ${
          hasDetails ? "hover:bg-muted/30 cursor-pointer" : "cursor-default"
        }`}
      >
        {isRunning ? (
          <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
        ) : (
          <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
        )}
        <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
        <span className={`flex-1 text-[11px] ${isRunning ? "text-foreground" : "text-muted-foreground"}`}>
          {step.label}
        </span>
        {/* RAG badge */}
        {step.sources && step.sources.length > 0 && (
          <span className="text-[9px] rounded px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 font-mono">
            RAG ×{step.sources.length}
          </span>
        )}
        {hasDetails && (
          expanded
            ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expandable details */}
      <div className={`agent-trace-content ${expanded ? "agent-trace-open" : ""}`}>
        <div className="px-2.5 pb-2.5 space-y-1.5">
          {hasInput && <ToolInputPanel input={step.input} />}
          <ToolOutputPanel step={step} />
          {/* For searchKnowledge, output panel handles sources internally */}
          {/* For other tools that might also have RAG sources as a side effect */}
          {step.toolName !== "searchKnowledge" && step.sources && step.sources.length > 0 && (
            <RAGSourcesPanel sources={step.sources} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface AgentTraceProps {
  parts: ChatPart[];
}

export function AgentTrace({ parts }: AgentTraceProps) {
  const [expanded, setExpanded] = useState(false);

  const steps = buildTraceSteps(parts);
  if (steps.length === 0) return null;

  const toolSteps = steps.filter((s) => s.id !== "intent" && s.id !== "compose");
  const isComplete = steps.every((s) => s.status === "done");
  const runningStep = steps.find((s) => s.status === "running");
  const intent = inferIntent(toolSteps);
  const ragSteps = toolSteps.filter((s) => s.sources && s.sources.length > 0);
  const totalChunks = ragSteps.reduce((acc, s) => acc + (s.sources?.length ?? 0), 0);

  return (
    <div className="mb-2.5 rounded-lg border border-border/60 bg-muted/30 overflow-hidden">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted/40 transition-colors"
      >
        {isComplete ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
        ) : (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
        )}
        <span className="flex-1 text-[11px] font-medium text-muted-foreground">
          {isComplete
            ? toolSteps.length > 0
              ? `${intent} · ${toolSteps.length} herramienta${toolSteps.length !== 1 ? "s" : ""}`
              : intent
            : runningStep
              ? runningStep.label
              : "Pensando..."}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-1 shrink-0">
          {totalChunks > 0 && (
            <span className="text-[9px] rounded px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 font-mono">
              RAG ×{totalChunks}
            </span>
          )}
          <span className="text-[9px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground border border-border/50 font-mono">
            gpt-4o-mini
          </span>
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded steps */}
      <div className={`agent-trace-content ${expanded ? "agent-trace-open" : ""}`}>
        <div className="px-3 pb-3 space-y-1.5">

          {/* Intent step */}
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
            <Cpu className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-[11px] text-muted-foreground">Intent detectado:</span>
            <span className="text-[11px] text-foreground font-medium">{intent}</span>
          </div>

          {/* Tool steps */}
          {toolSteps.map((step) => (
            <ToolStepCard key={step.id} step={step} />
          ))}

          {/* Compose step */}
          {steps.find((s) => s.id === "compose") && (() => {
            const composeStep = steps.find((s) => s.id === "compose")!;
            return (
              <div className="flex items-center gap-2">
                {composeStep.status === "running" ? (
                  <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                )}
                <Bot className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className={`text-[11px] ${composeStep.status === "running" ? "text-foreground" : "text-muted-foreground"}`}>
                  Generando respuesta
                </span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
