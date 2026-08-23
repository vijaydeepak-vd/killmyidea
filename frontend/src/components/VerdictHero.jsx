import ScoreRadial from "@/components/ScoreRadial";
import { riskLabelFor } from "@/data/analysis";
import { TONE, eyebrowClass } from "@/components/tones";

const Stat = ({ label, value, testid }) => (
  <div className="px-4 py-4 sm:px-5">
    <p className="font-mono text-[10px] uppercase tracking-widest text-mist">{label}</p>
    <p className="mt-1 font-mono text-lg font-semibold text-white sm:text-xl" data-testid={testid}>
      {value}
    </p>
  </div>
);

export default function VerdictHero({ result, projected }) {
  const risk = riskLabelFor(result.viability);
  const tone = TONE[risk.tone];

  return (
    <section id="overview" data-testid="results-overview" className="scroll-mt-20 pb-16 pt-14 animate-fade-up sm:pt-16">
      <div className="flex flex-wrap items-center gap-3">
        <span className={eyebrowClass}>KillMyIdea verdict</span>
        <span
          data-testid="risk-label"
          className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${tone.chip}`}
        >
          {risk.label}
        </span>
        {projected != null && (
          <span
            data-testid="projected-chip"
            className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-teal"
          >
            Projected → {projected}/100
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex items-center gap-8">
          <ScoreRadial score={result.viability} tone={risk.tone} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-mist">
              Viability score
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white">
              {result.viability} / 100
            </p>
            <p className={`mt-1 font-mono text-xs uppercase tracking-widest ${tone.text}`}>
              {risk.label}
            </p>
          </div>
        </div>

        <div>
          <blockquote
            data-testid="verdict-quote"
            className="max-w-2xl border-l-2 border-brand pl-5 text-base leading-relaxed text-white/90 md:text-lg"
          >
            “{result.quote}”
          </blockquote>
          <div className="mt-8 grid max-w-lg grid-cols-3 divide-x divide-line rounded-lg border border-line bg-surface">
            <Stat label="Viability" value={`${result.viability}/100`} testid="stat-viability" />
            <Stat label="Kill Risk" value={`${result.killRisk}/100`} testid="stat-kill-risk" />
            <Stat label="Confidence" value={`${result.confidence}%`} testid="stat-confidence" />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-mist">
            Target: {result.form.target} · Model: {result.form.monetization}
          </p>
        </div>
      </div>
    </section>
  );
}
