import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import Landing from "@/components/Landing";
import IdeaForm from "@/components/IdeaForm";
import AnalysisProgress from "@/components/AnalysisProgress";
import Results from "@/components/Results";
import PrototypeBadge from "@/components/PrototypeBadge";
import { analyzeIdea, verdictFor } from "@/data/analysis";
import { analyzeIdeaLive } from "@/data/analysisService";
import { EXAMPLE_FORM } from "@/data/demoIdeas";
import { loadHistory, saveToHistory, clearHistory } from "@/data/history";

export default function App() {
  const [view, setView] = useState("landing");
  const [result, setResult] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [mode, setMode] = useState("demo");
  const [animDone, setAnimDone] = useState(false);
  const [history, setHistory] = useState(() => loadHistory());

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const go = useCallback((v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (view === "analyzing" && animDone && result) go("results");
  }, [view, animDone, result, go]);

  const startAnalysis = useCallback((form) => {
    const isDemo = Boolean(form.demoId);
    setActiveForm(form);
    setMode(isDemo ? "demo" : "live");
    setAnimDone(false);
    setResult(null);
    setView("analyzing");
    window.scrollTo({ top: 0, behavior: "instant" });
    const run = isDemo
      ? Promise.resolve({ ...analyzeIdea(form), source: "demo", sourceLabel: "Demo analysis" })
      : analyzeIdeaLive(form);
    run.then((res) => {
      setResult(res);
      const verdict = verdictFor(res.viability);
      setHistory(
        saveToHistory({
          id: String(Date.now()),
          idea: res.form.idea,
          score: res.viability,
          verdictLabel: verdict.label,
          tone: verdict.tone,
          source: res.source,
          at: res.analyzedAt,
          result: res,
        }),
      );
    });
  }, []);

  const runExample = useCallback(
    () => startAnalysis({ ...EXAMPLE_FORM, demoId: "figma-react" }),
    [startAnalysis],
  );

  const openHistoryEntry = useCallback(
    (entry) => {
      setResult(entry.result);
      go("results");
    },
    [go],
  );

  return (
    <div className="min-h-screen bg-ink font-sans text-body">
      {view === "landing" && (
        <Landing
          onStart={() => go("input")}
          onExample={runExample}
          history={history}
          onOpenHistory={openHistoryEntry}
          onClearHistory={() => setHistory(clearHistory())}
        />
      )}
      {view === "input" && <IdeaForm onBack={() => go("landing")} onAnalyze={startAnalysis} />}
      {view === "analyzing" && (
        <AnalysisProgress
          idea={activeForm?.idea || ""}
          mode={mode}
          holding={animDone && !result}
          onDone={() => setAnimDone(true)}
        />
      )}
      {view === "results" && result && <Results result={result} onRestart={() => go("input")} />}
      <PrototypeBadge />
    </div>
  );
}
