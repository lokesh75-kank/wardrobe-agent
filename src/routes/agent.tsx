import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChatWindow } from "@/components/agent/ChatWindow";
import type { ChatMessage } from "@/lib/wardrobe-api";

export const Route = createFileRoute("/agent")({
  head: () => ({
    meta: [
      { title: "Agent — Wardrobe Agent" },
      { name: "description", content: "Chat with your AI wardrobe agent about outfits, packing, and more." },
    ],
  }),
  component: AgentPage,
});

const SEED: ChatMessage = {
  id: "seed-1",
  role: "agent",
  content:
    "Hey. I'm tracking tonight's dinner with Sarah. Ask me anything — outfits, packing, what's been sitting unworn.",
};

function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([SEED]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-rose-200 px-4 py-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Agent</p>
        <h1 className="text-sm font-light tracking-tight text-zinc-900">Wardrobe Concierge</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} onChange={setMessages} />
      </div>
    </div>
  );
}
