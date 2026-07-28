"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Check, Clock, Copy, RefreshCw, SearchX, ThumbsDown, ThumbsUp, WifiOff } from "lucide-react";
import type { ChatMessageType } from "@/lib/types";
import { useTypewriter } from "@/hooks/use-typewriter";
import { MarkdownContent } from "@/components/chat/markdown-content";
import { ItineraryBlock } from "@/components/chat/itinerary-block";

interface ChatMessageProps {
  message: ChatMessageType;
  onRegenerate: (id: string) => void;
  canRegenerate: boolean;
  scrollToBottom: () => void;
}

const ERROR_META = {
  network: { icon: WifiOff, label: "Connection issue", tone: "red" as const },
  timeout: { icon: Clock, label: "Taking too long", tone: "amber" as const },
  empty: { icon: SearchX, label: "No response", tone: "amber" as const },
};

export function ChatMessage({ message, onRegenerate, canRegenerate, scrollToBottom }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";
  const { displayed, done } = useTypewriter(message.content, !!message.animate, scrollToBottom);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || "").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const errorInfo = message.errorType ? ERROR_META[message.errorType] : null;

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="flex max-w-[80%] flex-col items-end">
          <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-primary to-primary/80 px-4 py-3 text-white shadow-lg">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <span className="mt-1 px-1 text-[11px] text-muted-foreground">{time}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="group">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-glow shadow-glow">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-primary">Bengaluru Smart AI</span>
      </div>

      <div
        className={`rounded-2xl border px-5 py-5 backdrop-blur transition-shadow ${
          errorInfo
            ? errorInfo.tone === "red"
              ? "border-red-500/30 bg-red-500/5"
              : "border-amber-500/30 bg-amber-500/5"
            : "border-border bg-card/60 hover:shadow-glow"
        }`}
      >
        {errorInfo && (
          <div
            className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
              errorInfo.tone === "red" ? "text-red-400" : "text-amber-400"
            }`}
          >
            <errorInfo.icon className="h-4 w-4" />
            {errorInfo.label}
          </div>
        )}

        {message.itinerary ? (
          <ItineraryBlock itinerary={message.itinerary} />
        ) : (
          <>
            <MarkdownContent text={displayed} />
            {!done && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />}
          </>
        )}

        {(done || message.itinerary) && (
          <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-3">
            <div className="flex items-center gap-4">
              {!errorInfo && (
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
              {canRegenerate && !message.itinerary && (
                <button
                  onClick={() => onRegenerate(message.id)}
                  className={
                    errorInfo
                      ? "flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent-glow px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      : "flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                  }
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {errorInfo ? "Try again" : "Regenerate"}
                </button>
              )}
            </div>
            {!errorInfo && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVote(vote === "up" ? null : "up")}
                  className={`rounded p-1 transition-colors ${vote === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setVote(vote === "down" ? null : "down")}
                  className={`rounded p-1 transition-colors ${vote === "down" ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <span className="mt-1 block px-1 text-[11px] text-muted-foreground">{time}</span>
    </motion.div>
  );
}
