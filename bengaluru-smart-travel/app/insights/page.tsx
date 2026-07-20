import { Compass, Gauge, CloudSun, Sparkles } from "lucide-react";
import { StatCard } from "@/components/insights/stat-card";
import { StylizedMap } from "@/components/insights/stylized-map";
import { Badge } from "@/components/ui/badge";
import { EVENT_ALERTS } from "@/lib/constants";

export const metadata = { title: "Insights • Bengaluru Smart" };

export default function InsightsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Compass className="h-3.5 w-3.5" /> Active Itinerary
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={Gauge} label="Traffic Density" live>
                <p className="mb-2 text-3xl font-bold text-sky-400">78%</p>
                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: "78%" }} />
                </div>
                <p className="text-xs text-emerald-400">+12% vs Yesterday</p>
              </StatCard>
              <StatCard icon={CloudSun} label="Local Climate">
                <p className="mb-2 text-3xl font-bold text-emerald-400">28°C</p>
                <p className="text-xs text-muted-foreground">Mostly Sunny • 44% Hum.</p>
                <p className="text-xs text-muted-foreground/70">Feels like 30°C</p>
              </StatCard>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Event Alerts</h3>
                <span className="text-[11px] text-muted-foreground">Updated 2m ago</span>
              </div>
              <div className="space-y-3">
                {EVENT_ALERTS.map((ev) => (
                  <div key={ev.title} className="flex items-start gap-3 rounded-xl border border-border bg-black/40 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{ev.meta}</p>
                      <Badge variant={ev.badgeTone} className="mt-1.5">
                        {ev.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" /> AI Suggestion
              </div>
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                &ldquo;Based on your preference for quiet evenings, I recommend visiting Cubbon Park between 17:00
                and 18:30 today. Traffic is expected to be 15% lower than usual.&rdquo;
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border">
            <StylizedMap />
            <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-zinc-700 shadow backdrop-blur">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Congested</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Normal</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Fluid</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6">
          <div>
            <p className="mb-1 font-extrabold tracking-tight">BENGALURU SMART</p>
            <p className="text-xs text-muted-foreground">© 2026 Bengaluru Smart Travel Assistant.</p>
            <p className="text-xs text-muted-foreground">Powered by advanced AI. Real-time insights for the Garden City.</p>
          </div>
          <div className="flex gap-16 text-sm">
            <div className="space-y-1.5">
              <p className="mb-1 font-medium text-emerald-400">Navigation</p>
              <p className="text-muted-foreground">Explore</p>
              <p className="text-muted-foreground">Itineraries</p>
              <p className="text-muted-foreground">Insights</p>
            </div>
            <div className="space-y-1.5">
              <p className="mb-1 font-medium text-emerald-400">Resources</p>
              <p className="text-muted-foreground">Privacy Policy</p>
              <p className="text-muted-foreground">API Access</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
