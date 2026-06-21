import type { ClothingItem } from "@/lib/wardrobe-api";

export function ClosetRotGrid({ items }: { items: ClothingItem[] }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Closet Rot</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {items.length} items
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <div className="aspect-square overflow-hidden rounded-xl border border-rose-200 bg-white">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover opacity-90"
              />
            </div>
            <span className="absolute left-2 top-2 rounded-full bg-rose-600/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              0 Wears
            </span>
            <p className="mt-2 truncate text-xs text-zinc-700">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
