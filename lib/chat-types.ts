// Shared types for the AI chat system

export interface RAGSource {
  category: string;
  similarity: number;
  preview: string;
}

export interface ToolResultData {
  type?: string;
  content?: string;
  action?: string;
  section?: string;
  title?: string;
  found?: boolean;
  name?: string;
  sources?: RAGSource[];
  [key: string]: unknown;
}

export interface TraceStep {
  id: string;
  label: string;
  status: "running" | "done";
  toolName?: string;
  input?: unknown;
  output?: ToolResultData;
  sources?: RAGSource[];
}

// AI SDK v6: tool parts are "dynamic-tool" with state machine
// states: "input-streaming" | "input-available" | "output-available" | "output-failed"
export type ChatPart = {
  type: string;
  // v6 dynamic-tool fields
  toolName?: string;
  toolCallId?: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  // v6 text part
  text?: string;
  // legacy v5 compat
  result?: unknown;
  args?: unknown;
};

export const MESSAGE_QUOTA = 15;
export const WARNING_THRESHOLD = 12;
