"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CloudSun } from "lucide-react";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number | null;
  condition: string;
  hourly: { time: string; temp: number }[];
}

export function WeatherContent() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-32 rounded-2xl border border-border bg-card/60" />
        <div className="h-24 rounded-2xl border border-border bg-card/60" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
        <AlertTriangle className="h-6 w-6 text-amber-400" />
        <p className="text-sm font-medium text-foreground">Couldn&apos;t load live weather</p>
        <p className="text-xs text-muted-foreground">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold text-emerald-400">{data.temp}°C</p>
            <p className="mt-1 text-muted-foreground">{data.condition} • Bengaluru, IN</p>
            <p className="text-sm text-muted-foreground/70">
              Feels like {data.feelsLike}°C{data.humidity !== null ? ` • ${data.humidity}% Humidity` : ""}
            </p>
          </div>
          <CloudSun className="h-16 w-16 text-amber-300" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="mb-4 text-sm text-muted-foreground">Forecast (3-hour intervals)</p>
        <div className="flex justify-between overflow-x-auto">
          {data.hourly.map((h, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-2 px-2 text-sm">
              <span className="text-xs text-muted-foreground">{h.time}</span>
              <CloudSun className="h-5 w-5 text-amber-300" />
              <span className="font-medium">{h.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
