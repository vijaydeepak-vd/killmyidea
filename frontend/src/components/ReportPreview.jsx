const ROWS = [
  { label: "Kill Risk", value: 78, color: "bg-risk" },
  { label: "Competition", value: 28, color: "bg-risk" },
  { label: "Differentiation", value: 34, color: "bg-uncertain" },
  { label: "Market Opportunity", value: 61, color: "bg-uncertain" },
];

export default function ReportPreview() {
  return (
    <div
      data-testid="report-preview"
      className="overflow-hidden rounded-xl border border-line bg-surface text-left"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-mist">
          Analysis report · Figma-to-React SaaS
        </span>
        <span className="rounded-full border border-uncertain/40 bg-uncertain/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-uncertain">
          Demo
        </span>
      </div>
      <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-mist">
            Viability score
          </p>
          <p className="mt-1 font-mono text-5xl font-semibold text-body">
            42<span className="text-lg text-mist">/100</span>
          </p>
          <span className="mt-3 inline-block rounded-full border border-risk/40 bg-risk/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-risk">
            High risk
          </span>
        </div>
        <div className="space-y-4">
          {ROWS.map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-body/85">{row.label}</span>
                <span className="font-mono text-xs text-mist">{row.value}/100</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-raise">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line px-6 py-5 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-mist">Brutal verdict</p>
        <p className="mt-2 text-sm leading-relaxed text-body/85">
          “The problem appears real, but the current positioning faces strong competition and does not
          provide enough differentiation to justify switching from existing solutions.”
        </p>
      </div>
    </div>
  );
}
