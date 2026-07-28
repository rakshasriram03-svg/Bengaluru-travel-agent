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
        <code key={`${keyPrefix}-c-${i++}`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-primary">
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

      const isSeparatorRow = (line: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
      const splitRow = (line: string) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

      let idx = 0;
      while (idx < lines.length) {
        const trimmed = lines[idx].trim();

        if (trimmed.startsWith("|") && lines[idx + 1] && isSeparatorRow(lines[idx + 1])) {
          flushList(idx);
          const headerCells = splitRow(trimmed);
          const rows: string[][] = [];
          idx += 2;
          while (idx < lines.length && lines[idx].trim().startsWith("|")) {
            rows.push(splitRow(lines[idx]));
            idx++;
          }
          parBlocks.push(
            <div key={`tbl-${i}-${idx}`} className="my-1 overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-accent/60">
                  <tr>
                    {headerCells.map((c, ci) => (
                      <th key={ci} className="whitespace-nowrap px-3 py-2 font-semibold text-foreground">
                        {renderInline(c, `th-${i}-${ci}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={ri} className="border-t border-border">
                      {r.map((c, ci) => (
                        <td key={ci} className="px-3 py-2 text-muted-foreground">
                          {renderInline(c, `td-${i}-${ri}-${ci}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }

        const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
        if (headingMatch) {
          flushList(idx);
          const level = headingMatch[1].length;
          const content = renderInline(headingMatch[2], `${i}-${idx}`);
          const HeadingTag: React.ElementType = level === 1 ? "h3" : level === 2 ? "h4" : "h5";
          const headingClass =
            level === 1
              ? "text-base font-bold text-foreground"
              : level === 2
                ? "text-sm font-semibold text-foreground"
                : "text-xs font-semibold uppercase tracking-wide text-primary";
          parBlocks.push(
            <HeadingTag key={`h-${i}-${idx}`} className={`${headingClass} mt-1`}>
              {content}
            </HeadingTag>
          );
          idx++;
          continue;
        }

        if (trimmed.startsWith("> ")) {
          flushList(idx);
          parBlocks.push(
            <blockquote key={`bq-${i}-${idx}`} className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
              {renderInline(trimmed.slice(2), `${i}-${idx}`)}
            </blockquote>
          );
          idx++;
          continue;
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          listBuffer.push(trimmed.slice(2));
          idx++;
          continue;
        }

        flushList(idx);
        if (trimmed.length > 0) parBlocks.push(<p key={idx}>{renderInline(trimmed, `${i}-${idx}`)}</p>);
        idx++;
      }
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
