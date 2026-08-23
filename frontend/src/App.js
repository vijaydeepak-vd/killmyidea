import { useCallback, useState } from "react";
import Landing from "@/components/Landing";
import IdeaForm from "@/components/IdeaForm";
import AnalysisProgress from "@/components/AnalysisProgress";
import Results from "@/components/Results";
import PrototypeBadge from "@/components/PrototypeBadge";
import { analyzeIdea } from "@/data/analysis";
import { EXAMPLE_FORM } from "@/data/demoIdeas";

export default function App() {
  const [view, setView] = useState("landing");
  const [result, setResult] = useState(null);

  const go = useCallback((v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  }, []);

  const startAnalysis = useCallback((form) => {
    setResult(analyzeIdea(form));
    setView("analyzing");
    window.scrollTo({ top: 0 });
  }, []);

  const runExample = useCallback(() => startAnalysis(EXAMPLE_FORM), [startAnalysis]);

  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      {view === "landing" && <Landing onStart={() => go("input")} onExample={runExample} />}
      {view === "input" && <IdeaForm onBack={() => go("landing")} onAnalyze={startAnalysis} />}
      {view === "analyzing" && result && (
        <AnalysisProgress idea={result.form.idea} onDone={() => go("results")} />
      )}
      {view === "results" && result && <Results result={result} onRestart={() => go("input")} />}
      <PrototypeBadge />
    </div>
  );
}
