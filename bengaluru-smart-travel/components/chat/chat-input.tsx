"use client";

import { useState } from "react";
import { ArrowUp, Mic, Plus } from "lucide-react";

export function ChatInput({ disabled, onSend }: { disabled: boolean; onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 shadow-2xl backdrop-blur-xl">
      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground" aria-label="Add attachment">
        <Plus className="h-4 w-4" />
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask anything about your Bengaluru trip..."
        className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground" aria-label="Voice input">
        <Mic className="h-4 w-4" />
      </button>
      <button
        onClick={submit}
        disabled={!value.trim() || disabled}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:opacity-90 disabled:opacity-40"
        aria-label="Send message"
      >
        <ArrowUp className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
