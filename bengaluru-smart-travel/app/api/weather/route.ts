import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface OwmWeatherEntry {
  main: { temp: number; feels_like?: number; humidity?: number };
  weather: { description: string }[];
  dt: number;
}

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 });
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bengaluru,IN&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Bengaluru,IN&units=metric&appid=${apiKey}`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error("OpenWeatherMap request failed");
    }

    const current: OwmWeatherEntry = await currentRes.json();
    const forecast: { list: OwmWeatherEntry[] } = await forecastRes.json();

    const hourly = (forecast.list ?? []).slice(0, 6).map((entry) => ({
      time: new Date(entry.dt * 1000).toLocaleTimeString("en-IN", { hour: "numeric", hour12: true }),
      temp: Math.round(entry.main.temp),
    }));

    return NextResponse.json({
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like ?? current.main.temp),
      humidity: current.main.humidity ?? null,
      condition: current.weather?.[0]?.description
        ? current.weather[0].description.replace(/\b\w/g, (c) => c.toUpperCase())
        : "Unknown",
      hourly,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
