import { RotateCcw } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { TONE, eyebrowClass, primaryBtnClass } from "@/components/tones";

export default function FinalVerdict({ score, verdict, steps, changed, onRestart }) {
  const tone = TONE[verdict.tone];

  return (
    <div data-testid="final-verdict">
      <SectionHeading eyebrow="The call" title="Final Verdict" />
      <div className={`rounded-xl border ${tone.border} bg-surface p-6 sm:p-12`}>
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${tone.dot}`} />
          <span
            className={`font-display text-2xl font-extrabold tracking-tight sm:text-3xl ${tone.text}`}
            data-testid="final-verdict-label"
          >
            {verdict.label}
          </span>
        </div>
        <p className="mt-5 font-mono text-lg text-white" data-testid="final-verdict-score">
          Viability: {score}/100
        </p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
          {verdict.text}
        </p>
        {changed && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-teal">
            Verdict updated after testing the recommended change
          </p>
        )}

        <div className="mt-10">
          <p className={eyebrowClass}>What should you do next?</p>
          <ol className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4 text-sm text-white/85 sm:text-base">
                <span className="shrink-0 font-mono text-mist">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <button onClick={onRestart} data-testid="start-new-analysis" className={primaryBtnClass}>
            <RotateCcw size={15} />
            START NEW ANALYSIS
          </button>
        </div>
      </div>
    </div>
  );
}
