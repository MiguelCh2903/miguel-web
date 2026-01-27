"use client";

import { Bot, Send, User, ExternalLink, Download, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { X } from "lucide-react";
import { useChatActions } from "@/hooks/use-chat-actions";

// Funciones auxiliares para las herramientas
function getToolIcon(toolName: string) {
  switch (toolName) {
    case "navigateToSection":
      return <MapPin className="w-3 h-3" />;
    case "downloadCV":
      return <Download className="w-3 h-3" />;
    case "getContactInformation":
      return <ExternalLink className="w-3 h-3" />;
    case "searchInformation":
      return <Bot className="w-3 h-3" />;
    case "getProjectDetails":
      return <ExternalLink className="w-3 h-3" />;
    default:
      return <Bot className="w-3 h-3" />;
  }
}

function getToolDisplayName(toolName: string) {
  switch (toolName) {
    case "navigateToSection":
      return "Navegación";
    case "downloadCV":
      return "Descarga CV";
    case "getContactInformation":
      return "Información de Contacto";
    case "searchInformation":
      return "Búsqueda";
    case "getProjectDetails":
      return "Detalles de Proyecto";
    default:
      return toolName;
  }
}

export function AIChatSidebar() {
  const [input, setInput] = useState("");
  const { executeAction } = useChatActions();
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // Manejar acciones de herramientas
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "assistant") {
      latestMessage.parts.forEach((part) => {
        if (part.type === "tool-result" && part.result) {
          const result = part.result as any;
          if (result.action) {
            executeAction(result);
          }
        }
      });
    }
  }, [messages, executeAction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="border-l sticky top-0 h-screen"
    >
      {/* Header con botón de cerrar */}
      <SidebarHeader className="h-16 border-b px-4 flex items-center shadow-sm">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Chat con IA</h2>
              <p className="text-xs text-muted-foreground">
                Pregúntame sobre Miguel
              </p>
            </div>
          </div>
          <SidebarTrigger className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar chat</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      {/* Chat Messages */}
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm">
                    <p className="mb-2">
                      ¡Hola! 👋 Soy el asistente de IA de Miguel. Puedo ayudarte
                      a:
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>
                        🔍 Buscar información sobre sus proyectos y experiencia
                      </li>
                      <li>
                        🧭 Navegar por las diferentes secciones del portfolio
                      </li>
                      <li>📧 Proporcionar información de contacto</li>
                      <li>📄 Ayudarte a descargar su CV</li>
                    </ul>
                    <p className="mt-2 text-xs">¿En qué puedo ayudarte?</p>
                  </div>
                </div>

                {/* Botones de acciones rápidas */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() =>
                      sendMessage({
                        text: "Háblame sobre los proyectos de Miguel",
                      })
                    }
                  >
                    <Bot className="w-3 h-3 mr-2" />
                    Ver Proyectos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() =>
                      sendMessage({
                        text: "¿Cuáles son las habilidades técnicas de Miguel?",
                      })
                    }
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Habilidades
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() =>
                      sendMessage({ text: "Llévame a la sección de contacto" })
                    }
                  >
                    <MapPin className="w-3 h-3 mr-2" />
                    Contacto
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() =>
                      sendMessage({ text: "Descarga el CV de Miguel" })
                    }
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Descargar CV
                  </Button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p
                          key={index}
                          className="whitespace-pre-wrap wrap-break-word"
                        >
                          {part.text}
                        </p>
                      );
                    }

                    // Renderizar herramientas de manera más visual
                    if (part.type === "tool-call") {
                      return (
                        <div
                          key={index}
                          className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 mb-1">
                            {getToolIcon(part.toolName)}
                            <span className="font-medium">
                              {getToolDisplayName(part.toolName)}
                            </span>
                          </div>
                          {part.toolName === "navigateToSection" && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Navegando a: {part.args.section}
                            </p>
                          )}
                        </div>
                      );
                    }

                    if (part.type === "tool-result") {
                      const result = part.result as any;
                      return (
                        <div key={index} className="mb-2">
                          {result.action === "navigate" && (
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                                <MapPin className="w-3 h-3" />
                                Navegado a {result.title}
                              </div>
                            </div>
                          )}
                          {result.action === "download" && (
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                                <Download className="w-3 h-3" />
                                CV descargado
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            ))}

            {(status === "streaming" || status === "submitted") && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-muted">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-lg bg-muted px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Input Footer */}
      <SidebarFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Escribe tu pregunta..."
            className="flex-1 min-h-10 max-h-30 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status !== "ready"}
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={status !== "ready" || !input.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </SidebarFooter>

      {/* Rail for collapsing */}
      <SidebarRail />
    </Sidebar>
  );
}
