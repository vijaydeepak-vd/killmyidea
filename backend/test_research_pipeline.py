import asyncio
import sys

sys.path.insert(0, "/app/backend")

from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

from analysis_service import analyze_with_ai, build_user_prompt
from research_engine import ResearchEngine

FORM = {
    "idea": "An AI tool that creates task-specific context packages for coding agents from GitHub issues.",
    "target": "Engineering teams using AI coding agents",
    "monetization": "Subscription",
    "differentiation": "Turns GitHub issues into ready-to-use context packages for coding agents.",
    "problem": "Coding agents fail on large repos because they lack the right context.",
}

STUB = {
    "competitors": [
        {"title": "ContextKit — context packages for coding agents", "url": "https://example.com/contextkit", "snippet": "ContextKit builds repo-aware context packages.", "score": 0.91},
        {"title": "AgentContext product page", "url": "https://example.com/agentcontext", "snippet": "AgentContext indexes repos for agents.", "score": 0.83},
    ],
    "pricing": [
        {"title": "ContextKit pricing", "url": "https://example.com/pricing", "snippet": "Example Domain pricing page.", "score": 0.88},
    ],
    "market": [
        {"title": "The rise of agentic coding workflows", "url": "https://example.com/agentic", "snippet": "Teams increasingly adopt coding agents.", "score": 0.77},
    ],
    "community": [
        {"title": "Why coding agents fail on big repos — discussion", "url": "https://example.com/discussion", "snippet": "Developers complain about missing context.", "score": 0.72},
    ],
}


class StubProvider:
    configured = True

    async def search(self, query, max_results=5):
        for key, items in STUB.items():
            if key in query or (key == "market" and "market" in query):
                return items
        if "pricing" in query:
            return STUB["pricing"]
        if "competitors" in query:
            return STUB["competitors"]
        if "market" in query:
            return STUB["market"]
        return STUB["community"]


async def main():
    engine = ResearchEngine(provider=StubProvider())
    pack = await engine.research(FORM)
    print("PACK STATUS:", pack.status, "| CONFIDENCE:", pack.confidence)
    print("COUNTS:", pack.counts.model_dump())
    print("ALL FINDINGS HAVE URLS:", all(f.sourceUrl.startswith("https://") for f in pack.findings))
    print("FINDING CONFS:", [(f.category, f.confidence) for f in pack.findings])

    prompt = build_user_prompt(FORM, pack)
    print("PROMPT HAS EVIDENCE PACK:", "<evidence_pack>" in prompt and "example.com" in prompt)

    prompt_none = build_user_prompt(FORM, None)
    print("NO-PACK PROMPT SAYS UNAVAILABLE:", "research engine unavailable" in prompt_none)

    analysis = await analyze_with_ai(FORM, pack)
    if analysis is None:
        print("LIVE GEMMA WITH PACK: FAILED (fell back)")
    else:
        print("LIVE GEMMA WITH PACK: OK | verdict:", analysis.verdict, "| viability:", analysis.overallViabilityScore)
        print("SOLUTION COVERAGE:", analysis.solutionCoverage)
        urls = [i.sourceUrl for i in analysis.brutalReality if i.sourceUrl] + [
            e.sourceUrl for e in analysis.evidence if e.sourceUrl
        ]
        valid = {f.sourceUrl for f in pack.findings}
        print("SOURCE URLS ALL FROM PACK:", all(u in valid for u in urls), "| count:", len(urls))


asyncio.run(main())
