"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_WEBHOOK_URL, DEMO_ITINERARY, STORAGE_KEYS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";
import type { ChatMessageType, ChatSession, Toast, WebhookResponse } from "@/lib/types";
import { useToasts } from "@/hooks/use-toasts";

function makeWelcomeMessage(): ChatMessageType {
  return {
    id: `welcome-${Date.now()}`,
    role: "assistant",
    content: "",
    itinerary: DEMO_ITINERARY,
    timestamp: Date.now(),
    animate: false,
  };
}

function makeSession(title = "New Trip"): ChatSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    messages: [makeWelcomeMessage()],
    updatedAt: Date.now(),
  };
}

interface ChatContextValue {
  dark: boolean;
  setDark: (v: boolean) => void;
  webhookUrl: string;
  setWebhookUrl: (v: string) => void;
  sessions: ChatSession[];
  currentId: string | null;
  currentSession: ChatSession | undefined;
  messages: ChatMessageType[];
  isTyping: boolean;
  hydrating: boolean;
  sendMessage: (text: string) => void;
  regenerate: (assistantMsgId: string) => void;
  newChat: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  clearAll: () => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  toasts: Toast[];
  pushToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDarkState] = useState(true);
  const [webhookUrl, setWebhookUrlState] = useState(DEFAULT_WEBHOOK_URL);
  const [sessions, setSessions] = useState<ChatSession[]>([makeSession()]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const savedTheme = readStorage<string>(STORAGE_KEYS.theme);
    if (savedTheme) setDarkState(savedTheme === "dark");

    const savedWebhook = readStorage<string>(STORAGE_KEYS.webhook);
    if (savedWebhook) setWebhookUrlState(savedWebhook);

    const savedSessions = readStorage<ChatSession[]>(STORAGE_KEYS.sessions);
    const savedCurrent = readStorage<string>(STORAGE_KEYS.currentSession);

    if (savedSessions && savedSessions.length) {
      setSessions(savedSessions);
      setCurrentId(savedSessions.find((s) => s.id === savedCurrent)?.id ?? savedSessions[0].id);
    } else {
      const fresh = makeSession();
      setSessions([fresh]);
      setCurrentId(fresh.id);
    }

    const t = setTimeout(() => setHydrating(false), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (hydrating) return;
    writeStorage(STORAGE_KEYS.sessions, sessions);
  }, [sessions, hydrating]);

  useEffect(() => {
    if (hydrating || !currentId) return;
    writeStorage(STORAGE_KEYS.currentSession, currentId);
  }, [currentId, hydrating]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.theme, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.webhook, webhookUrl);
  }, [webhookUrl]);

  const currentSession = sessions.find((s) => s.id === currentId) ?? sessions[0];
  const messages = currentSession ? currentSession.messages : [];

  const updateSessionMessages = useCallback(
    (sessionId: string, updater: (msgs: ChatMessageType[]) => ChatMessageType[]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: updater(s.messages), updatedAt: Date.now() } : s))
      );
    },
    []
  );

  const requestReply = useCallback(
    async (sessionId: string, promptText: string) => {
      setIsTyping(true);
      try {
        console.log("Webhook URL:", webhookUrl);
console.log("Sending:", { message: promptText });

console.log("Webhook URL:", webhookUrl);
console.log("Prompt:", promptText);
alert("Fetch is about to run");
const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: promptText }),
        });
        console.log("Status:", response.status);
console.log("OK:", response.ok);

        if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
        const data = (await response.json()) as WebhookResponse;
        const replyText =
          typeof data?.reply === "string" && data.reply.length
            ? data.reply
            : "Hmm, I didn't get a proper reply from the travel assistant. Please try again.";

        updateSessionMessages(sessionId, (msgs) => [
          ...msgs,
          { id: `a-${Date.now()}`, role: "assistant", content: replyText, timestamp: Date.now(), animate: true },
        ]);
      } catch {
        pushToast("Sorry, I couldn't reach the travel assistant. Please try again.");
        updateSessionMessages(sessionId, (msgs) => [
          ...msgs,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Sorry, I couldn't reach the travel assistant. Please try again.",
            timestamp: Date.now(),
            animate: false,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [webhookUrl, updateSessionMessages, pushToast]
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !currentSession) return;
      const sessionId = currentSession.id;
      const userMessage: ChatMessageType = { id: `u-${Date.now()}`, role: "user", content: trimmed, timestamp: Date.now() };
      updateSessionMessages(sessionId, (msgs) => [...msgs, userMessage]);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId && s.title === "New Trip" ? { ...s, title: trimmed.slice(0, 40) } : s))
      );
      requestReply(sessionId, trimmed);
    },
    [isTyping, currentSession, updateSessionMessages, requestReply]
  );

  const regenerate = useCallback(
    (assistantMsgId: string) => {
      if (!currentSession || isTyping) return;
      const idx = currentSession.messages.findIndex((m) => m.id === assistantMsgId);
      if (idx <= 0) return;
      const priorUserMsg = [...currentSession.messages.slice(0, idx)].reverse().find((m) => m.role === "user");
      if (!priorUserMsg) return;
      const sessionId = currentSession.id;
      updateSessionMessages(sessionId, (msgs) => msgs.filter((m) => m.id !== assistantMsgId));
      requestReply(sessionId, priorUserMsg.content);
    },
    [currentSession, isTyping, updateSessionMessages, requestReply]
  );

  const newChat = useCallback(() => {
    const fresh = makeSession();
    setSessions((prev) => [fresh, ...prev]);
    setCurrentId(fresh.id);
  }, []);

  const selectSession = useCallback((id: string) => setCurrentId(id), []);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (!next.length) {
          const fresh = makeSession();
          setCurrentId(fresh.id);
          return [fresh];
        }
        if (id === currentId) setCurrentId(next[0].id);
        return next;
      });
    },
    [currentId]
  );

  const clearAll = useCallback(() => {
    const fresh = makeSession();
    setSessions([fresh]);
    setCurrentId(fresh.id);
    setSettingsOpen(false);
  }, []);

  const value: ChatContextValue = {
    dark,
    setDark: setDarkState,
    webhookUrl,
    setWebhookUrl: setWebhookUrlState,
    sessions,
    currentId,
    currentSession,
    messages,
    isTyping,
    hydrating,
    sendMessage,
    regenerate,
    newChat,
    selectSession,
    deleteSession,
    clearAll,
    settingsOpen,
    setSettingsOpen,
    toasts,
    pushToast,
    dismissToast,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
