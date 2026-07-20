"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Check, Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
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

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="flex max-w-[80%] flex-col items-end">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-white shadow-lg">
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
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-primary">Bengaluru Smart AI</span>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 px-5 py-5 backdrop-blur">
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
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              {canRegenerate && !message.itinerary && (
                <button
                  onClick={() => onRegenerate(message.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              )}
            </div>
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
          </div>
        )}
      </div>
      <span className="mt-1 block px-1 text-[11px] text-muted-foreground">{time}</span>
    </motion.div>
  );
}
