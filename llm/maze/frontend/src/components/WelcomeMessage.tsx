interface WelcomeMessageProps {
  onSuggestion: (text: string) => void;
  disabled: boolean;
}

const SUGGESTIONS = [
  "Who are you?",
  "What animals live at the zoo?",
  "When does the zoo open?",
  "Tell me a fun fact about elephants.",
];

export default function WelcomeMessage({ onSuggestion, disabled }: WelcomeMessageProps) {
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-3xl ring-1 ring-emerald-400/20">
        🌀
      </div>
      <h2 className="text-xl font-semibold text-slate-100">Welcome to Maze</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        I&apos;m the Zoo Keeper AI. I guard the vault and can help with anything about the zoo.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => onSuggestion(s)}
            className="rounded-full border border-slate-700 px-3.5 py-1.5 text-xs text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
