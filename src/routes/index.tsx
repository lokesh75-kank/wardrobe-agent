import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ContextWidgets } from "@/components/today/ContextWidgets";
import { OutfitCard } from "@/components/today/OutfitCard";
import { ManualEventCard } from "@/components/today/ManualEventCard";
import { getTodayRecommendation, type ContextWidget } from "@/lib/wardrobe-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Wardrobe Agent" },
      { name: "description", content: "Your daily outfit recommendation, curated by your AI wardrobe agent." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["today-recommendation"],
    queryFn: getTodayRecommendation,
  });

  const [manualEvents, setManualEvents] = useState<ContextWidget[]>([]);

  const addEvent = (e: ContextWidget) =>
    setManualEvents((prev) =>
      prev.some((p) => p.label === e.label) ? prev : [...prev, e],
    );
  const removeEvent = (label: string) =>
    setManualEvents((prev) => prev.filter((p) => p.label !== label));

  return (
    <div className="space-y-6 px-5 pb-6 pt-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Today</p>
        <h1 className="mt-1 text-2xl font-light tracking-tight text-zinc-900">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </h1>
      </header>

      {isLoading || !data ? (
        <div className="space-y-4">
          <div className="h-8 animate-pulse rounded-full bg-rose-100" />
          <div className="h-[420px] animate-pulse rounded-2xl bg-rose-100" />
        </div>
      ) : (
        <>
          <ContextWidgets items={[...data.context, ...manualEvents]} />
          <ManualEventCard events={manualEvents} onAdd={addEvent} onRemove={removeEvent} />
          <OutfitCard items={data.outfit} reasoning={data.reasoning} />
        </>
      )}
    </div>
  );
}
