import { CloudSun } from "lucide-react";
import { HOURLY_WEATHER } from "@/lib/constants";

export const metadata = { title: "Weather • Bengaluru Smart" };

export default function WeatherPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <h2 className="mb-5 text-xl font-bold">Weather</h2>

      <div className="mb-5 rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold text-emerald-400">28°C</p>
            <p className="mt-1 text-muted-foreground">Mostly Sunny • Bengaluru, IN</p>
            <p className="text-sm text-muted-foreground/70">Feels like 30°C • 44% Humidity</p>
          </div>
          <CloudSun className="h-16 w-16 text-amber-300" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="mb-4 text-sm text-muted-foreground">Hourly forecast</p>
        <div className="flex justify-between">
          {HOURLY_WEATHER.map((h) => (
            <div key={h.t} className="flex flex-col items-center gap-2 text-sm">
              <span className="text-xs text-muted-foreground">{h.t}</span>
              <CloudSun className="h-5 w-5 text-amber-300" />
              <span className="font-medium">{h.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
