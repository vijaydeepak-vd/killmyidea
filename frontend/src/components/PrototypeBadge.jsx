export default function PrototypeBadge() {
  return (
    <div
      data-testid="prototype-badge"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-uncertain animate-pulse-dot" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-mist">
        Prototype · Simulated analysis
      </span>
    </div>
  );
}
