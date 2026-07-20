import type { Itinerary } from "@/lib/types";
import { renderInline } from "@/components/chat/markdown-content";

export function ItineraryBlock({ itinerary }: { itinerary: Itinerary }) {
  return (
    <div className="space-y-4">
      {itinerary.intro && <p className="text-sm leading-relaxed">{itinerary.intro}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {itinerary.days.map((day) => (
          <div key={day.label} className="rounded-2xl border border-border bg-black/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-primary">{day.label}</span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {day.badge}
              </span>
            </div>
            <div className="space-y-2.5">
              {day.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="shrink-0 tabular-nums text-muted-foreground">{item.time}</span>
                  <span>{renderInline(item.text, `${day.label}-${idx}`)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {itinerary.followUp && (
        <p className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">{itinerary.followUp}</p>
      )}
    </div>
  );
}
