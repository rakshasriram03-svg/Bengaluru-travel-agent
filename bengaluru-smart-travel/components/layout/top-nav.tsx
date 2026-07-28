"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Bot, Menu, Moon, Sun, User } from "lucide-react";
import { NAV_TABS } from "@/lib/constants";
import { useChat } from "@/components/providers/chat-provider";

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { newChat, pushToast, setSettingsOpen, dark, setDark } = useChat();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="-ml-2 p-2 text-foreground md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-sm font-extrabold tracking-tight sm:text-base">
          BENGALURU{" "}
          <span className="bg-gradient-to-r from-primary to-accent-glow bg-clip-text text-transparent">SMART</span>
        </Link>
      </div>

      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        {NAV_TABS.map((t) => {
          const active = pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`relative pb-1 transition-colors ${
                active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-primary to-accent-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setDark(!dark)}
          className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-colors hover:bg-accent"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {dark ? (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => pushToast("No new notifications right now.", "info")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => router.push("/dashboard")}
          className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent sm:flex"
          aria-label="Open assistant"
        >
          <Bot className="h-4 w-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            newChat();
            router.push("/dashboard");
          }}
          className="hidden items-center rounded-full bg-gradient-to-r from-primary to-accent-glow px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 sm:inline-flex"
        >
          Plan Trip
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setSettingsOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-glow"
          aria-label="Account settings"
        >
          <User className="h-4 w-4 text-white" />
        </motion.button>
      </div>
    </header>
  );
}
