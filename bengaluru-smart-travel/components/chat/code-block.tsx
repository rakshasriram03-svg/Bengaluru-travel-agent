"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlightLine } from "@/components/chat/markdown-content";

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-1 overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-black px-3 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono">{lang || "code"}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 transition-colors hover:text-primary">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-black p-3 font-mono text-xs leading-relaxed text-zinc-200">
        <code>
          {lines.map((line, idx) => (
            <div key={idx}>{highlightLine(line, String(idx)) || "\u00A0"}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}
