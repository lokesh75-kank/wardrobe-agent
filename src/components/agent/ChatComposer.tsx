import { ArrowUp } from "lucide-react";
import { forwardRef, useState, type FormEvent, type KeyboardEvent } from "react";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export const ChatComposer = forwardRef<HTMLTextAreaElement, Props>(function ChatComposer(
  { disabled, onSend },
  ref,
) {
  const [value, setValue] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-2 rounded-2xl border border-rose-200 bg-white p-2 pl-4"
    >
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        placeholder="Ask your wardrobe agent…"
        className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-[#FFE3E3] transition-opacity disabled:opacity-30"
        aria-label="Send"
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </form>
  );
});
