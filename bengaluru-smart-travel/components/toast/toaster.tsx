"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Bell, X } from "lucide-react";
import { useChat } from "@/components/providers/chat-provider";

export function Toaster() {
  const { toasts, dismissToast } = useChat();

  return (
    <div className="fixed top-4 right-4 z-[100] flex w-[90vw] max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm text-foreground shadow-2xl backdrop-blur ${
              t.type === "info" ? "border-primary/30 bg-card/95" : "border-red-500/30 bg-card/95"
            }`}
          >
            {t.type === "info" ? (
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            )}
            <p className="flex-1">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
