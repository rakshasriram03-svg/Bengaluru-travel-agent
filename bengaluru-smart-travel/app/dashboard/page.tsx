"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useChat } from "@/components/providers/chat-provider";
import { ChatMessage } from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { SkeletonChatArea } from "@/components/chat/skeleton-chat";
import { SuggestionChips } from "@/components/chat/suggestion-chips";
import { ChatInput } from "@/components/chat/chat-input";
import { DashboardRail } from "@/components/dashboard/dashboard-rail";

export default function DashboardPage() {
  const { messages, isTyping, hydrating, sendMessage, regenerate, newChat } = useChat();
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = false) => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollToBottom(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isTyping]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <div ref={scrollRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto">
          {hydrating ? (
            <SkeletonChatArea />
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Start a new conversation</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Ask about places to visit, routes, weather, or anything about exploring Bengaluru.
              </p>
              <button
                onClick={() => newChat()}
                className="mt-2 rounded-full bg-gradient-to-r from-primary to-accent-glow px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Start Planning
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-7 px-4 py-6">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  onRegenerate={regenerate}
                  canRegenerate={!isTyping}
                  scrollToBottom={() => scrollToBottom(false)}
                />
              ))}
              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
            </div>
          )}

          <AnimatePresence>
            {showScrollBtn && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => scrollToBottom(true)}
                className="fixed bottom-32 right-8 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-lg"
                aria-label="Scroll to bottom"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 px-4 pb-5 pt-2">
          <div className="mx-auto max-w-3xl">
            <SuggestionChips onSelect={sendMessage} disabled={isTyping} />
            <ChatInput disabled={isTyping} onSend={sendMessage} />
            <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
              Bengaluru Travel AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      <DashboardRail />
    </div>
  );
}
