import { WeatherContent } from "@/components/weather/weather-content";

export const metadata = { title: "Weather • Bengaluru Smart" };

export default function WeatherPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <h2 className="mb-5 text-xl font-bold">Weather</h2>
      <WeatherContent />
    </div>
  );
}
