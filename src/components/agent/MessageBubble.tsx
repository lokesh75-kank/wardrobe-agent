import type { ChatMessage } from "@/lib/wardrobe-api";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {isUser ? (
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-zinc-900 px-4 py-2.5 text-sm text-[#FFE3E3]">
          {message.content}
        </div>
      ) : (
        <div className="max-w-[85%] text-sm leading-relaxed text-zinc-800">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Agent</p>
          {message.content}
        </div>
      )}
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Agent</p>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
