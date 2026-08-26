import { Skull } from "lucide-react";

const ITEMS = [
  ["overview", "Overview"],
  ["market", "Market"],
  ["competition", "Competition"],
  ["risks", "Risks"],
  ["evidence", "Evidence"],
  ["save", "Can We Save It?"],
  ["verdict", "Verdict"],
];

export default function ResultsNav({ onRestart }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      data-testid="results-nav"
      className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-testid="nav-brand"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand">
            <Skull size={12} className="text-white" />
          </div>
          <span className="hidden font-mono text-xs font-semibold uppercase tracking-widest text-body md:inline">
            KillMyIdea
          </span>
        </button>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {ITEMS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              data-testid={`nav-link-${id}`}
              className="whitespace-nowrap rounded px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-mist transition-colors duration-200 hover:bg-raise hover:text-body"
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={onRestart}
          data-testid="nav-new-analysis"
          className="hidden shrink-0 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-mist transition-colors duration-200 hover:border-brand/40 hover:text-body sm:block"
        >
          New Analysis
        </button>
      </div>
    </header>
  );
}
