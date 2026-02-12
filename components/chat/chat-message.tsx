"use client";

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatPart } from "@/lib/chat-types";
import { parseFollowUps, getRelativeTime } from "@/lib/chat-utils";
import { AgentTrace } from "./agent-trace";
import { FollowUpChips } from "./follow-up-chips";

interface ChatMessageProps {
  role: "user" | "assistant";
  parts: ChatPart[];
  createdAt?: Date;
  isStreaming?: boolean;
  onFollowUp?: (question: string) => void;
  isDisabled?: boolean;
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="leading-relaxed mb-1.5 last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-0.5 my-1.5 pl-1">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-0.5 my-1.5 pl-1">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-muted/60 dark:bg-muted/40 rounded px-1.5 py-0.5 text-xs font-mono">
      {children}
    </code>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-sm font-bold mt-1">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-sm font-semibold mt-1">{children}</h3>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-primary/40 pl-2.5 my-1 text-muted-foreground">
      {children}
    </blockquote>
  ),
};

export function ChatMessage({
  role,
  parts,
  createdAt,
  isStreaming,
  onFollowUp,
  isDisabled,
}: ChatMessageProps) {
  const isUser = role === "user";

  // Extract text content from all text parts
  const fullText = parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("");

  // Parse follow-ups from assistant text
  const { cleanText, followUps } = isUser
    ? { cleanText: fullText, followUps: [] }
    : parseFollowUps(fullText);

  const timestamp = createdAt ? getRelativeTime(createdAt) : null;

  return (
    <div className={`flex gap-2.5 chat-message-in ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
        <AvatarFallback
          className={isUser ? "bg-primary text-primary-foreground" : "bg-muted border border-border/60"}
        >
          {isUser ? (
            <User className="h-3.5 w-3.5" />
          ) : (
            <Bot className="h-3.5 w-3.5" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted/60 border border-border/40 rounded-tl-sm"
          }`}
        >
          {/* Agent trace — assistant only */}
          {!isUser && parts.length > 0 && (
            <AgentTrace parts={parts} />
          )}

          {/* Text content */}
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{cleanText}</p>
          ) : (
            <div className={isStreaming && !cleanText ? "streaming-cursor" : ""}>
              {cleanText ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {cleanText}
                </ReactMarkdown>
              ) : null}
              {isStreaming && cleanText && (
                <span className="streaming-cursor" />
              )}
            </div>
          )}
        </div>

        {/* Follow-up chips */}
        {!isUser && followUps.length > 0 && onFollowUp && (
          <FollowUpChips
            questions={followUps}
            onSelect={onFollowUp}
            disabled={isDisabled}
          />
        )}

        {/* Timestamp */}
        {timestamp && (
          <span className={`text-[10px] text-muted-foreground ${isUser ? "pr-1" : "pl-1"}`}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
