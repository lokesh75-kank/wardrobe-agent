import type { ContextWidget } from "@/lib/wardrobe-api";

export function ContextWidgets({ items }: { items: ContextWidget[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((w) => (
        <div
          key={w.label}
          className="flex items-center gap-2 rounded-full border border-rose-200 bg-white/60 px-3 py-1.5 text-xs text-zinc-700"
        >
          <span aria-hidden>{w.icon}</span>
          <span className="tracking-tight">{w.label}</span>
        </div>
      ))}
    </div>
  );
}
