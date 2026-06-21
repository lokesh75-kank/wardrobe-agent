import { Instagram, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { syncInstagram } from "@/lib/wardrobe-api";

export function IntegrationsCard() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const { loggedItem } = await syncInstagram();
      toast.success(`Logged: ${loggedItem}`);
    } catch {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-rose-200 bg-white/70 p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Integrations</p>
      <p className="mt-2 text-sm text-zinc-700">
        Pull your latest post and let the agent identify what you wore and where.
      </p>
      <button
        onClick={handleSync}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-medium text-[#FFE3E3] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Instagram className="h-4 w-4" strokeWidth={1.75} />
        )}
        {loading ? "Syncing…" : "Sync Latest Instagram Post"}
      </button>
    </section>
  );
}
