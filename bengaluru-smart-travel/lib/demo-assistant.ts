import type { Itinerary, ItineraryItem } from "./types";

/**
 * Fully local "AI" for demo purposes — no external webhook or LLM API involved.
 * Matches keywords in the user's message against a curated set of Bengaluru
 * places, and factors in live weather (fetched from /api/weather) to bias
 * indoor vs. outdoor picks. Deterministic and network-independent (besides
 * the optional weather lookup), so it always works during a live demo.
 */

export interface WeatherSnapshot {
  temp: number;
  condition: string;
}

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface PlaceDef {
  name: string;
  category: string;
  address: string;
  hours: string;
  rating: number;
  tags: string[];
  mapsQuery: string;
  indoor: boolean;
  times: TimeOfDay[];
  keywords: string[];
}

const PLACES: PlaceDef[] = [
  {
    name: "Hole in the Wall Cafe",
    category: "Cafe",
    address: "Wood Street, Koramangala, Bengaluru",
    hours: "7:30 AM – 11:00 PM",
    rating: 4.6,
    tags: ["Breakfast", "Cozy", "Popular"],
    mapsQuery: "Hole in the Wall Cafe Koramangala Bengaluru",
    indoor: true,
    times: ["morning", "afternoon"],
    keywords: ["coffee", "cafe", "breakfast", "brunch"],
  },
  {
    name: "Third Wave Coffee, Indiranagar",
    category: "Cafe",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    hours: "8:00 AM – 11:00 PM",
    rating: 4.4,
    tags: ["Coffee", "Work-friendly", "Chill"],
    mapsQuery: "Third Wave Coffee Indiranagar Bengaluru",
    indoor: true,
    times: ["morning", "afternoon", "evening"],
    keywords: ["coffee", "cafe", "work", "wifi"],
  },
  {
    name: "Toit Brewpub",
    category: "Nightlife",
    address: "100 Feet Road, Indiranagar, Bengaluru",
    hours: "12:00 PM – 11:30 PM",
    rating: 4.5,
    tags: ["Craft Beer", "Live Music", "Buzzy"],
    mapsQuery: "Toit Brewpub Indiranagar Bengaluru",
    indoor: true,
    times: ["evening", "night"],
    keywords: ["pub", "bar", "beer", "nightlife", "drinks", "party"],
  },
  {
    name: "Church Street Social",
    category: "Nightlife",
    address: "Church Street, Bengaluru",
    hours: "11:00 AM – 1:00 AM",
    rating: 4.3,
    tags: ["Cocktails", "Social", "Central"],
    mapsQuery: "Church Street Social Bengaluru",
    indoor: true,
    times: ["evening", "night"],
    keywords: ["pub", "bar", "beer", "nightlife", "drinks", "cocktails"],
  },
  {
    name: "Visvesvaraya Industrial & Technological Museum",
    category: "Museum",
    address: "Kasturba Road, Bengaluru",
    hours: "10:00 AM – 6:00 PM",
    rating: 4.3,
    tags: ["Museum", "Family-friendly", "Indoor"],
    mapsQuery: "Visvesvaraya Industrial and Technological Museum Bengaluru",
    indoor: true,
    times: ["morning", "afternoon"],
    keywords: ["museum", "culture", "history", "indoor", "science"],
  },
  {
    name: "UB City Mall",
    category: "Shopping",
    address: "Vittal Mallya Road, Bengaluru",
    hours: "11:00 AM – 10:00 PM",
    rating: 4.4,
    tags: ["Shopping", "Dining", "Indoor"],
    mapsQuery: "UB City Mall Bengaluru",
    indoor: true,
    times: ["afternoon", "evening"],
    keywords: ["shopping", "mall", "shop"],
  },
  {
    name: "Microsoft Research Lab India",
    category: "Innovation Hub",
    address: "Vigyan, Lavelle Road, Bengaluru",
    hours: "By appointment only",
    rating: 4.4,
    tags: ["Tech", "Research", "Guided Tour"],
    mapsQuery: "Microsoft Research Lab India Bengaluru",
    indoor: true,
    times: ["morning", "afternoon"],
    keywords: ["tech", "startup", "innovation", "research"],
  },
  {
    name: "Cubbon Park",
    category: "Park",
    address: "Kasturba Road, Bengaluru",
    hours: "6:00 AM – 6:00 PM",
    rating: 4.6,
    tags: ["Nature", "Walking", "Free"],
    mapsQuery: "Cubbon Park Bengaluru",
    indoor: false,
    times: ["morning", "afternoon", "evening"],
    keywords: ["park", "nature", "walk", "outdoor", "garden"],
  },
  {
    name: "Lalbagh Botanical Garden",
    category: "Garden",
    address: "Mavalli, Bengaluru",
    hours: "6:00 AM – 7:00 PM",
    rating: 4.6,
    tags: ["Nature", "Photography", "Scenic"],
    mapsQuery: "Lalbagh Botanical Garden Bengaluru",
    indoor: false,
    times: ["morning", "afternoon", "evening"],
    keywords: ["park", "garden", "nature", "outdoor", "photography"],
  },
  {
    name: "Ulsoor Lake",
    category: "Lakefront",
    address: "Halasuru, Bengaluru",
    hours: "6:00 AM – 8:00 PM",
    rating: 4.2,
    tags: ["Sunset", "Boating", "Scenic"],
    mapsQuery: "Ulsoor Lake Bengaluru",
    indoor: false,
    times: ["evening"],
    keywords: ["lake", "sunset", "boating", "outdoor", "walk"],
  },
  {
    name: "ISKCON Temple",
    category: "Temple",
    address: "Hare Krishna Hill, Rajajinagar, Bengaluru",
    hours: "7:15 AM – 1:00 PM, 4:15 PM – 8:20 PM",
    rating: 4.7,
    tags: ["Spiritual", "Architecture", "Peaceful"],
    mapsQuery: "ISKCON Temple Bengaluru",
    indoor: true,
    times: ["morning", "evening"],
    keywords: ["temple", "spiritual", "religious"],
  },
  {
    name: "Nandi Hills",
    category: "Day Trip",
    address: "Nandi Hills, Chikkaballapur, near Bengaluru",
    hours: "6:00 AM – 10:00 PM",
    rating: 4.5,
    tags: ["Sunrise", "Scenic", "Day Trip"],
    mapsQuery: "Nandi Hills Bengaluru",
    indoor: false,
    times: ["morning"],
    keywords: ["sunrise", "hills", "trip", "trek", "outdoor"],
  },
];

function detectTimeOfDay(message: string): TimeOfDay {
  const m = message.toLowerCase();
  if (/\bmorning\b/.test(m)) return "morning";
  if (/\bafternoon\b/.test(m)) return "afternoon";
  if (/\bevening\b/.test(m)) return "evening";
  if (/\b(night|tonight|late)\b/.test(m)) return "night";

  const hour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date())
  );
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function isRainy(condition: string): boolean {
  return /rain|drizzle|storm|thunder|shower/i.test(condition);
}

function isHot(temp: number): boolean {
  return temp >= 32;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  coffee: ["coffee", "cafe", "brunch", "breakfast"],
  nightlife: ["pub", "bar", "beer", "nightlife", "drinks", "cocktails", "party"],
  culture: ["museum", "culture", "history"],
  shopping: ["shopping", "mall", "shop"],
  tech: ["tech", "startup", "innovation", "research"],
  nature: ["park", "garden", "nature", "walk", "outdoor", "photography"],
  water: ["lake", "sunset", "boating"],
  spiritual: ["temple", "spiritual", "religious"],
};

function matchedKeywordGroup(message: string): string[] | null {
  const m = message.toLowerCase();
  for (const words of Object.values(CATEGORY_KEYWORDS)) {
    if (words.some((w) => m.includes(w))) return words;
  }
  return null;
}

function pickPlaces(message: string, weather: WeatherSnapshot | null, timeOfDay: TimeOfDay): PlaceDef[] {
  const preferIndoor = weather ? isRainy(weather.condition) || isHot(weather.temp) : false;
  const keywordGroup = matchedKeywordGroup(message);

  const scored = PLACES.map((place) => {
    let score = 0;
    if (place.times.includes(timeOfDay)) score += 2;
    if (keywordGroup && place.keywords.some((k) => keywordGroup.includes(k))) score += 5;
    if (preferIndoor && place.indoor) score += 2;
    if (!preferIndoor && !place.indoor) score += 1;
    return { place, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((s) => s.place);
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function buildItinerary(message: string, weather: WeatherSnapshot | null): Itinerary {
  const timeOfDay = detectTimeOfDay(message);
  const places = pickPlaces(message, weather, timeOfDay);

  const weatherNote = weather
    ? `It's ${weather.condition.toLowerCase()} and ${weather.temp}°C in Bengaluru right now — `
    : "";
  const biasNote = weather && (isRainy(weather.condition) || isHot(weather.temp))
    ? "so I've kept these mostly indoor. "
    : weather
      ? "great conditions to be outdoors. "
      : "";

  const items: ItineraryItem[] = places.map((place, idx) => ({
    time: startTimeFor(timeOfDay, idx),
    text: `Head to **${place.name}**.`,
    name: place.name,
    category: place.category,
    rating: place.rating,
    address: place.address,
    hours: place.hours,
    weather: weather ? `${weather.temp}°C, ${weather.condition}` : undefined,
    tags: place.tags,
    mapsQuery: place.mapsQuery,
  }));

  return {
    intro: `${weatherNote}${biasNote}Here's what I'd suggest for this ${timeOfDay}:`,
    days: [
      {
        label: capitalize(timeOfDay),
        badge: weather && isRainy(weather.condition) ? "Rain-Friendly Picks" : weather && isHot(weather.temp) ? "Stay-Cool Picks" : "Recommended Picks",
        items,
      },
    ],
    followUp: "Want me to check the traffic route there, or suggest a coffee stop nearby?",
  };
}

function startTimeFor(timeOfDay: TimeOfDay, idx: number): string {
  const base = { morning: 9, afternoon: 13, evening: 17, night: 20 }[timeOfDay];
  const hour = base + idx;
  const h12 = ((hour + 11) % 12) + 1;
  const suffix = hour % 24 < 12 ? "AM" : "PM";
  return `${String(h12).padStart(2, "0")}:00 ${suffix}`;
}

const PLACE_REQUEST_RE = /\b(suggest|recommend|visit|place|places|things to do|itinerary|explore|where (should|can) i go|what.*do)\b/i;

export function generateDemoReply(
  message: string,
  weather: WeatherSnapshot | null
): { content: string; itinerary?: Itinerary } {
  const trimmed = message.trim();

  if (/^(hi|hey|hello|yo|sup)\b/i.test(trimmed) && trimmed.length < 20) {
    return {
      content:
        "Hey! I'm your Bengaluru travel assistant (demo mode — running fully offline, no external AI needed). Ask me things like *\"suggest places to visit this evening based on the weather\"* or *\"good coffee spots nearby\"*.",
    };
  }

  if (/\b(thank|thanks|thx)\b/i.test(trimmed)) {
    return { content: "Happy to help! Let me know if you want more ideas for later today." };
  }

  if (!PLACE_REQUEST_RE.test(trimmed) && !matchedKeywordGroup(trimmed)) {
    return {
      content:
        "I can suggest places to visit, factoring in the current weather and time of day. Try asking something like *\"suggest places to visit this evening based on the current weather\"*, or ask for coffee, nightlife, museums, parks, or shopping spots.",
    };
  }

  return { content: "", itinerary: buildItinerary(trimmed, weather) };
}

export async function fetchWeatherSnapshot(): Promise<WeatherSnapshot | null> {
  try {
    const res = await fetch("/api/weather");
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data?.temp !== "number" || typeof data?.condition !== "string") return null;
    return { temp: data.temp, condition: data.condition };
  } catch {
    return null;
  }
}
