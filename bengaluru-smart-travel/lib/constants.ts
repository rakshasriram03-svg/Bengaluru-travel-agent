import type { Itinerary } from "./types";

export const DEFAULT_WEBHOOK_URL =
  "https://rakshams.app.n8n.cloud/webhook/travel-assistant";

export const STORAGE_KEYS = {
  sessions: "bsta_sessions_v1",
  currentSession: "bsta_current_session_v1",
  theme: "bsta_theme_v1",
  webhook: "bsta_webhook_v1",
} as const;

/**
 * Demo itinerary shown in the very first chat session so the product feels
 * alive out of the box. Any real webhook reply renders as plain markdown
 * instead of this structured card layout.
 */
export const DEMO_ITINERARY: Itinerary = {
  intro:
    "Welcome to the tech heart of India! Here's a curated 48-hour high-tech circuit focusing on innovation hubs, smart urban spaces, and the iconic startup culture.",
  days: [
    {
      label: "Day 1",
      badge: "Innovation Core",
      items: [
        {
          time: "09:00",
          text: "Breakfast at **Hole in the Wall**, Koramangala.",
          name: "Hole in the Wall Cafe",
          category: "Cafe",
          rating: 4.6,
          address: "Wood Street, Koramangala, Bengaluru",
          hours: "7:30 AM – 11:00 PM",
          weather: "28°C, Clear",
          distance: "2.1 km",
          tags: ["Breakfast", "Cozy", "Popular"],
          mapsQuery: "Hole in the Wall Cafe Koramangala Bengaluru",
        },
        {
          time: "11:30",
          text: "Tour of **Microsoft Research Lab**.",
          name: "Microsoft Research Lab India",
          category: "Innovation Hub",
          rating: 4.4,
          address: "Vigyan, Lavelle Road, Bengaluru",
          hours: "By appointment only",
          weather: "30°C, Sunny",
          distance: "5.4 km",
          tags: ["Tech", "Research", "Guided Tour"],
          mapsQuery: "Microsoft Research Lab India Bengaluru",
        },
      ],
    },
    {
      label: "Day 2",
      badge: "High-Tech Leisure",
      items: [
        {
          time: "10:00",
          text: "Visit **Industrial & Tech Museum**.",
          name: "Visvesvaraya Industrial & Technological Museum",
          category: "Museum",
          rating: 4.3,
          address: "Kasturba Road, Bengaluru",
          hours: "10:00 AM – 6:00 PM",
          weather: "29°C, Partly Cloudy",
          distance: "6.8 km",
          tags: ["Museum", "Family-friendly", "Indoor"],
          mapsQuery: "Visvesvaraya Industrial and Technological Museum Bengaluru",
        },
        {
          time: "14:00",
          text: "Lunch at a **Robotic Cafe** in Indiranagar.",
          name: "Robot Cafe Bengaluru",
          category: "Cafe",
          rating: 4.1,
          address: "100 Feet Road, Indiranagar, Bengaluru",
          hours: "11:00 AM – 10:30 PM",
          weather: "27°C, Clear",
          distance: "8.2 km",
          tags: ["Novelty", "Lunch", "Family-friendly"],
          mapsQuery: "Robot Cafe Indiranagar Bengaluru",
        },
      ],
    },
  ],
  followUp:
    "Should I book a tech-hub coworking pass for you, or would you like to see traffic-safe commuting options first?",
};

export const NAV_TABS = [
  { href: "/", label: "Explore" },
  { href: "/dashboard", label: "Itineraries" },
  { href: "/insights", label: "Insights" },
  { href: "/support", label: "Support" },
] as const;

export const SIDEBAR_ROUTES = ["/dashboard", "/insights", "/weather", "/saved"];

export const DASHBOARD_SUGGESTIONS = [
  { label: "Best filter coffee", prompt: "Where can I get the best filter coffee in Bengaluru?" },
  { label: "Traffic-free route", prompt: "Suggest a traffic-free route across the city right now" },
  { label: "Indiranagar pubs", prompt: "Recommend good pubs in Indiranagar" },
  { label: "Top startups", prompt: "What are the top startup offices worth visiting in Bengaluru?" },
] as const;

export const EXPLORE_SUGGESTIONS = [
  "Cubbon Park walking tour",
  "Best filter coffee in Malleshwaram",
  "Weekend trip to Nandi Hills",
] as const;

export const EVENT_ALERTS = [
  {
    title: "Kadalekai Parishe Festival",
    meta: "Bull Temple Road • 2.4km",
    badge: "Crowded",
    badgeTone: "amber" as const,
  },
  {
    title: "Metro Line Maintenance",
    meta: "MG Road Junction • Delay +15m",
    badge: "Major Delay",
    badgeTone: "red" as const,
  },
];

export const SAVED_PLACES = [
  { name: "Cubbon Park", tag: "Park" },
  { name: "Hole in the Wall Cafe", tag: "Cafe" },
  { name: "Nandi Hills", tag: "Day Trip" },
  { name: "ISKCON Temple", tag: "Temple" },
];

export const HOURLY_WEATHER = [
  { t: "Now", v: "28°" },
  { t: "1PM", v: "29°" },
  { t: "2PM", v: "30°" },
  { t: "3PM", v: "29°" },
  { t: "4PM", v: "27°" },
  { t: "5PM", v: "26°" },
  { t: "6PM", v: "24°" },
];
