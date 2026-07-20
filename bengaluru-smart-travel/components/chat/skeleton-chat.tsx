function SkeletonMessage({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div className={`flex animate-pulse gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
      <div className="max-w-[70%] flex-1 space-y-2">
        <div className="h-3 w-4/5 rounded bg-muted" />
        <div className="h-3 w-3/5 rounded bg-muted" />
      </div>
    </div>
  );
}

export function SkeletonChatArea() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <SkeletonMessage align="left" />
      <SkeletonMessage align="right" />
      <SkeletonMessage align="left" />
    </div>
  );
}
