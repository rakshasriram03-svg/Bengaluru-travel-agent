# Bengaluru Smart Travel Assistant

A Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui rebuild of the
Bengaluru Smart Travel Assistant — an AI travel planning product with a
conversational itinerary builder, live-style insights dashboard, weather, and
saved places, all wired to talk to your own n8n webhook.

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
  providers/               ChatProvider — sessions, webhook calls, toasts
  toast/                    Toast stack
  ui/                        shadcn-style primitives

lib/
  types.ts               Shared TypeScript types
  constants.ts            Mock data, nav config, demo itinerary
  storage.ts               Safe localStorage helpers
  utils.ts                   `cn()` class merge helper

hooks/
  use-toasts.ts
  use-typewriter.ts
```

## Connecting your n8n backend

The chat POSTs to a webhook URL and expects `{ "reply": "..." }` back:

```json
POST {webhookUrl}
Content-Type: application/json

{ "message": "Suggest parks near Viveknagar" }
```

Set the URL from the app itself: click the avatar icon (top right) → **Settings**
→ paste your n8n webhook URL. It's stored in `localStorage`, or you can change
the compiled-in default in `lib/constants.ts` (`DEFAULT_WEBHOOK_URL`).

## Notes

- Chat sessions, theme, and the webhook URL persist in `localStorage`.
- The Insights page (traffic/climate/events) and the map are illustrative demo
  data — swap in a real weather API and a Google Maps/Mapbox embed when you're
  ready to go live.
- No external image assets are used; the skyline and map are inline SVG so the
  project has zero image dependencies out of the box.
