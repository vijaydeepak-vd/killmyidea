import json
import logging
import re
from typing import Optional

from analysis_models import IdeaAnalysis
from ollama_provider import OllamaCloudProvider

log = logging.getLogger(__name__)

# A future research engine plugs in here: it would gather market/competitor/
# pricing/customer evidence and pass it into this same prompt as evidence context.

SYSTEM_PROMPT = """You are the analytical engine behind KillMyIdea.

Your job is NOT to encourage founders. Your job is to challenge their idea and determine whether it deserves further investment of time, money, and engineering effort.

Rules:
- Be skeptical. Look for reasons the idea could fail. Do not manufacture positive conclusions.
- Do not provide generic startup advice.
- Do not assume market demand without evidence. Do not invent competitors, statistics, customer behavior, or citations.
- When evidence is unavailable, explicitly state "Insufficient evidence" and lower confidence instead of guessing.
- Distinguish clearly between user-provided information, known evidence, reasoned inference, and unknown information. Never present inference as fact.
- No live research engine is connected. Never claim you searched the market, the web, or competitors.

Verdicts (return exactly one):
- "DON'T KILL IT" when the available evidence indicates a sufficiently strong opportunity.
- "NOT YET" when there may be an opportunity but important assumptions remain unresolved.
- "KILL IT" when the available evidence indicates the idea is unlikely to justify significant investment in its current form. Do not avoid "KILL IT" because the user may dislike it.

Scoring (0-100): competition means "how difficult is it to compete successfully" — strong competition lowers the competition score and overall viability. Weak differentiation reduces viability. Base every score on the analysis, never at random.

Improvement engine: only set improvementAvailable=true when a realistic change could materially improve the viability score, and then projectedViabilityScore must be higher than overallViabilityScore. If no meaningful improvement exists, set improvementAvailable=false and explain why. Never invent an improvement to make the result more positive.

Confidence (High/Medium/Low) reflects confidence in the available evidence, NOT in your writing. Sparse user input means lower confidence.

Output exactly one JSON object matching the schema in the user message. No markdown fences, no commentary."""


def build_user_prompt(form: dict) -> str:
    return f"""Analyze this startup idea. Return ONLY one JSON object with exactly these fields:
{{
  "overallViabilityScore": 0-100,
  "killRiskScore": 0-100,
  "verdict": "DON'T KILL IT" | "NOT YET" | "KILL IT",
  "confidence": "High" | "Medium" | "Low",
  "summary": "2-3 sentence direct verdict rationale",
  "problemStrength": factor, "marketOpportunity": factor, "competition": factor,
  "differentiation": factor, "monetization": factor, "distribution": factor,
  "executionFeasibility": factor, "defensibility": factor,
  "brutalReality": [ 3-5 items, biggest risks first, each {{"severity": "critical"|"moderate"|"positive", "title": "...", "detail": "..."}} ],
  "risks": [ "short standalone risk statements" ],
  "evidence": [ 2-4 items, each {{"title": "...", "level": "HIGH"|"WEAK"|"FAVORABLE"|"UNPROVEN"|etc, "strength": "Strong"|"Moderate"|"Weak"|"Insufficient evidence", "points": ["..."]}} ],
  "improvement": {{"change": "...", "explanation": "...", "reasons": ["..."]}},
  "improvementAvailable": true|false,
  "projectedViabilityScore": 0-100 or null
}}
Each factor is {{"score": 0-100, "riskLevel": "Low"|"Moderate"|"High", "explanation": "1-2 direct sentences", "reasoning": ["2-4 short bullets separating user-provided info, known evidence, and inference"], "confidence": "High"|"Medium"|"Low"}}.

Be specific in brutalReality — never write "Competition may be a challenge." Explain exactly why the idea fails.
Remember: no live research engine is connected, so evidence must come from reasoning and widely known facts, clearly marked as inference where applicable.

USER-PROVIDED IDEA:
What they are building: {form['idea']}
Target customer: {form['target']}
Monetization model: {form['monetization']}
Claimed differentiation: {form['differentiation']}
Problem being solved: {form.get('problem') or 'Not provided'}"""


def _extract_json(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z]*\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("no JSON object in model output")
    return cleaned[start : end + 1]


def _sanitize(analysis: IdeaAnalysis) -> IdeaAnalysis:
    if analysis.improvementAvailable:
        projected = analysis.projectedViabilityScore
        if projected is None or projected <= analysis.overallViabilityScore:
            analysis.improvementAvailable = False
            analysis.projectedViabilityScore = None
            analysis.improvement.change = ""
            analysis.improvement.reasons = []
            if not analysis.improvement.explanation:
                analysis.improvement.explanation = (
                    "No meaningful improvement found. The core problem appears to be "
                    "market structure rather than positioning."
                )
    else:
        analysis.projectedViabilityScore = None
    return analysis


async def analyze_with_ai(form: dict) -> Optional[IdeaAnalysis]:
    provider = OllamaCloudProvider()
    content = await provider.complete(
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(form)},
        ]
    )
    if content is None:
        return None
    try:
        analysis = IdeaAnalysis.model_validate(json.loads(_extract_json(content)))
    except Exception as exc:
        log.warning("Model output failed validation: %s", type(exc).__name__)
        return None
    return _sanitize(analysis)
