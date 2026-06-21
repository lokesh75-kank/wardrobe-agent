import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClosetROI } from "@/components/closet/ClosetROI";
import { ClosetRotGrid } from "@/components/closet/ClosetRotGrid";
import { IntegrationsCard } from "@/components/closet/IntegrationsCard";
import { GooglePhotosCard } from "@/components/closet/GooglePhotosCard";
import { WardrobeGrid } from "@/components/closet/WardrobeGrid";
import { getClosetStats } from "@/lib/wardrobe-api";

export const Route = createFileRoute("/closet")({
  head: () => ({
    meta: [
      { title: "Closet — Wardrobe Agent" },
      { name: "description", content: "Your wardrobe dashboard: ROI, integrations, and closet rot." },
    ],
  }),
  component: ClosetPage,
});

function ClosetPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["closet-stats"],
    queryFn: getClosetStats,
  });

  return (
    <div className="space-y-5 px-5 pb-6 pt-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Closet</p>
        <h1 className="mt-1 text-2xl font-light tracking-tight text-zinc-900">Dashboard</h1>
      </header>

      {isLoading || !data ? (
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-2xl bg-rose-100" />
          <div className="h-36 animate-pulse rounded-2xl bg-rose-100" />
          <div className="h-36 animate-pulse rounded-2xl bg-rose-100" />
          <div className="h-48 animate-pulse rounded-2xl bg-rose-100" />
        </div>
      ) : (
        <>
          <ClosetROI saved={data.savedDollars} goal={data.savingsGoal} />
          <GooglePhotosCard />
          <IntegrationsCard />
          <WardrobeGrid />
          <ClosetRotGrid items={data.rotItems} />
        </>
      )}
    </div>
  );
}
