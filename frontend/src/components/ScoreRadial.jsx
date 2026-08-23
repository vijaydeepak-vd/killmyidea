import { useEffect, useState } from "react";
import { TONE } from "@/components/tones";

export default function ScoreRadial({ score, tone, size = 176, testid = "score-radial" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1000);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(score * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = 76;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} data-testid={testid}>
      <svg width={size} height={size} viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#16211F" strokeWidth="10" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={TONE[tone].stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (display / 100) * c}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 0.12s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-5xl font-semibold text-white" data-testid={`${testid}-value`}>
          {display}
        </span>
        <span className="mt-1 font-mono text-xs text-mist">/ 100</span>
      </div>
    </div>
  );
}
