import { useState } from "react";
import { ChevronDown, Minus } from "lucide-react";
import { TONE } from "@/components/tones";

export default function EvidenceCard({ item, index, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const tone = TONE[item.levelTone];

  return (
    <div
      className="overflow-hidden rounded-lg border border-line bg-surface"
      data-testid={`evidence-card-${index}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        data-testid={`evidence-toggle-${index}`}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 p-5 text-left transition-colors duration-200 hover:bg-raise"
      >
        <span className="font-display text-base font-semibold text-body">{item.title}</span>
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${tone.chip}`}
        >
          {item.level}
        </span>
        <span className="rounded-full border border-info/40 bg-info/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-info">
          Demo evidence
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-mist sm:inline">
            Evidence strength: {item.strength}
          </span>
          <ChevronDown
            size={16}
            className={`text-mist transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div className="border-t border-line p-5 animate-fade-up">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-mist sm:hidden">
            Evidence strength: {item.strength}
          </p>
          <ul className="space-y-2.5">
            {item.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-body/85">
                <Minus size={14} className="mt-1 shrink-0 text-teal" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
