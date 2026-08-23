# KillMyIdea — PRD

## Original problem statement
Build a fully working, polished **frontend-only prototype** called **KillMyIdea** — "Try to kill your idea before the market does." The product analyzes a user's SaaS/project idea and gives a brutally honest feasibility assessment (startup analyst + market researcher + product strategist). Hard constraints: no backend, no database, no auth, no payments, no external APIs, no real AI calls — local deterministic/mock analysis only. Brand color `#014644`, dark Linear-style developer/founder-tool aesthetic, green/amber/red risk states.

## Architecture
- **Frontend only**: React 19 (JSX, no TS per environment), Tailwind CSS, shadcn/ui select, lucide-react icons. No router — single state-machine view flow in `src/App.js` (landing → input → analyzing → results).
- **Mock analysis engine**: `src/data/analysis.js` — deterministic; keyword-matched curated scenarios (todo app, AI code review, context packages for coding agents, compliance/audit, Figma-to-React) plus a seeded-hash generator for arbitrary ideas (mulberry32 PRNG, weighted factor scoring).
- **Demo data**: `src/data/demoIdeas.js` — 3 clickable demo ideas + landing "See Example Analysis" (Figma scenario, 42/100).
- **Components**: Landing, ReportPreview, IdeaForm, AnalysisProgress (10 stages, ~3.4s), ResultsNav (sticky), VerdictHero + ScoreRadial (SVG), FactorCard (8 factors), BrutalReality, EvidenceCard (expand/collapse), SaveIdea (animated score transition), FinalVerdict, SectionHeading, PrototypeBadge.
- **Design**: `/app/design_guidelines.json` — Cabinet Grotesk (display) + Geist/Geist Mono, bg #060909, surface #0C1212, border #1A2626, muted #809999, grain overlay.
- Backend (`/app/backend`) and MongoDB are unused by this app by design.

## User personas
- Indie hacker / founder validating a SaaS idea before committing engineering time.
- Developer with side-project ideas who wants a brutal second opinion.
- Demo presenter showing the product concept (Demo Ideas button enables zero-typing demos).

## Core requirements (static)
1. Landing: hero headline/sub, "Stress-Test My Idea" + "See Example Analysis" CTAs, report preview (viability, kill risk, competition, differentiation, market, brutal verdict), credibility line.
2. Idea input: idea textarea, target, monetization select, differentiation, optional problem; validation; 3 demo ideas via "Demo Ideas" button; prototype notice.
3. Analysis animation: 10 sequential stages, 2–4s, then auto-results.
4. Results: verdict hero (score, risk label, kill risk, confidence, quote, radial viz), 8-factor grid, Brutal Reality findings, expandable Evidence cards labeled "Demo evidence" + anti-hallucination note.
5. "Can We Save This Idea?": improvement only when material; animated score transition + verdict change; otherwise "No meaningful improvement found / Recommendation: Don't build it."
6. Final verdict: DON'T KILL IT / WORTH EXPLORING / KILL IT + analysis-supported next steps.
7. Sticky results nav (Overview | Market | Competition | Risks | Evidence | Can We Save It? | Verdict) with smooth scroll.
8. Deterministic scenarios: weak (24 KILL IT), moderate (67 WORTH EXPLORING, 67→78), strong (81 DON'T KILL IT).
9. Prototype badge; brutal, non-cheerleading copy throughout; responsive; desktop-first.

## Implemented (2026-07-04)
- Complete flow landing → input → animation → results → save-test → final verdict, all local state.
- All 5 curated scenarios + deterministic generator for free-text ideas.
- Form validation with brutal error copy; demo ideas panel; back navigation; start-new-analysis.
- Animated radial score, animated 42→64-style projected score transition, verdict recolor on change.
- Dark brand theme (#014644), Cabinet Grotesk/Geist fonts, grain overlay, sticky blurred results nav.
- Verified via scripted browser runs: validation errors, demo fill, animation, results, evidence toggles, save-test, all three verdict paths.

## Backlog / remaining
- P1: Replace mock engine with real AI + live market research backend (architecture is isolated in `src/data/analysis.js` for swap-in).
- P1: Shareable analysis report link (requires backend + persistence).
- P2: PDF/export of the verdict report.
- P2: Comparison of multiple analyzed ideas (history).
- P2: More curated scenarios and deeper per-industry evidence packs.

## Next tasks
1. Wire a real analysis endpoint behind the same `analyzeIdea` interface.
2. Add report export/sharing once persistence exists.
3. Mobile fine-tuning pass on results density.
