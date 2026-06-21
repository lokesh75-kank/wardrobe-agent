import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Uploaded = { id: string; name: string; url: string };

export function GooglePhotosCard() {
  const [items, setItems] = useState<Uploaded[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    // Simulate Google Photos picker latency
    setTimeout(() => {
      const uploaded: Uploaded[] = Array.from(files).map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        url: URL.createObjectURL(f),
      }));
      setItems((prev) => [...uploaded, ...prev].slice(0, 8));
      setLoading(false);
      toast.success(`Imported ${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} from Google Photos`);
    }, 700);
  };

  return (
    <section className="rounded-2xl border border-rose-200 bg-white/70 p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Google Photos</p>
      <p className="mt-2 text-sm text-zinc-700">
        Import outfit photos from your Google Photos library so the agent can catalog them.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-[#FFE3E3] px-4 py-3 text-sm font-medium text-zinc-900 transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
        )}
        {loading ? "Importing…" : "Select from Google Photos"}
      </button>

      {items.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="aspect-square overflow-hidden rounded-lg border border-rose-200 bg-white"
            >
              <img src={it.url} alt={it.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
