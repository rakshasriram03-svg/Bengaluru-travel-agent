import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  live?: boolean;
  children: React.ReactNode;
}

export function StatCard({ icon: Icon, label, live, children }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" /> {label}
        </div>
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> Live
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
