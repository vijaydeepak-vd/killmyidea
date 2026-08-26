import { Trash2, ChevronRight } from "lucide-react";
import { TONE, eyebrowClass } from "@/components/tones";
import Reveal from "@/components/Reveal";

export default function VerdictHistory({ entries, onSelect, onClear }) {
  if (!entries || entries.length === 0) return null;

  return (
    <section className="border-t border-line" data-testid="verdict-history">
      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className={eyebrowClass}>Verdict history</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-body">
                Past executions
              </h2>
            </div>
            <button
              onClick={onClear}
              data-testid="history-clear"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-mist transition-colors duration-200 hover:text-body"
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </Reveal>
        <div className="mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {entries.map((e) => (
            <button
              key={e.id}
              onClick={() => onSelect(e)}
              data-testid={`history-item-${e.id}`}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors duration-200 hover:bg-raise sm:gap-4"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${TONE[e.tone]?.dot || "bg-mist"}`} />
              <span className="min-w-0 flex-1 truncate text-sm text-body">{e.idea}</span>
              <span className="shrink-0 font-mono text-sm font-semibold text-body">
                {e.score}
                <span className="text-mist">/100</span>
              </span>
              <span
                className={`hidden shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest sm:inline-block ${TONE[e.tone]?.chip || ""}`}
              >
                {e.verdictLabel}
              </span>
              <ChevronRight size={14} className="shrink-0 text-mist" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
