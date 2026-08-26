import { useState } from "react";
import {
  Target,
  TrendingUp,
  Swords,
  Fingerprint,
  Banknote,
  Megaphone,
  Wrench,
  ShieldCheck,
  ChevronDown,
  Minus,
} from "lucide-react";
import { factorLevel } from "@/data/analysis";
import { TONE } from "@/components/tones";

const ICONS = {
  problem: Target,
  market: TrendingUp,
  competition: Swords,
  differentiation: Fingerprint,
  monetization: Banknote,
  distribution: Megaphone,
  execution: Wrench,
  defensibility: ShieldCheck,
};

const levelFromRisk = (riskLevel, score) => {
  if (riskLevel) {
    const tone = /high/i.test(riskLevel) ? "red" : /low/i.test(riskLevel) ? "green" : "amber";
    return { label: riskLevel, tone };
  }
  return factorLevel(score);
};

export default function FactorCard({ factor }) {
  const [open, setOpen] = useState(false);
  const level = levelFromRisk(factor.riskLevel, factor.score);
  const tone = TONE[level.tone];
  const Icon = ICONS[factor.key] || Target;

  return (
    <div
      data-testid={`factor-card-${factor.key}`}
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 transition-colors duration-200 hover:border-brand/40"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-raise text-mist">
          <Icon size={16} />
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${tone.chip}`}
        >
          {level.label}
        </span>
      </div>
      <div>
        <p className="font-mono text-3xl font-semibold text-body">
          {factor.score}
          <span className="text-sm text-mist">/100</span>
        </p>
        <h3 className="mt-1 font-display text-base font-semibold text-body">{factor.name}</h3>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-raise">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${factor.score}%` }} />
      </div>
      <p className="text-sm leading-relaxed text-mist">{factor.text}</p>
      {factor.reasoning && factor.reasoning.length > 0 && (
        <div className="border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            data-testid={`factor-why-${factor.key}`}
            className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-widest text-mist transition-colors duration-200 hover:text-body"
          >
            Why this score?
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="mt-3 animate-fade-up">
              <ul className="space-y-1.5">
                {factor.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-mist">
                    <Minus size={11} className="mt-0.5 shrink-0 text-teal" />
                    {r}
                  </li>
                ))}
              </ul>
              {factor.confidence && (
                <span className="mt-3 inline-block rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-mist">
                  Confidence: {factor.confidence}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
