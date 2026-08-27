import asyncio
import json
import sys

sys.path.insert(0, "/app/backend")

from analysis_service import analyze_with_ai
from ollama_provider import OllamaCloudProvider

FACTOR = {"score": 50, "riskLevel": "Moderate", "explanation": "x", "reasoning": ["a", "b"], "confidence": "Medium"}

VALID = {
    "overallViabilityScore": 55,
    "killRiskScore": 60,
    "verdict": "NOT YET",
    "confidence": "Medium",
    "summary": "Test summary.",
    "problemStrength": FACTOR, "marketOpportunity": FACTOR, "competition": FACTOR,
    "differentiation": FACTOR, "monetization": FACTOR, "distribution": FACTOR,
    "executionFeasibility": FACTOR, "defensibility": FACTOR,
    "brutalReality": [
        {"severity": "critical", "title": "A", "detail": "d"},
        {"severity": "moderate", "title": "B", "detail": "d"},
        {"severity": "positive", "title": "C", "detail": "d"},
    ],
    "risks": ["r1"],
    "evidence": [{"title": "E", "level": "UNPROVEN", "strength": "Insufficient evidence", "points": ["p"]}],
    "improvement": {"change": "Narrow target", "explanation": "why", "reasons": ["r"]},
    "improvementAvailable": True,
    "projectedViabilityScore": 70,
}

FORM = {"idea": "A test idea for validation", "target": "devs", "monetization": "Subscription", "differentiation": "testing", "problem": "test"}


async def main():
    failures = 0

    async def bad(self, messages):
        return "Sure! Here is my analysis: definitely not json"

    OllamaCloudProvider.complete = bad
    r = await analyze_with_ai(FORM)
    ok = r is None
    failures += 0 if ok else 1
    print("PASS" if ok else "FAIL", "- malformed model output falls back")

    async def good(self, messages):
        return "```json\n" + json.dumps(VALID) + "\n```"

    OllamaCloudProvider.complete = good
    r = await analyze_with_ai(FORM)
    ok = r is not None and r.overallViabilityScore == 55 and r.improvementAvailable
    failures += 0 if ok else 1
    print("PASS" if ok else "FAIL", "- fenced valid JSON parses and validates")

    async def bad_projection(self, messages):
        v = dict(VALID)
        v["projectedViabilityScore"] = 40
        return json.dumps(v)

    OllamaCloudProvider.complete = bad_projection
    r = await analyze_with_ai(FORM)
    ok = r is not None and not r.improvementAvailable and r.projectedViabilityScore is None
    failures += 0 if ok else 1
    print("PASS" if ok else "FAIL", "- worse projection disables improvement")

    async def missing(self, messages):
        v = dict(VALID)
        del v["competition"]
        return json.dumps(v)

    OllamaCloudProvider.complete = missing
    r = await analyze_with_ai(FORM)
    ok = r is None
    failures += 0 if ok else 1
    print("PASS" if ok else "FAIL", "- missing factor field falls back")

    async def bad_url(self, messages):
        v = json.loads(json.dumps(VALID))
        v["brutalReality"][0]["sourceUrl"] = "https://invented.example/fake"
        v["solutionCoverage"] = "Commoditized"
        return json.dumps(v)

    OllamaCloudProvider.complete = bad_url
    r = await analyze_with_ai(FORM)
    ok = r is not None and r.brutalReality[0].sourceUrl is None and r.solutionCoverage is None
    failures += 0 if ok else 1
    print("PASS" if ok else "FAIL", "- URLs outside evidence pack are stripped; coverage nulled without pack")

    print("RESULT:", "ALL PASS" if failures == 0 else f"{failures} FAILURES")
    sys.exit(1 if failures else 0)


asyncio.run(main())
