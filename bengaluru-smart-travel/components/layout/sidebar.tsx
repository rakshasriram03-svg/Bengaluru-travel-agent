"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, CloudSun, History, LayoutDashboard, Map as MapIcon, Plus, Trash2, X } from "lucide-react";
import { useChat } from "@/components/providers/chat-provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/insights", label: "Map View", icon: MapIcon },
  { href: "/weather", label: "Weather", icon: CloudSun },
  { href: "/saved", label: "Saved Places", icon: Bookmark },
];

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sessions, currentId, selectSession, deleteSession, newChat } = useChat();

  const goToChat = (id?: string) => {
    if (id) selectSession(id);
    router.push("/dashboard");
    onCloseMobile?.();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between px-5 pb-5 pt-6">
        <div>
          <p className="text-lg font-bold leading-tight">
            Bengaluru <span className="text-primary">AI</span>
          </p>
          <p className="text-xs text-muted-foreground">Intelligent Travel Assistant</p>
        </div>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="p-1 text-muted-foreground md:hidden" aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onCloseMobile}
              aria-current={active ? "page" : undefined}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="scrollbar-thin mt-8 flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">Recent History</p>
        <motion.div variants={listContainer} initial="hidden" animate="show" className="space-y-0.5">
          {sessions
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((s) => {
              const active = s.id === currentId;
              return (
                <motion.div
                  key={s.id}
                  variants={listItem}
                  onClick={() => goToChat(s.id)}
                  aria-current={active ? "true" : undefined}
                  className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-accent/60 text-primary" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  <History className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">{s.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className="text-muted-foreground/60 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
        </motion.div>
      </div>

      <div className="p-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            newChat();
            goToChat();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-glow px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Trip Chat
        </motion.button>
      </div>
    </div>
  );
}
