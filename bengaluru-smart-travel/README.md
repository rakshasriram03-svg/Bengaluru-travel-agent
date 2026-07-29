# Bengaluru Smart Travel Assistant

A Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui rebuild of the
Bengaluru Smart Travel Assistant — an AI travel planning product with a
conversational itinerary builder, live-style insights dashboard, weather, and
saved places. The chat assistant runs entirely locally in demo mode (see
below) — no external webhook or LLM API key required.

## Stack

- **Next.js 15** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS** with CSS-variable theming (dark by default)
- **shadcn/ui**-style primitives (Button, Input, Textarea, Badge, Dialog, Sheet)
  built on Radix UI
- **Framer Motion** for animation
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                  Route segments (App Router)
  page.tsx            "/"          — Explore hero / landing
  dashboard/page.tsx   "/dashboard" — AI chat + itinerary cards
  insights/page.tsx    "/insights"  — traffic, climate, events, map
  weather/page.tsx      "/weather"   — forecast page
  saved/page.tsx         "/saved"     — saved places
  support/page.tsx        "/support"   — support placeholder
  layout.tsx            Root layout: providers, shell, toaster
  globals.css            Tailwind + design tokens (CSS variables)

components/
  layout/               TopNav, Sidebar, AppShell (route-aware chrome)
  chat/                 Chat message, markdown renderer, code block,
                         itinerary card, typing indicator, input, chips
  explore/               Hero section + generated skyline backdrop
  insights/               Stat cards + stylized map illustration
  modals/                 Settings dialog
  providers/               ChatProvider — sessions, demo replies, toasts
  toast/                    Toast stack
  ui/                        shadcn-style primitives

lib/
  types.ts               Shared TypeScript types
  constants.ts            Mock data, nav config, demo itinerary
  demo-assistant.ts        Local "AI" — keyword + weather-based place picker
  storage.ts               Safe localStorage helpers
  utils.ts                   `cn()` class merge helper

hooks/
  use-toasts.ts
  use-typewriter.ts
```

## How the chat assistant works (demo mode)

There's no external webhook or LLM call. `lib/demo-assistant.ts` matches
keywords in the user's message (coffee, nightlife, museums, parks, shopping,
temples, "this evening", etc.) against a curated list of real Bengaluru
places, fetches live weather from `/api/weather`, and biases picks toward
indoor spots when it's raining or hot. It replies with either a rich
itinerary card (for place requests) or a plain conversational message.
Nothing here depends on network access to a third-party AI API, so it always
works during a live demo.

To swap in a real backend later, replace the call to `generateDemoReply` in
`components/providers/chat-provider.tsx`'s `requestReply` with a `fetch` to
your own API/webhook.

## Notes

- Chat sessions and theme persist in `localStorage`.
- The Insights page (traffic/climate/events) and the map are illustrative demo
  data — swap in a real weather API and a Google Maps/Mapbox embed when you're
  ready to go live.
- No external image assets are used; the skyline and map are inline SVG so the
  project has zero image dependencies out of the box.
