import type { ClothingItem } from "@/lib/wardrobe-api";
import { ClothingItemCard } from "./ClothingItem";

export function OutfitCard({ items, reasoning }: { items: ClothingItem[]; reasoning: string }) {
  return (
    <section className="rounded-2xl border border-rose-200 bg-white/70 p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Outfit of the Day</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Curated</span>
      </header>
      <div className="grid grid-cols-2 gap-3">
        {items.map((i) => (
          <ClothingItemCard key={i.id} item={i} />
        ))}
      </div>
      <div className="mt-5 border-t border-rose-200 pt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Agent reasoning</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{reasoning}</p>
      </div>
    </section>
  );
}
