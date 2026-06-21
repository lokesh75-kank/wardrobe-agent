export function ClosetROI({ saved, goal }: { saved: number; goal: number }) {
  const pct = Math.min(100, Math.round((saved / goal) * 100));
  return (
    <section className="rounded-2xl border border-rose-200 bg-white/70 p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Closet ROI</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-sm text-zinc-700">Money saved by wearing unworn items</p>
        <p className="text-2xl font-light tracking-tight text-zinc-900">${saved}</p>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-rose-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        {pct}% toward ${goal} goal
      </p>
    </section>
  );
}
