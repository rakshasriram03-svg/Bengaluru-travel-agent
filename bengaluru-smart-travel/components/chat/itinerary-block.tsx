"use client";

import { motion } from "framer-motion";
import { Clock, CloudSun, MapPin, Navigation, SearchX, Star } from "lucide-react";
import type { Itinerary, ItineraryItem } from "@/lib/types";
import { renderInline } from "@/components/chat/markdown-content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function PlaceCard({ item, dayLabel, idx }: { item: ItineraryItem; dayLabel: string; idx: number }) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.mapsQuery || item.name || item.text
  )}`;

  return (
    <motion.div
      variants={cardVariant}
      className="group rounded-xl border border-border bg-muted/60 p-4 transition-shadow hover:shadow-glow"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-primary">
            {item.time}
          </span>
          {item.name && <span className="font-semibold leading-snug text-foreground">{item.name}</span>}
        </div>
        {item.category && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            {item.category}
          </span>
        )}
      </div>

      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {renderInline(item.text, `${dayLabel}-${idx}-desc`)}
      </p>

      {(item.rating || item.address) && (
        <div className="mb-3 space-y-1.5 text-xs text-muted-foreground">
          {item.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{item.rating.toFixed(1)}</span>
            </div>
          )}
          {item.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-glow" />
              <span className="truncate">{item.address}</span>
            </div>
          )}
          {item.hours && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-accent-glow" />
              <span>{item.hours}</span>
            </div>
          )}
        </div>
      )}

      {(item.weather || item.distance) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {item.weather && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-accent/50 px-2 py-1 text-[11px] text-muted-foreground">
              <CloudSun className="h-3 w-3" /> {item.weather}
            </span>
          )}
          {item.distance && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-accent/50 px-2 py-1 text-[11px] text-muted-foreground">
              <Navigation className="h-3 w-3" /> {item.distance}
            </span>
          )}
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent-glow px-3 py-1.5 text-xs font-semibold text-white opacity-90 transition-opacity hover:opacity-100"
      >
        <MapPin className="h-3.5 w-3.5" /> View on Maps
      </a>
    </motion.div>
  );
}

export function ItineraryBlock({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="space-y-4">
      {itinerary.intro && <p className="text-sm leading-relaxed">{itinerary.intro}</p>}

      {itinerary.days.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
          <SearchX className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No recommendations found yet</p>
          <p className="text-xs text-muted-foreground">Try refining your request, or ask about a specific area or interest.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {itinerary.days.map((day) => (
          <div key={day.label} className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-primary">{day.label}</span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {day.badge}
              </span>
            </div>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
              {day.items.map((item, idx) => (
                <PlaceCard key={idx} item={item} dayLabel={day.label} idx={idx} />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {itinerary.followUp && (
        <p className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">{itinerary.followUp}</p>
      )}
    </div>
  );
}
