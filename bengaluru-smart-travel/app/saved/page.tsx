import { Bookmark } from "lucide-react";
import { SAVED_PLACES } from "@/lib/constants";

export const metadata = { title: "Saved Places • Bengaluru Smart" };

export default function SavedPlacesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <h2 className="mb-5 text-xl font-bold">Saved Places</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SAVED_PLACES.map((p) => (
          <div key={p.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Bookmark className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.tag}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
