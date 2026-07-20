"use client";

import React, { useMemo } from "react";
import { CodeBlock } from "@/components/chat/code-block";

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "import", "export", "from", "default", "async", "await", "class", "new",
  "try", "catch", "finally", "def", "print", "in", "of", "true", "false",
  "null", "None", "True", "False", "self",
]);

function highlightToken(token: string, key: string) {
  if (/^["'`].*["'`]$/.test(token)) return <span key={key} className="text-emerald-400">{token}</span>;
  if (/^\d+(\.\d+)?$/.test(token)) return <span key={key} className="text-amber-400">{token}</span>;
  if (KEYWORDS.has(token)) return <span key={key} className="font-medium text-primary">{token}</span>;
  if (/^[A-Za-z_][A-Za-z0-9_]*(?=\()/.test(token)) return <span key={key} className="text-sky-400">{token}</span>;
  return token;
}

export function highlightLine(line: string, lineKey: string) {
  const commentMatch = line.match(/(#.*|\/\/.*)$/);
  let codePart = line;
  let commentPart = "";
  if (commentMatch) {
    codePart = line.slice(0, commentMatch.index);
    commentPart = commentMatch[0];
  }
  const tokens = codePart.split(/(\s+|["'`][^"'`]*["'`]|[(){}\[\];,.=+\-*/<>!&|:])/g).filter((t) => t !== "");
  return (
    <span key={lineKey}>
      {tokens.map((tok, i) => highlightToken(tok, `${lineKey}-${i}`))}
      {commentPart && <span className="italic text-muted-foreground">{commentPart}</span>}
    </span>
  );
}

function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2] !== undefined) parts.push(<strong key={`${keyPrefix}-b-${i++}`}>{match[2]}</strong>);
    else if (match[3] !== undefined) parts.push(<em key={`${keyPrefix}-i-${i++}`}>{match[3]}</em>);
    else if (match[4] !== undefined)
      parts.push(
        <code key={`${keyPrefix}-c-${i++}`} className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[13px] text-primary">
          {match[4]}
        </code>
      );
    else if (match[5] !== undefined)
      parts.push(
        <a key={`${keyPrefix}-a-${i++}`} href={match[6]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">
          {match[5]}
        </a>
      );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export { renderInline };

/**
 * Lightweight, dependency-free markdown renderer: bold/italic/inline-code,
 * links, bullet lists, and fenced code blocks (with basic syntax highlighting).
 */
export function MarkdownContent({ text }: { text: string }) {
  const segments = useMemo(() => text.split(/```(\w*)\n?([\s\S]*?)```/g), [text]);
  const blocks: React.ReactNode[] = [];

  for (let i = 0; i < segments.length; i += 3) {
    const plain = segments[i];
    const lang = segments[i + 1];
    const code = segments[i + 2];

    if (plain) {
      const lines = plain.split("\n");
      const parBlocks: React.ReactNode[] = [];
      let listBuffer: string[] = [];
      const flushList = (idx: string | number) => {
        if (listBuffer.length) {
          parBlocks.push(
            <ul key={`ul-${i}-${idx}`} className="list-inside list-disc space-y-1 pl-1">
              {listBuffer.map((item, li) => (
                <li key={li}>{renderInline(item, `${i}-${idx}-${li}`)}</li>
              ))}
            </ul>
          );
          listBuffer = [];
        }
      };
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) listBuffer.push(trimmed.slice(2));
        else {
          flushList(idx);
          if (trimmed.length > 0) parBlocks.push(<p key={idx}>{renderInline(trimmed, `${i}-${idx}`)}</p>);
        }
      });
      flushList("end");
      blocks.push(
        <div key={`p-${i}`} className="space-y-2">
          {parBlocks}
        </div>
      );
    }
    if (code !== undefined) {
      blocks.push(<CodeBlock key={`code-${i}`} code={code.replace(/\n$/, "")} lang={lang} />);
    }
  }

  return <div className="space-y-2 text-sm leading-relaxed">{blocks}</div>;
}
