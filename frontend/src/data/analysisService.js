import { analyzeIdea, verdictFor, stepsFor } from "@/data/analysis";

const API = process.env.REACT_APP_BACKEND_URL;

const FACTOR_META = [
  ["problemStrength", "problem", "Problem Strength"],
  ["marketOpportunity", "market", "Market Opportunity"],
  ["competition", "competition", "Competition"],
  ["differentiation", "differentiation", "Differentiation"],
  ["monetization", "monetization", "Monetization"],
  ["distribution", "distribution", "Distribution"],
  ["executionFeasibility", "execution", "Execution Feasibility"],
  ["defensibility", "defensibility", "Defensibility"],
];

const CONFIDENCE_PCT = { high: 85, medium: 70, low: 50 };
const SEVERITY_TONE = { critical: "red", moderate: "amber", positive: "green" };

const clampScore = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
};

const asStrings = (v) =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim()) : [];

const levelTone = (level) => {
  const l = String(level || "").toLowerCase();
  if (/(favorable|strong|real)/.test(l)) return "green";
  if (/(high|weak|blocked|low|critical|at risk|unproven|insufficient)/.test(l)) return "red";
  return "amber";
};

// Maps the validated AI response into the exact shape the results UI renders.
// Throws on anything invalid — the caller falls back to the demo engine.
function mapAiAnalysis(ai, form, label) {
  if (!ai || typeof ai !== "object") throw new Error("empty analysis");
  const viability = clampScore(ai.overallViabilityScore);
  if (viability === null) throw new Error("invalid overallViabilityScore");

  const factors = FACTOR_META.map(([aiKey, key, name]) => {
    const f = ai[aiKey];
    const score = clampScore(f && f.score);
    if (score === null || !f.explanation) throw new Error(`invalid factor ${aiKey}`);
    return {
      key,
      name,
      score,
      text: String(f.explanation),
      riskLevel: `${String(f.riskLevel || "Moderate").toUpperCase()} RISK`,
      reasoning: asStrings(f.reasoning),
      confidence: ["High", "Medium", "Low"].includes(f.confidence) ? f.confidence : "Medium",
    };
  });

  const findings = (Array.isArray(ai.brutalReality) ? ai.brutalReality : [])
    .slice(0, 5)
    .map((b) => ({
      tone: SEVERITY_TONE[b.severity] || "amber",
      title: String(b.title || "Risk"),
      body: String(b.detail || ""),
    }))
    .filter((f) => f.body);
  if (findings.length < 3) throw new Error("insufficient brutalReality");

  const evidence = (Array.isArray(ai.evidence) ? ai.evidence : []).slice(0, 5).map((e) => ({
    title: String(e.title || "Evidence"),
    level: String(e.level || "UNPROVEN").toUpperCase(),
    levelTone: levelTone(e.level),
    strength: String(e.strength || "Insufficient evidence"),
    points: asStrings(e.points),
  }));

  const projected = clampScore(ai.projectedViabilityScore);
  const improvement = ai.improvement || {};
  const save =
    ai.improvementAvailable && improvement.change && projected !== null && projected > viability
      ? {
          possible: true,
          change: String(improvement.change),
          paragraph: improvement.explanation ? String(improvement.explanation) : "",
          projected,
          reasons: asStrings(improvement.reasons).slice(0, 6),
          steps: stepsFor(verdictFor(projected).tone),
        }
      : {
          possible: false,
          explanation:
            (improvement.explanation && String(improvement.explanation)) ||
            "No meaningful improvement found. The core problem appears to be market structure rather than positioning. Changing the target customer or pricing model is unlikely to materially improve the opportunity.",
          positive: verdictFor(viability).tone === "green",
        };

  return {
    viability,
    killRisk: clampScore(ai.killRiskScore) ?? Math.min(95, 100 - viability + 5),
    confidence: CONFIDENCE_PCT[String(ai.confidence || "").toLowerCase()] ?? 70,
    quote: String(ai.summary || "Analysis complete."),
    factors,
    findings,
    evidence,
    save,
    nextSteps: stepsFor(verdictFor(viability).tone),
    form: {
      idea: form.idea,
      target: form.target,
      monetization: form.monetization,
      differentiation: form.differentiation,
      problem: form.problem || "",
    },
    analyzedAt: new Date().toISOString(),
    source: "ollama-cloud",
    sourceLabel: label || "AI Analysis — Research Engine Not Connected",
  };
}

export async function analyzeIdeaLive(form) {
  const payload = {
    idea: form.idea,
    target: form.target,
    monetization: form.monetization,
    differentiation: form.differentiation,
    problem: form.problem || "",
  };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 110000);
    const res = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`provider_${res.status}`);
    const data = await res.json();
    return mapAiAnalysis(data.analysis, form, data.label);
  } catch {
    return { ...analyzeIdea(form), source: "fallback-demo" };
  }
}
