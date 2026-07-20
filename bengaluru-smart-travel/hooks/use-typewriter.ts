"use client";

import { useEffect, useState } from "react";

/**
 * Reveals `fullText` progressively to simulate a streaming AI reply.
 * When `enabled` is false the full text is shown immediately (used for
 * messages restored from storage, so history doesn't replay itself).
 */
export function useTypewriter(fullText: string, enabled: boolean, onTick?: () => void) {
  const [displayed, setDisplayed] = useState(enabled ? "" : fullText);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText);
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const chunk = Math.max(1, Math.floor(fullText.length / 120));
    const interval = setInterval(() => {
      i += chunk;
      if (i >= fullText.length) {
        setDisplayed(fullText);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(fullText.slice(0, i));
      }
      onTick?.();
    }, 14);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText, enabled]);

  return { displayed, done };
}
