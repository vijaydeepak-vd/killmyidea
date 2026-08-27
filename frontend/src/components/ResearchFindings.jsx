import { ExternalLink } from "lucide-react";

const CONF_CLASS = {
  HIGH: "text-viable border-viable/40 bg-viable/10",
  MEDIUM: "text-uncertain border-uncertain/40 bg-uncertain/10",
  LOW: "text-mist border-line bg-raise",
  UNKNOWN: "text-mist border-line bg-raise",
};

const CATEGORY_LABEL = {
  competitors: "Competitor",
  pricing: "Pricing",
  market: "Market signal",
  community: "Community signal",
};

export default function ResearchFindings({ research, solutionCoverage }) {
  if (!research || research.status === "unavailable") return null;
  const { counts, confidence, findings } = research;

  return (
    <div className="mb-8" data-testid="research-block">
      <div className="rounded-lg border border-line bg-surface p-5" data-testid="research-summary">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
              research.status === "success"
                ? "border-viable/40 bg-viable/10 text-viable"
                : "border-uncertain/40 bg-uncertain/10 text-uncertain"
            }`}
          >
            {research.status === "success" ? "Research completed" : "Partial research"}
          </span>
          <span className="font-mono text-xs text-mist">Sources analyzed: {counts.sourcesAnalyzed}</span>
          <span className="font-mono text-xs text-mist">Competitors found: {counts.competitorsFound}</span>
          <span className="font-mono text-xs text-mist">Pricing sources: {counts.pricingSources}</span>
          <span className="font-mono text-xs text-mist">Market signals: {counts.marketSignals}</span>
          <span className="font-mono text-xs font-semibold text-body">
            Research confidence: {confidence}
          </span>
          {research.gatheredAt && (
            <span className="font-mono text-xs text-mist" data-testid="research-gathered-at">
              Research gathered: {new Date(research.gatheredAt).toLocaleString()}
            </span>
          )}
          {solutionCoverage && (
            <span className="font-mono text-xs text-mist">Existing solutions: {solutionCoverage}</span>
          )}
        </div>
      </div>

      <p className="mb-3 mt-6 font-mono text-[10px] uppercase tracking-widest text-mist">
        Research evidence
      </p>
      <div className="space-y-3">
        {findings.map((f, i) => (
          <div
            key={i}
            className="rounded-lg border border-line bg-surface p-5"
            data-testid={`research-finding-${i}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-mist">
                {CATEGORY_LABEL[f.category] || f.category}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${CONF_CLASS[f.confidence] || CONF_CLASS.UNKNOWN}`}
              >
                {f.confidence}
              </span>
            </div>
            <p className="mt-3 font-display text-base font-semibold text-body">{f.claim}</p>
            {f.evidence && (
              <p className="mt-1.5 text-sm leading-relaxed text-mist">{f.evidence}</p>
            )}
            <a
              href={f.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`research-source-${i}`}
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-info transition-colors duration-200 hover:underline"
            >
              {f.source}
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
