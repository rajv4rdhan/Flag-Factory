import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  maxLength?: number;
}

export default function ChatInput({ onSend, disabled, maxLength = 2000 }: ChatInputProps) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-2 focus-within:border-emerald-400/40">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        maxLength={maxLength}
        placeholder="Ask the Zoo Keeper AI…"
        className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !text.trim()}
        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
