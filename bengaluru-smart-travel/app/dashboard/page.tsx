"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useChat } from "@/components/providers/chat-provider";
import { ChatMessage } from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { SkeletonChatArea } from "@/components/chat/skeleton-chat";
import { SuggestionChips } from "@/components/chat/suggestion-chips";
import { ChatInput } from "@/components/chat/chat-input";

export default function DashboardPage() {
  const { messages, isTyping, hydrating, sendMessage, regenerate } = useChat();
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
    <>
      <div ref={scrollRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto">
        {hydrating ? (
          <SkeletonChatArea />
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
    </>
  );
}
