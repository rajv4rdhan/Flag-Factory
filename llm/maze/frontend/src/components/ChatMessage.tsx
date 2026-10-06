import type { Message } from "../types";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-emerald-500/90 text-slate-950"
            : "rounded-bl-sm border border-slate-700/70 bg-slate-900/80 text-slate-100",
        ].join(" ")}
      >
        {message.content}
      </div>
    </div>
  );
}
