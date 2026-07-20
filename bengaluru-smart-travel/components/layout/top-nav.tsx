"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Bot, Menu, User } from "lucide-react";
import { NAV_TABS } from "@/lib/constants";
import { useChat } from "@/components/providers/chat-provider";

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { newChat, pushToast, setSettingsOpen } = useChat();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="-ml-2 p-2 text-foreground md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-sm font-extrabold tracking-tight sm:text-base">
          BENGALURU <span className="text-foreground">SMART</span>
        </Link>
      </div>

      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        {NAV_TABS.map((t) => {
          const active = pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`border-b-2 pb-1 transition-colors ${
                active ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => pushToast("No new notifications right now.", "info")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent sm:flex"
          aria-label="Open assistant"
        >
          <Bot className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            newChat();
            router.push("/dashboard");
          }}
          className="hidden items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:opacity-90 sm:inline-flex"
        >
          Plan Trip
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500"
          aria-label="Account settings"
        >
          <User className="h-4 w-4 text-white" />
        </button>
      </div>
    </header>
  );
}
