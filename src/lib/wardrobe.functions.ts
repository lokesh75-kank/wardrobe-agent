// Server functions for Wardrobe Agent — now wired to HydraDB + Nebius.
// Client (`wardrobe-api.ts`) and components are unchanged.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import oliveJacket from "@/assets/olive-jacket.jpg";
import whiteTee from "@/assets/white-tee.jpg";
import rotJeans from "@/assets/rot-jeans.jpg";
import rotSweater from "@/assets/rot-sweater.jpg";
import rotBoots from "@/assets/rot-boots.jpg";

// --- Shared types ---

export type ClothingItem = {
  id: string;
  name: string;
  category: string;
  image: string;
};

export type ContextWidget = { icon: string; label: string };

export type TodayRecommendation = {
  context: ContextWidget[];
  outfit: ClothingItem[];
  reasoning: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export type ClosetStats = {
  savedDollars: number;
  savingsGoal: number;
  rotItems: ClothingItem[];
};

// --- image_key → bundled asset lookup ---

const IMAGE_BY_KEY: Record<string, string> = {
  "olive-jacket": oliveJacket,
  "white-tee": whiteTee,
  "rot-jeans": rotJeans,
  "rot-sweater": rotSweater,
  "rot-boots": rotBoots,
};

function resolveImage(key: string | undefined): string {
  return (key && IMAGE_BY_KEY[key]) || oliveJacket;
}

// --- Lazy, one-shot tenant + seed bootstrap. Errors are swallowed so the UI
// keeps working even if Hydra is slow to provision on cold start. ---

let bootPromise: Promise<void> | null = null;

async function ensureBootstrap(): Promise<void> {
  if (!bootPromise) {
    bootPromise = (async () => {
      try {
        const { createTenant, tenantStatus, ingestKnowledge } = await import("./hydra.server");
        const { SEED_CLOSET } = await import("./wardrobe.seed");
        await createTenant();
        // Best-effort: short poll for readiness, then ingest seed.
        for (let i = 0; i < 6; i++) {
          const s = await tenantStatus();
          if (s.ready) break;
          await new Promise((r) => setTimeout(r, 1500));
        }
        await ingestKnowledge(
          SEED_CLOSET.map((it) => ({
            id: it.id,
            title: it.name,
            text: `${it.name} (${it.color} ${it.category} by ${it.brand}, $${it.price}). ${it.description}`,
            metadata: {
              item_id: it.id,
              category: it.category,
              brand: it.brand,
              image_key: it.image_key,
            },
          })),
        );
      } catch (err) {
        console.error("[wardrobe] bootstrap failed (using fallbacks):", err);
        // Reset so next call retries — useful during initial Hydra provisioning.
        bootPromise = null;
      }
    })();
  }
  return bootPromise;
}

// --- Today recommendation ---

export const getTodayRecommendationFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<TodayRecommendation> => {
    const context: ContextWidget[] = [
      { icon: "📍", label: "GCal · Dinner with Sarah · 8:00 PM" },
      { icon: "🌤️", label: "12°C · Clear" },
    ];

    // Defaults if Hydra/Nebius are unavailable on cold start.
    let outfit: ClothingItem[] = [
      { id: "olive-jacket", name: "Olive Field Jacket", category: "Outerwear", image: oliveJacket },
      { id: "white-tee", name: "White Cotton Tee", category: "Top", image: whiteTee },
    ];
    let reasoning =
      "You've worn the Navy Blazer with Sarah twice. I'm suggesting your unworn Olive Jacket today.";

    try {
      await ensureBootstrap();
      const { query } = await import("./hydra.server");
      const { nebiusChat, WARDROBE_SYSTEM_PROMPT } = await import("./nebius.server");
      const { SEED_CLOSET } = await import("./wardrobe.seed");

      const contextQuery =
        "Dinner with Sarah at 8pm. Outdoor weather 12°C clear. Pick one outerwear + one top from the closet that hasn't been worn recently and fits a dinner context.";

      const hits = await query({
        query: contextQuery,
        type: "all",
        mode: "thinking",
        maxResults: 8,
      });

      const retrieved = hits
        .map((h, i) => {
          const md = (h.metadata ?? {}) as Record<string, unknown>;
          const text = h.content?.text ?? h.text ?? "";
          return `[${i + 1}] item_id=${md.item_id ?? "?"} category=${md.category ?? "?"} — ${h.title ?? ""}: ${text}`.slice(0, 400);
        })
        .join("\n");

      const catalog = SEED_CLOSET.map((it) => `- ${it.id} (${it.category}): ${it.name}`).join("\n");

      const userPrompt = `Tonight's context:
- Calendar: Dinner with Sarah, 8:00 PM
- Weather: 12°C, clear

Closet (use item_id verbatim):
${catalog}

Retrieved context from wardrobe memory:
${retrieved || "(none yet)"}

Pick the best 2 items for tonight and explain in 1–2 sentences. Respond as STRICT JSON only:
{"outfit_ids": ["id1", "id2"], "reasoning": "..."}`;

      const raw = await nebiusChat(
        [
          { role: "system", content: WARDROBE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        { temperature: 0.4, maxTokens: 240 },
      );

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as {
          outfit_ids?: string[];
          reasoning?: string;
        };
        const picks = (parsed.outfit_ids ?? [])
          .map((id) => SEED_CLOSET.find((it) => it.id === id))
          .filter((it): it is NonNullable<typeof it> => Boolean(it));
        if (picks.length >= 1) {
          outfit = picks.slice(0, 2).map((it) => ({
            id: it.id,
            name: it.name,
            category: it.category,
            image: resolveImage(it.image_key),
          }));
        }
        if (parsed.reasoning) reasoning = parsed.reasoning;
      }
    } catch (err) {
      console.error("[today] using fallback recommendation:", err);
    }

    return { context, outfit, reasoning };
  },
);

// --- Agent chat ---

const ChatInput = z.object({
  text: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "agent"]),
        content: z.string(),
      }),
    )
    .max(50),
});

export const sendAgentMessageFn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const { nebiusChat, WARDROBE_SYSTEM_PROMPT } = await import("./nebius.server");

    // Best-effort Hydra retrieval; chat still works if it fails.
    let groundedContext = "";
    try {
      await ensureBootstrap();
      const { query } = await import("./hydra.server");
      const hits = await query({
        query: data.text,
        type: "all",
        mode: "fast",
        maxResults: 5,
      });
      groundedContext = hits
        .map((h, i) => `[${i + 1}] ${h.title ?? ""}: ${(h.content?.text ?? h.text ?? "").slice(0, 300)}`)
        .join("\n");
    } catch (err) {
      console.error("[agent] Hydra retrieval failed:", err);
    }

    const systemContent = groundedContext
      ? `${WARDROBE_SYSTEM_PROMPT}\n\nRelevant closet + memory context:\n${groundedContext}`
      : WARDROBE_SYSTEM_PROMPT;

    try {
      const reply = await nebiusChat([
        { role: "system", content: systemContent },
        ...data.history.map((m) => ({
          role: m.role === "agent" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
        { role: "user", content: data.text },
      ]);
      return { reply: reply || "Noted." };
    } catch (err) {
      console.error("[agent] Nebius chat failed:", err);
      return {
        reply:
          "I couldn't reach the styling model just now. Try again in a moment — your closet context is still intact.",
      };
    }
  });

// --- Instagram sync (seed + ingest as Hydra memory) ---

export const syncInstagramFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ loggedItem: string }> => {
    const { nextInstagramWear } = await import("./instagram.seed");
    const event = nextInstagramWear();

    // Map seed item name → catalog id for metadata filtering.
    const { SEED_CLOSET } = await import("./wardrobe.seed");
    const matched = SEED_CLOSET.find((c) => c.name === event.item);
    const itemId = matched?.id ?? event.item.toLowerCase().replace(/\s+/g, "-");

    // Fire-and-forget memory ingest. UI returns immediately.
    void (async () => {
      try {
        await ensureBootstrap();
        const { ingestMemory } = await import("./hydra.server");
        await ingestMemory(
          `Wore ${event.item} at ${event.location} (${event.caption}) on ${new Date().toISOString().slice(0, 10)}.`,
          { item_id: itemId, location: event.location, ts: Date.now() },
        );
      } catch (err) {
        console.error("[ig] ingestMemory failed:", err);
      }
    })();

    await new Promise((r) => setTimeout(r, 500));
    return { loggedItem: `${event.item} at ${event.location}` };
  },
);

// --- Closet stats (derived from Hydra memories) ---

export const getClosetStatsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClosetStats> => {
    const { SEED_CLOSET } = await import("./wardrobe.seed");

    // Fallback shape — used if Hydra is unavailable.
    let savedDollars = 150;
    const savingsGoal = 500;
    let rotItems: ClothingItem[] = [
      { id: "rot-jeans", name: "Selvedge Denim", category: "Bottoms", image: rotJeans },
      { id: "rot-sweater", name: "Cream Cable Knit", category: "Knitwear", image: rotSweater },
      { id: "rot-boots", name: "Chelsea Boots", category: "Footwear", image: rotBoots },
    ];

    try {
      await ensureBootstrap();
      const { listContext } = await import("./hydra.server");
      const memories = await listContext("memory", 200);

      // Count wears per item_id.
      const wearCount = new Map<string, number>();
      for (const m of memories) {
        const id = (m.metadata as Record<string, unknown> | undefined)?.item_id;
        if (typeof id === "string") wearCount.set(id, (wearCount.get(id) ?? 0) + 1);
      }

      // "$ saved" = sum of prices of items that have at least one wear event.
      savedDollars = SEED_CLOSET.filter((it) => (wearCount.get(it.id) ?? 0) > 0).reduce(
        (sum, it) => sum + it.price,
        0,
      );

      // "rot" = items with no wear events in the memory store.
      const rot = SEED_CLOSET.filter((it) => (wearCount.get(it.id) ?? 0) === 0);
      if (rot.length > 0) {
        rotItems = rot.slice(0, 3).map((it) => ({
          id: it.id,
          name: it.name,
          category: it.category,
          image: resolveImage(it.image_key),
        }));
      }
    } catch (err) {
      console.error("[closet] using fallback stats:", err);
    }

    return { savedDollars, savingsGoal, rotItems };
  },
);
