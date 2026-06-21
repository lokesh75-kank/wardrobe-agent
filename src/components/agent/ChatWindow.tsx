import { useEffect, useRef, useState } from "react";
import { sendAgentMessage, type ChatMessage } from "@/lib/wardrobe-api";
import { ChatComposer } from "./ChatComposer";
import { MessageBubble, TypingBubble } from "./MessageBubble";

type Props = {
  messages: ChatMessage[];
  onChange: (messages: ChatMessage[]) => void;
};

export function ChatWindow({ messages, onChange }: Props) {
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const next = [...messages, userMsg];
    onChange(next);
    setTyping(true);
    try {
      const { reply } = await sendAgentMessage(text, next);
      onChange([...next, { id: crypto.randomUUID(), role: "agent", content: reply }]);
    } finally {
      setTyping(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {typing && <TypingBubble />}
      </div>
      <div className="border-t border-rose-200 bg-[#FFE3E3] px-4 py-3">
        <ChatComposer ref={inputRef} disabled={typing} onSend={handleSend} />
      </div>
    </div>
  );
}
