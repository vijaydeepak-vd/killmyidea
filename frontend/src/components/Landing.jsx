import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Skull, Crosshair, FileSearch, ShieldAlert } from "lucide-react";
import ReportPreview from "@/components/ReportPreview";
import ThemeToggle from "@/components/ThemeToggle";
import Reveal from "@/components/Reveal";
import VerdictHistory from "@/components/VerdictHistory";
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

const HERO_LINES = [
  { text: "Try to kill your idea", accent: false },
  { text: "before the market does.", accent: true },
];

const MARQUEE =
  "No hype — No sugarcoating — Evidence over assumptions — Brutal feasibility analysis — Kill it or build it — ";

export default function Landing({ onStart, onExample, history = [], onOpenHistory, onClearHistory }) {
  const previewRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "end start"],
  });
  const previewY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <div className="min-h-screen" data-testid="landing-page">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5" data-testid="brand-mark">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
              <Skull size={17} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-body">
              KillMyIdea
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-mist sm:inline-block">
              Prototype
            </span>
            <ThemeToggle />
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
          <motion.p
            className={eyebrowClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Brutal feasibility analysis
          </motion.p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-branddark sm:text-5xl lg:text-6xl">
            {HERO_LINES.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${line.accent ? "text-teal" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            KillMyIdea stress-tests your SaaS or project idea against the market, competition,
            differentiation, monetization, distribution, and execution risk.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span whileTap={{ scale: 0.97 }}>
              <button onClick={onStart} data-testid="stress-test-cta" className={primaryBtnClass}>
                Stress-Test My Idea
                <ArrowRight size={16} />
              </button>
            </motion.span>
            <motion.span whileTap={{ scale: 0.97 }}>
              <button onClick={onExample} data-testid="example-analysis-cta" className={secondaryBtnClass}>
                See Example Analysis
              </button>
            </motion.span>
          </motion.div>
          <motion.p
            className="mt-10 font-mono text-xs uppercase tracking-widest text-mist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            No hype. No sugarcoating. Evidence over assumptions.
          </motion.p>
        </section>

        <div className="overflow-hidden border-y border-line py-3" aria-hidden="true">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-faint"
              >
                {MARQUEE.repeat(4)}
              </span>
            ))}
          </div>
        </div>

        <section ref={previewRef} className="mx-auto max-w-4xl px-5 pb-24 pt-16 sm:px-8">
          <motion.div style={{ y: previewY }}>
            <ReportPreview />
          </motion.div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <Reveal>
              <p className={eyebrowClass}>The method</p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-body sm:text-3xl">
                Three chapters. One verdict.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-12 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.12}>
                  <div data-testid={`how-step-${step.n}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-4xl font-extrabold tracking-tight text-teal">
                        {step.n}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-raise text-mist">
                        <step.icon size={16} />
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-body">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <VerdictHistory entries={history} onSelect={onOpenHistory} onClear={onClearHistory} />
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
