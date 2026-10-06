import { useEffect, useRef, useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import Header from "./components/Header";
import TypingIndicator from "./components/TypingIndicator";
import WelcomeMessage from "./components/WelcomeMessage";
import { ask } from "./lib/api";
import type { Message } from "./types";

const SESSION_KEY = "maze_session";

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY),
  );
  const [turns, setTurns] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || isTyping) return;

    setError(null);
    setMessages((prev) => [...prev, { id: newId(), role: "user", content }]);
    setIsTyping(true);
    try {
      const res = await ask(content, sessionId);
      setSessionId(res.session_id);
      localStorage.setItem(SESSION_KEY, res.session_id);
      setTurns(res.turns);
      setMessages((prev) => [...prev, { id: newId(), role: "assistant", content: res.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsTyping(false);
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
    setTurns(0);
    setSessionId(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <div className="maze-grid flex h-full flex-col">
      <Header onReset={reset} turns={turns} />

      <main className="flex-1 overflow-y-auto px-5">
        <div className="mx-auto max-w-3xl py-6">
          {messages.length === 0 ? (
            <WelcomeMessage onSuggestion={send} disabled={isTyping} />
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/80 px-5 py-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={send} disabled={isTyping} />
          <p className="mt-2 text-center text-[11px] text-slate-600">
            Maze · a deliberately vulnerable LLM challenge
          </p>
        </div>
      </footer>
    </div>
  );
}
