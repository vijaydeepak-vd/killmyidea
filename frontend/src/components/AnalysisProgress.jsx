import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Skull } from "lucide-react";
import { eyebrowClass } from "@/components/tones";

const STAGES = [
  "Understanding the idea",
  "Identifying the target customer",
  "Mapping the competitive landscape",
  "Evaluating market opportunity",
  "Testing the problem strength",
  "Challenging differentiation",
  "Evaluating monetization",
  "Evaluating distribution",
  "Estimating execution complexity",
  "Searching for reasons this could fail",
];

export default function AnalysisProgress({ idea, mode = "demo", holding = false, onDone }) {
  const [idx, setIdx] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (idx >= STAGES.length) {
      const t = setTimeout(() => doneRef.current(), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 300);
    return () => clearTimeout(t);
  }, [idx]);

  const progress = Math.min(100, (idx / STAGES.length) * 100);

  return (
    <div className="min-h-screen" data-testid="analysis-progress">
      <div className="mx-auto max-w-xl px-5 pb-24 pt-20 sm:pt-28">
        <div className="mb-10 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
            <Skull size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-body">
            KillMyIdea
          </span>
        </div>

        <p className={eyebrowClass}>Stress-testing your idea</p>
        <p className="mt-3 line-clamp-2 border-l-2 border-brand pl-4 text-sm italic leading-relaxed text-mist">
          “{idea}”
        </p>

        <div className="mt-10 space-y-1" data-testid="analysis-stages">
          {STAGES.map((stage, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <div
                key={stage}
                data-testid={`analysis-stage-${i}`}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-200 ${
                  active ? "bg-brandlight text-body" : done ? "text-body/80" : "text-mist/50"
                }`}
              >
                {done ? (
                  <Check size={15} className="shrink-0 text-teal" />
                ) : active ? (
                  <Loader2 size={15} className="shrink-0 animate-spin text-teal" />
                ) : (
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-line" />
                )}
                <span className="font-mono text-sm">{stage}</span>
              </div>
            );
          })}
        </div>

        {holding && (
          <div
            className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-body"
            data-testid="analysis-holding"
          >
            <Loader2 size={15} className="shrink-0 animate-spin text-teal" />
            <span className="font-mono text-sm">Consulting Gemma 4 31B Cloud…</span>
          </div>
        )}

        <div className="mt-8 h-1 overflow-hidden rounded-full bg-raise">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${progress}%` }}
            data-testid="analysis-progress-bar"
          />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-mist/60">
          {mode === "live"
            ? "AI analysis — research engine not connected"
            : "Simulated analysis — no live research"}
        </p>
      </div>
    </div>
  );
}
