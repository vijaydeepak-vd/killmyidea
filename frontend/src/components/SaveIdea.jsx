import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { verdictFor } from "@/data/analysis";
import { TONE, eyebrowClass } from "@/components/tones";

export default function SaveIdea({ result, tested, onTest }) {
  const { save } = result;
  const [display, setDisplay] = useState(result.viability);

  useEffect(() => {
    if (!tested || !save.possible) return;
    let raf;
    const t0 = performance.now();
    const from = result.viability;
    const to = save.projected;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1200);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tested, save, result.viability]);

  if (!save.possible) {
    return (
      <div data-testid="save-idea">
        <SectionHeading
          eyebrow="The only way out"
          title="Can We Save This Idea?"
          sub="We only show a change if it materially improves the odds."
        />
        <div className="rounded-xl border border-risk/30 bg-surface p-6 sm:p-10" data-testid="no-improvement">
          <h3 className="font-display text-xl font-bold text-body sm:text-2xl">
            No meaningful improvement found.
          </h3>
          <blockquote className="mt-4 max-w-2xl border-l-2 border-risk pl-4 leading-relaxed text-body/85">
            {save.explanation}
          </blockquote>
          <p className="mt-6 font-mono text-sm uppercase tracking-widest">
            <span className="text-mist">Recommendation: </span>
            <span className={save.positive ? "text-viable" : "text-risk"} data-testid="save-recommendation">
              {save.positive ? "Proceed to customer validation." : "Don't build it."}
            </span>
          </p>
        </div>
      </div>
    );
  }

  const newVerdict = verdictFor(save.projected);
  const newTone = TONE[newVerdict.tone];

  return (
    <div data-testid="save-idea">
      <SectionHeading
        eyebrow="The only way out"
        title="Can We Save This Idea?"
        sub="We only show a change if it materially improves the odds."
      />
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className={eyebrowClass}>Current</p>
            <p className="mt-2 font-mono text-4xl font-semibold text-body">
              {result.viability}
              <span className="text-lg text-mist"> / 100</span>
            </p>
            <p className={`mt-8 ${eyebrowClass}`}>Recommended change</p>
            <blockquote
              data-testid="save-change"
              className="mt-3 border-l-2 border-brand pl-4 leading-relaxed text-body/90"
            >
              {save.change}
            </blockquote>
            <p className="mt-4 text-sm leading-relaxed text-mist">{save.paragraph}</p>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-10">
            <p className={eyebrowClass}>Projected viability</p>
            <p className="mt-2 font-mono text-4xl font-semibold text-body" data-testid="projected-score">
              {tested ? (
                <>
                  {display}
                  <span className="text-lg text-mist"> / 100</span>
                </>
              ) : (
                <>
                  {result.viability} <span className="text-teal">→</span> {save.projected}
                </>
              )}
            </p>
            <ul className="mt-6 space-y-2.5">
              {save.reasons.map((reason) => (
                <li key={reason} className="flex items-center gap-2.5 text-sm text-body/85">
                  <Check size={14} className="shrink-0 text-teal" />
                  {reason}
                </li>
              ))}
            </ul>
            {!tested ? (
              <button
                onClick={onTest}
                data-testid="test-change-button"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-display text-sm font-bold tracking-wide text-white transition-colors duration-200 hover:bg-brandhover"
              >
                TEST THIS CHANGE
                <ArrowRight size={15} />
              </button>
            ) : (
              <div
                data-testid="verdict-changed"
                className={`mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest animate-fade-up ${newTone.chip}`}
              >
                Verdict changed → {newVerdict.label}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
