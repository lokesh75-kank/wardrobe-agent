// Server-only Nebius AI Studio client (OpenAI-compatible chat completions).
// Docs: https://docs.nebius.com/studio/inference/quickstart

const NEBIUS_BASE_URL = "https://api.studio.nebius.com/v1";
const DEFAULT_MODEL = "meta-llama/Llama-3.3-70B-Instruct";

export type NebiusMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function nebiusChat(
  messages: NebiusMessage[],
  opts: { model?: string; temperature?: number; maxTokens?: number } = {},
): Promise<string> {
  const apiKey = process.env.NEBIUS_API_KEY;
  if (!apiKey) throw new Error("Missing NEBIUS_API_KEY");

  const res = await fetch(`${NEBIUS_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model ?? DEFAULT_MODEL,
      temperature: opts.temperature ?? 0.6,
      max_tokens: opts.maxTokens ?? 400,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Nebius ${res.status}: ${errText.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

export const WARDROBE_SYSTEM_PROMPT = `You are Wardrobe Agent — a calm, taste-forward personal stylist concierge.
Voice: minimal, confident, second-person. Reference real garment types (e.g. "olive field jacket", "chelsea boots").
Keep replies under 3 sentences unless the user asks for a list. Never use emojis. Never apologize.
You have memory of the user's closet, recent wears, calendar, and weather. Make concrete recommendations, not hedged options.`;
