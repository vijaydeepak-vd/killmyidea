import {
  Target,
  TrendingUp,
  Swords,
  Fingerprint,
  Banknote,
  Megaphone,
  Wrench,
  ShieldCheck,
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

export default function FactorCard({ factor }) {
  const level = factorLevel(factor.score);
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
    </div>
  );
}
