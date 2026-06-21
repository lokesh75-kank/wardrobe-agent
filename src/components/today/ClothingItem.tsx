import type { ClothingItem as Item } from "@/lib/wardrobe-api";

export function ClothingItemCard({ item }: { item: Item }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[4/5] overflow-hidden rounded-xl border border-rose-200 bg-white">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{item.category}</p>
        <p className="text-sm text-zinc-900">{item.name}</p>
      </div>
    </div>
  );
}
