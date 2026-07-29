"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Bookmark, CloudSun, MapPin, Plus } from "lucide-react";
import { EVENT_ALERTS, SAVED_PLACES } from "@/lib/constants";
import { useChat } from "@/components/providers/chat-provider";

interface WeatherSummary {
  temp: number;
  condition: string;
  hourly: { time: string; temp: number }[];
}

const toneClasses: Record<string, string> = {
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  red: "border-red-500/30 bg-red-500/10 text-red-400",
};

const QUICK_ACTIONS = [
  { label: "New Trip", icon: Plus, href: null },
  { label: "View Map", icon: MapPin, href: "/insights" },
  { label: "Weather", icon: CloudSun, href: "/weather" },
  { label: "Saved", icon: Bookmark, href: "/saved" },
] as const;

export function DashboardRail() {
  const router = useRouter();
  const { newChat } = useChat();
  const [weather, setWeather] = useState<WeatherSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json) setWeather(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="scrollbar-thin hidden w-80 shrink-0 space-y-4 overflow-y-auto border-l border-border p-4 xl:block"
    >
      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <CloudSun className="h-4 w-4 text-accent-glow" /> Weather Now
          </span>
          <Link href="/weather" className="text-xs text-primary hover:underline">
            Forecast
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{weather ? `${weather.temp}°C` : "—"}</p>
            <p className="text-xs text-muted-foreground">
              {weather ? `${weather.condition}, Bengaluru` : "Loading…"}
            </p>
          </div>
          <div className="flex gap-2.5">
            {(weather?.hourly ?? []).slice(0, 3).map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                <span>{h.time}</span>
                <span className="font-medium text-foreground">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-accent-glow" /> Trending Now
          </span>
          <Link href="/insights" className="text-xs text-primary hover:underline">
            Map
          </Link>
        </div>
        <div className="space-y-2">
          {EVENT_ALERTS.map((e) => (
            <div key={e.title} className="rounded-xl border border-border/60 bg-muted/50 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground">{e.title}</span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneClasses[e.badgeTone]}`}
                >
                  {e.badge}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{e.meta}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Bookmark className="h-4 w-4 text-accent-glow" /> Saved Destinations
          </span>
          <Link href="/saved" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {SAVED_PLACES.slice(0, 3).map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3 py-2 text-xs"
            >
              <Bookmark className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="flex-1 truncate text-foreground">{p.name}</span>
              <span className="text-muted-foreground">{p.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-4">
        <span className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <MapPin className="h-4 w-4 text-accent-glow" /> Quick Actions
        </span>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => (href ? router.push(href) : newChat())}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-muted/50 py-3 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon className="h-4 w-4" /> {label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
