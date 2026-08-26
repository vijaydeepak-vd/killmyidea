import { useState } from "react";
import { Info } from "lucide-react";
import ResultsNav from "@/components/ResultsNav";
import VerdictHero from "@/components/VerdictHero";
import FactorCard from "@/components/FactorCard";
import BrutalReality from "@/components/BrutalReality";
import EvidenceCard from "@/components/EvidenceCard";
import SaveIdea from "@/components/SaveIdea";
import FinalVerdict from "@/components/FinalVerdict";
import SectionHeading from "@/components/SectionHeading";
import { verdictFor, stepsFor } from "@/data/analysis";

const MARKET_KEYS = ["problem", "market", "monetization", "execution"];
const COMPETITION_KEYS = ["competition", "differentiation", "distribution", "defensibility"];

export default function Results({ result, onRestart }) {
  const [tested, setTested] = useState(false);

  const canSave = result.save.possible;
  const effectiveScore = tested && canSave ? result.save.projected : result.viability;
  const verdict = verdictFor(effectiveScore);
  const steps =
    tested && canSave ? result.save.steps || stepsFor(verdict.tone) : result.nextSteps;

  const marketFactors = result.factors.filter((f) => MARKET_KEYS.includes(f.key));
  const competitionFactors = result.factors.filter((f) => COMPETITION_KEYS.includes(f.key));

  return (
    <div className="min-h-screen" data-testid="results-page">
      <ResultsNav onRestart={onRestart} />
      <main className="mx-auto max-w-6xl px-5 pb-32 sm:px-8">
        {result.source === "fallback-demo" && (
          <div
            data-testid="fallback-banner"
            className="mt-6 rounded-lg border border-uncertain/40 bg-uncertain/10 px-4 py-3 text-sm text-body"
          >
            Live AI analysis unavailable. Showing demonstration analysis instead.
          </div>
        )}
        <VerdictHero result={result} projected={tested && canSave ? result.save.projected : null} />

        <section id="market" className="scroll-mt-20 py-14">
          <SectionHeading
            eyebrow="Factor analysis — 01"
            title="Market & Opportunity"
            sub="Where the pain, the budget, and the buildability live."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {marketFactors.map((f) => (
              <FactorCard key={f.key} factor={f} />
            ))}
          </div>
        </section>

        <section id="competition" className="scroll-mt-20 py-14">
          <SectionHeading
            eyebrow="Factor analysis — 02"
            title="Competition & Moat"
            sub="Why you probably lose."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {competitionFactors.map((f) => (
              <FactorCard key={f.key} factor={f} />
            ))}
          </div>
        </section>

        <section id="risks" className="scroll-mt-20 py-14">
          <BrutalReality findings={result.findings} />
        </section>

        <section id="evidence" className="scroll-mt-20 py-14">
          <SectionHeading
            eyebrow="Receipts"
            title="Evidence Behind The Verdict"
            sub="Every conclusion carries its evidence. Expand to inspect."
          />
          <div
            className="mb-6 flex gap-3 rounded-lg border border-brand/20 bg-brandlight p-4"
            data-testid="evidence-note"
          >
            <Info size={16} className="mt-0.5 shrink-0 text-info" />
            <p className="text-sm leading-relaxed text-mist">
              This prototype uses curated demonstration evidence. The production version would
              connect this layer to live market research.
            </p>
          </div>
          <div className="space-y-3">
            {result.evidence.map((item, i) => (
              <EvidenceCard key={item.title} item={item} index={i} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        <section id="save" className="scroll-mt-20 py-14">
          <SaveIdea result={result} tested={tested} onTest={() => setTested(true)} />
        </section>

        <section id="verdict" className="scroll-mt-20 py-14">
          <FinalVerdict
            score={effectiveScore}
            verdict={verdict}
            steps={steps}
            changed={tested && canSave}
            onRestart={onRestart}
          />
        </section>
      </main>
    </div>
  );
}
