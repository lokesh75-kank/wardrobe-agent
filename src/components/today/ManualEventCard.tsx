import { CalendarPlus, Plus, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { ContextWidget } from "@/lib/wardrobe-api";

type Props = {
  events: ContextWidget[];
  onAdd: (event: ContextWidget) => void;
  onRemove: (label: string) => void;
};

export function ManualEventCard({ events, onAdd, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const label = time ? `${t} · ${time}` : t;
    onAdd({ icon: "🗓️", label });
    setTitle("");
    setTime("");
    setOpen(false);
  };

  return (
    <section className="rounded-2xl border border-rose-200 bg-white/70 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Manual Events</p>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 rounded-full border border-rose-300 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-zinc-900 hover:bg-[#FFE3E3]"
        >
          <Plus className="h-3 w-3" strokeWidth={2} />
          Add
        </button>
      </div>

      {events.length === 0 && !open && (
        <p className="mt-2 text-sm text-zinc-600">
          Add anything not in Google Calendar — drinks, a flight, a gym slot.
        </p>
      )}

      {events.length > 0 && (
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li
              key={e.label}
              className="flex items-center justify-between rounded-xl border border-rose-200 bg-[#FFE3E3]/60 px-3 py-2 text-sm text-zinc-800"
            >
              <span className="flex items-center gap-2">
                <span aria-hidden>{e.icon}</span>
                {e.label}
              </span>
              <button
                onClick={() => onRemove(e.label)}
                aria-label="Remove event"
                className="text-zinc-500 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2">
            <CalendarPlus className="h-4 w-4 text-zinc-500" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              placeholder="Event title (e.g. Coffee with Dan)"
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-[#FFE3E3] hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
