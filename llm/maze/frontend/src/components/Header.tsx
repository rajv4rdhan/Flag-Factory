interface HeaderProps {
  onReset: () => void;
  turns: number;
}

export default function Header({ onReset, turns }: HeaderProps) {
  return (
    <header className="border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <span className="text-lg">🌀</span>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-wide text-slate-100">Maze</h1>
            <p className="text-xs text-slate-400">Zoo Keeper AI · guardian of the vault</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate-500 sm:inline">{turns} turns</span>
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
          >
            New chat
          </button>
        </div>
      </div>
    </header>
  );
}
