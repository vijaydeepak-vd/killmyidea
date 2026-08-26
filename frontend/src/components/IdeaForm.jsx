import { useState } from "react";
import { ArrowLeft, ArrowRight, Skull, Lightbulb } from "lucide-react";
import { DEMO_IDEAS } from "@/data/demoIdeas";
import { eyebrowClass } from "@/components/tones";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MODELS = ["Subscription", "One-time purchase", "Usage-based", "Marketplace", "Freemium", "Other"];

const EMPTY = { idea: "", target: "", monetization: "Subscription", differentiation: "", problem: "" };

const fieldClass =
  "w-full rounded-md border border-line bg-surface px-4 py-3 text-sm text-body placeholder:text-faint transition-colors duration-200 focus:border-brand focus:outline-none";

const labelClass = "mb-2 block font-mono text-[11px] uppercase tracking-widest text-mist";

export default function IdeaForm({ onBack, onAnalyze }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [showDemos, setShowDemos] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value, demoId: undefined }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = () => {
    const errs = {};
    if (form.idea.trim().length < 10)
      errs.idea = "Describe the idea in at least a sentence. Vague input gets a vague execution.";
    if (form.target.trim().length < 2) errs.target = "Who is this for? \"Everyone\" is not an answer.";
    if (form.differentiation.trim().length < 5)
      errs.differentiation = "If you cannot name a difference, the market will not either.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) onAnalyze(form);
  };

  return (
    <div className="min-h-screen" data-testid="idea-input-page">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={onBack}
            data-testid="back-to-landing"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mist transition-colors duration-200 hover:text-body"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
              <Skull size={14} className="text-white" />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-body">
              KillMyIdea
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pb-32 pt-14 sm:px-8">
        <p className={eyebrowClass}>Step 01 — Describe the target</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-branddark sm:text-4xl">
          What are we trying to kill?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-mist">
          Give KillMyIdea enough detail to attack the idea properly.
        </p>

        <div className="mt-8">
          <button
            onClick={() => setShowDemos((s) => !s)}
            data-testid="demo-ideas-toggle"
            className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-mist transition-colors duration-200 hover:border-brand/40 hover:text-body"
          >
            <Lightbulb size={14} />
            Demo Ideas
          </button>
          {showDemos && (
            <div className="mt-3 grid gap-3 animate-fade-up" data-testid="demo-ideas-panel">
              {DEMO_IDEAS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setForm({ ...demo.form, demoId: demo.id });
                    setErrors({});
                    setShowDemos(false);
                  }}
                  data-testid={`demo-idea-${demo.id}`}
                  className="rounded-lg border border-line bg-surface p-4 text-left transition-colors duration-200 hover:border-brand/40 hover:bg-raise"
                >
                  <p className="font-display text-sm font-semibold text-body">{demo.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{demo.form.idea}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 space-y-8">
          <div>
            <label htmlFor="idea" className={labelClass}>
              What are you building? <span className="text-risk">*</span>
            </label>
            <textarea
              id="idea"
              rows={4}
              value={form.idea}
              onChange={(e) => update("idea", e.target.value)}
              placeholder="Example: A SaaS that automatically converts Figma designs into production-ready React components."
              data-testid="idea-input"
              className={fieldClass}
            />
            {errors.idea && (
              <p className="mt-2 font-mono text-xs text-risk" data-testid="idea-error">
                {errors.idea}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="target" className={labelClass}>
              Who is it for? <span className="text-risk">*</span>
            </label>
            <input
              id="target"
              type="text"
              value={form.target}
              onChange={(e) => update("target", e.target.value)}
              placeholder="Frontend developers, engineering teams, startups…"
              data-testid="target-input"
              className={fieldClass}
            />
            {errors.target && (
              <p className="mt-2 font-mono text-xs text-risk" data-testid="target-error">
                {errors.target}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>How will it make money?</label>
            <Select value={form.monetization} onValueChange={(v) => update("monetization", v)}>
              <SelectTrigger
                data-testid="monetization-select"
                className="w-full border-line bg-surface px-4 py-3 text-sm text-body focus:ring-0 focus:ring-offset-0"
              >
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="border-line bg-surface">
                {MODELS.map((m) => (
                  <SelectItem
                    key={m}
                    value={m}
                    data-testid={`monetization-option-${m.toLowerCase().replace(/[^a-z]/g, "-")}`}
                    className="text-sm text-body/85 focus:bg-raise focus:text-body"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="differentiation" className={labelClass}>
              What makes it different? <span className="text-risk">*</span>
            </label>
            <textarea
              id="differentiation"
              rows={3}
              value={form.differentiation}
              onChange={(e) => update("differentiation", e.target.value)}
              placeholder="Why would someone switch from what they already use?"
              data-testid="differentiation-input"
              className={fieldClass}
            />
            {errors.differentiation && (
              <p className="mt-2 font-mono text-xs text-risk" data-testid="differentiation-error">
                {errors.differentiation}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="problem" className={labelClass}>
              Optional: What problem are you solving?
            </label>
            <textarea
              id="problem"
              rows={3}
              value={form.problem}
              onChange={(e) => update("problem", e.target.value)}
              placeholder="The painful, expensive, recurring thing your customer puts up with today."
              data-testid="problem-input"
              className={fieldClass}
            />
          </div>

          <button
            onClick={submit}
            data-testid="kill-idea-submit-button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-brand px-6 py-4 font-display text-base font-bold tracking-wide text-white transition-colors duration-200 hover:bg-brandhover"
          >
            KILL MY IDEA
            <ArrowRight size={18} />
          </button>

          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-mist">
            Prototype mode — analysis is simulated for demonstration purposes.
          </p>
        </div>
      </main>
    </div>
  );
}
