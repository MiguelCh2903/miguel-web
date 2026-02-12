"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  Briefcase,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Rocket,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatActions } from "@/hooks/use-chat-actions";
import { MESSAGE_QUOTA, WARNING_THRESHOLD } from "@/lib/chat-types";
import type { ChatPart } from "@/lib/chat-types";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ChatMessage } from "@/components/chat/chat-message";

// ============================================
// PRESET BUTTONS (navigation only — no chat quota)
// ============================================

interface PresetButton {
  label: string;
  icon: LucideIcon;
  message: string;
  section: string;
  action: "navigate" | "download";
}

const PRESET_BUTTONS: PresetButton[] = [
  { label: "Skills", icon: Sparkles, message: "", section: "skills", action: "navigate" },
  { label: "Exp.", icon: Briefcase, message: "", section: "experience", action: "navigate" },
  { label: "Proyectos", icon: Rocket, message: "", section: "projects", action: "navigate" },
  { label: "Contacto", icon: Mail, message: "", section: "contact", action: "navigate" },
  { label: "CV", icon: Download, message: "", section: "", action: "download" },
];

// ============================================
// COMPONENT
// ============================================

export function AIChatSidebar() {
  const [input, setInput] = useState("");
  const [freeTextCount, setFreeTextCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [localNotice, setLocalNotice] = useState<{ id: string; text: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const { executeAction, scrollToSection, downloadCV } = useChatActions();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const quotaReached = freeTextCount >= MESSAGE_QUOTA;
  const showWarning = freeTextCount >= WARNING_THRESHOLD && !quotaReached;

  // Timestamps map — track when each message appeared
  const [messageTimes] = useState(() => new Map<string, Date>());
  useMemo(() => {
    for (const m of messages) {
      if (!messageTimes.has(m.id)) {
        messageTimes.set(m.id, new Date());
      }
    }
  }, [messages, messageTimes]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  // Handle tool actions from assistant
  // AI SDK v6: tool parts are "dynamic-tool" with state "output-available" and output field
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "assistant") {
      for (const part of latestMessage.parts) {
        const p = part as { type: string; state?: string; output?: unknown; result?: unknown };
        const isV6Tool = p.type === "dynamic-tool" && p.state === "output-available" && p.output;
        const isLegacyTool = p.type === "tool-result" && p.result;
        const payload = isV6Tool ? p.output : isLegacyTool ? p.result : null;
        if (payload) {
          const result = payload as Record<string, unknown>;
          if (result.action) {
            executeAction(result as { action: string; [key: string]: unknown });
          }
        }
      }
    }
  }, [messages, executeAction]);

  // Reset isSending when streaming ends
  useEffect(() => {
    if (status === "ready" && isSending) {
      setIsSending(false);
    }
  }, [status, isSending]);

  // Auto-dismiss local notice
  useEffect(() => {
    if (!localNotice) return undefined;
    const t = setTimeout(() => setLocalNotice(null), 900);
    return () => clearTimeout(t);
  }, [localNotice]);

  const handleCloseChat = useCallback(() => {
    isMobile ? setOpenMobile(false) : setOpen(false);
  }, [isMobile, setOpen, setOpenMobile]);

  const handlePresetClick = useCallback((preset: PresetButton) => {
    if (preset.action === "navigate") {
      setLocalNotice({ id: String(Date.now()), text: `Navegando a ${preset.label}...` });
      scrollToSection(preset.section);
    } else if (preset.action === "download") {
      setLocalNotice({ id: String(Date.now()), text: "Preparando descarga del CV..." });
      downloadCV();
    }
  }, [scrollToSection, downloadCV]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || quotaReached || isStreaming) return;
    setIsSending(true);
    sendMessage({ text });
    setFreeTextCount((c) => c + 1);
    setInput("");
  }, [quotaReached, isStreaming, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleFollowUp = useCallback((question: string) => {
    handleSend(question);
  }, [handleSend]);

  return (
    <Sidebar side="right" collapsible="offcanvas" className="border-l">
      {/* Header */}
      <SidebarHeader className="h-16 border-b px-4 flex items-center shadow-sm">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Bot className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-tight">Miguel AI</h2>
              <p className="text-[11px] text-muted-foreground">
                Agente RAG · tool calling
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            onClick={handleCloseChat}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar chat</span>
          </Button>
        </div>
      </SidebarHeader>

      {/* Chat messages */}
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-3 p-4">
            {/* Welcome screen */}
            {messages.length === 0 && (
              <ChatWelcome onSendMessage={handleFollowUp} />
            )}

            {/* Local action notice */}
            {localNotice && (
              <div key={localNotice.id} className="mb-1">
                <div className="p-2 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/70 dark:border-green-800/50 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{localNotice.text}</span>
                  </div>
                </div>
              </div>
            )}

            {/* All messages */}
            {messages.map((message) => {
              if (message.role === "assistant" && message.parts.length === 0) return null;

              const isLastAssistant =
                message.role === "assistant" &&
                message.id === messages.findLast((m) => m.role === "assistant")?.id;

              return (
                <ChatMessage
                  key={message.id}
                  role={message.role as "user" | "assistant"}
                  parts={message.parts as ChatPart[]}
                  createdAt={messageTimes.get(message.id)}
                  isStreaming={isLastAssistant && isStreaming}
                  onFollowUp={handleFollowUp}
                  isDisabled={isStreaming || quotaReached}
                />
              );
            })}

            {/* Thinking indicator — immediate feedback before first stream token */}
            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2.5 chat-message-in flex-row">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted border border-border/60 shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3 py-2.5 bg-muted/60 border border-border/40 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Pensando...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-3">
        {/* Quota warning */}
        {showWarning && (
          <div className="mb-2 p-2 bg-amber-50/80 dark:bg-amber-900/20 rounded-lg border border-amber-200/70 dark:border-amber-800/50 text-xs text-amber-700 dark:text-amber-300">
            Te quedan {MESSAGE_QUOTA - freeTextCount} preguntas. Para más info, contacta a Miguel directamente.
          </div>
        )}

        {/* Quick nav buttons */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_BUTTONS.map((preset) => {
            const Icon = preset.icon;
            return (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1 px-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
                onClick={() => handlePresetClick(preset)}
              >
                <Icon className="w-3 h-3 mr-1 text-primary" />
                {preset.label}
              </Button>
            );
          })}
        </div>

        {/* Input or quota reached */}
        {quotaReached ? (
          <div className="text-center py-2">
            <p className="text-sm font-medium mb-1.5">Límite de preguntas alcanzado</p>
            <p className="text-xs text-muted-foreground mb-3">
              Contacta a Miguel directamente para más información:
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                className="text-xs"
                onClick={() => { window.location.href = "mailto:miguel.chumacero.b@gmail.com"; }}
              >
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => { window.open("https://github.com/MiguelCh2903", "_blank"); }}
              >
                GitHub
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Escribe tu pregunta..."
              className="flex-1 min-h-10 max-h-[120px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isStreaming}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isStreaming || !input.trim()}
              className="self-end shadow-sm hover:shadow-md transition-shadow"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
