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
- Sticky blurred results nav, Cabinet Grotesk/Geist fonts.
- Verified via scripted browser runs: validation errors, demo fill, animation, results, evidence toggles, save-test, all three verdict paths.

## Design system update (2026-07-04)
- Moved from dark theme to the finalized LIGHT design system. No functional/logic/route/state changes; pure restyle of existing components via Tailwind token remap + targeted class edits.
- Brand: primary #014644 (CTAs, active states, progress), dark #012E2C (hero/strong headings, CTA hover), light #EAF7F6 (callouts: evidence note, active analysis stage).
- Neutrals: background #FFFFFF, primary text #111827, secondary text #6B7280, borders #E5E7EB, surfaces #F3F4F6.
- Semantic (status-only): success #15803D (DON'T KILL IT), warning #B45309 (NOT YET/moderate), danger #B91C1C (KILL IT/high risk), info #2563EB (evidence badges/notes).
- Removed grain overlay; light scrollbars; brand focus rings; verified desktop (1920), tablet (834), mobile (390) reflow and full flow post-restyle.

## Light/Dark theme system (2026-07-04)
- Centralized CSS-variable design tokens in `index.css` (`--bg`, `--surface`, `--surface-2`, `--line`, `--text-1/2/3`, `--brand-light`, `--brand-accent`, `--brand-strong`, `--success/--warning/--danger/--info`); `.dark` class on `<html>` switches all values. Tailwind custom colors reference these vars (rgb triplet + `<alpha-value>` pattern) — no hardcoded theme colors in components.
- Dark palette: bg #071918 / surface #0D2423 / elevated #12302F / text #F3F7F7·#9CAFAE·#6B8583 / border #1D4140 / brand-light surface #0A5C58; brand #014644 and hover #012E2C constant in both themes; semantics #22C55E/#F59E0B/#EF4444/#3B82F6 in both themes.
- `ThemeToggle.jsx` (Sun/Moon, aria-label, aria-pressed, keyboard-accessible) in Landing header, IdeaForm header, and ResultsNav. localStorage key `kmi-theme`; first visit follows `prefers-color-scheme`; inline FOUC-blocking script in `public/index.html` applies the class before render.
- `branddark` token is theme-aware (--brand-strong): #012E2C in light, #F3F7F7 in dark (heading contrast).
- Verified: system-preference first visit, toggle, reload persistence, keyboard toggling, full analysis flow in dark (landing, input, animation, results, risks, evidence, save, verdict), mobile dark (390px), zero console errors.

## Ollama Cloud + Gemma 4 31B integration (2026-07-04)
- Provider abstraction: `backend/ollama_provider.py` (OllamaCloudProvider — OpenAI-compatible `https://ollama.com/v1/chat/completions`, one call per analysis, 90s read timeout, no retries, never logs key/idea) ← `backend/analysis_service.py` (system prompt with brutal-honesty philosophy, JSON extraction incl. markdown-fence stripping, Pydantic validation, improvement sanitizer) ← `POST /api/analyze` in `server.py`. Pydantic schemas in `backend/analysis_models.py` (verdict enum DON'T KILL IT/NOT YET/KILL IT, 8 factors with score/riskLevel/explanation/reasoning/confidence, brutalReality, evidence, improvement, improvementAvailable, projectedViabilityScore).
- Env config: OLLAMA_API_KEY / OLLAMA_BASE_URL / OLLAMA_MODEL=gemma4:31b-cloud in backend/.env (server-side only).
- Frontend `src/data/analysisService.js`: posts to /api/analyze, maps + validates response into existing UI shape, falls back to the local deterministic engine on ANY failure (network, 503, invalid JSON, missing fields) with banner "Live AI analysis unavailable. Showing demonstration analysis instead." Live results carry the chip "AI Analysis — Research Engine Not Connected".
- Demo ideas + "See Example Analysis" intentionally stay on the deterministic engine (reliable demos); custom free-text ideas go to live AI.
- AnalysisProgress holds on "Consulting Gemma 4 31B Cloud…" until the model responds; mode-aware footer label.
- NEW per task QA: Verdict History (localStorage `kmi-history`, max 8, reopen past results, clear; section on landing) and Score Breakdown "Why this score?" expandable reasoning+confidence on every factor card.
- Motion layer (framer-motion + lenis): masked line-by-line hero reveal, staggered hero entrance, slow editorial marquee, numbered manifesto chapters with scroll-reveals, subtle parallax on the report preview, lenis momentum scrolling.
- Tested: service unit paths (malformed→fallback, fenced JSON→parsed, worse projection→improvement disabled, missing field→fallback), provider connection failure→503, e2e browser flow incl. fallback banner, factor panels, history persistence across reload, demo determinism, dark theme. KNOWN ISSUE: the user-provided OLLAMA_API_KEY returns 401 Unauthorized from ollama.com — live path verified end-to-end up to provider auth; needs a valid key.

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
