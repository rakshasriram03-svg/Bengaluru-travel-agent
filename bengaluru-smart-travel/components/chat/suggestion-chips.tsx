"use client";

import { Coffee, Route, Beer, Star, type LucideIcon } from "lucide-react";
import { DASHBOARD_SUGGESTIONS } from "@/lib/constants";

const ICONS: LucideIcon[] = [Coffee, Route, Beer, Star];

export function SuggestionChips({ onSelect, disabled }: { onSelect: (prompt: string) => void; disabled: boolean }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
      {DASHBOARD_SUGGESTIONS.map(({ label, prompt }, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <button
            key={label}
            onClick={() => onSelect(prompt)}
            disabled={disabled}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
          >
            <Icon className="h-3.5 w-3.5 text-primary" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
