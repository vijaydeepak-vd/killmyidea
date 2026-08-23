import { ArrowRight, Skull, Crosshair, FileSearch, ShieldAlert } from "lucide-react";
import ReportPreview from "@/components/ReportPreview";
import { eyebrowClass, primaryBtnClass, secondaryBtnClass } from "@/components/tones";

const STEPS = [
  {
    n: "01",
    icon: Crosshair,
    title: "Describe the target",
    text: "Tell KillMyIdea what you are building, who it is for, and why you think it wins.",
  },
  {
    n: "02",
    icon: FileSearch,
    title: "We try to kill it",
    text: "Eight factors. Market, competition, monetization, distribution, defensibility. No mercy.",
  },
  {
    n: "03",
    icon: ShieldAlert,
    title: "You get the verdict",
    text: "Kill it, fix it, or build it — with the evidence to back the call.",
  },
];

export default function Landing({ onStart, onExample }) {
  return (
    <div className="min-h-screen" data-testid="landing-page">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5" data-testid="brand-mark">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
              <Skull size={17} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              KillMyIdea
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist sm:inline-block">
              Prototype
            </span>
            <button
              onClick={onStart}
              data-testid="header-cta"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-brandhover"
            >
              Stress-Test My Idea
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-24 text-center sm:px-8 sm:pt-32">
          <p className={eyebrowClass}>Brutal feasibility analysis</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Try to kill your idea <span className="text-teal">before the market does.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
            KillMyIdea stress-tests your SaaS or project idea against the market, competition,
            differentiation, monetization, distribution, and execution risk.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={onStart} data-testid="stress-test-cta" className={primaryBtnClass}>
              Stress-Test My Idea
              <ArrowRight size={16} />
            </button>
            <button onClick={onExample} data-testid="example-analysis-cta" className={secondaryBtnClass}>
              See Example Analysis
            </button>
          </div>
          <p className="mt-10 font-mono text-xs uppercase tracking-widest text-mist">
            No hype. No sugarcoating. Evidence over assumptions.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-24 animate-fade-up sm:px-8">
          <ReportPreview />
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} data-testid={`how-step-${step.n}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-teal">{step.n}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-raise text-mist">
                    <step.icon size={16} />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
          <span className="font-mono text-xs uppercase tracking-widest text-mist">
            KillMyIdea — Prototype
          </span>
          <span className="text-xs text-mist">
            Analysis is simulated for demonstration. No live market research is performed.
          </span>
        </div>
      </footer>
    </div>
  );
}
