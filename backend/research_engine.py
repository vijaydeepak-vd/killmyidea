import asyncio
import hashlib
import logging
import re
from typing import List, Literal, Optional
from urllib.parse import urlparse

import httpx
from pydantic import BaseModel, Field

from research_provider import TavilySearchProvider, valid_http_url

log = logging.getLogger(__name__)

CATEGORIES = ["competitors", "pricing", "market", "community"]


class Finding(BaseModel):
    category: str
    claim: str
    source: str
    sourceUrl: str
    evidence: str
    confidence: Literal["HIGH", "MEDIUM", "LOW", "UNKNOWN"]


class ResearchCounts(BaseModel):
    sourcesAnalyzed: int = 0
    competitorsFound: int = 0
    pricingSources: int = 0
    marketSignals: int = 0


class EvidencePack(BaseModel):
    status: Literal["success", "partial", "unavailable"]
    confidence: Literal["HIGH", "MEDIUM", "LOW", "UNKNOWN"] = "UNKNOWN"
    counts: ResearchCounts = Field(default_factory=ResearchCounts)
    findings: List[Finding] = Field(default_factory=list)

    def to_prompt_text(self) -> str:
        if not self.findings:
            return ""
        lines = [
            f"Research status: {self.status}; overall research confidence: {self.confidence}",
            f"Counts: sources={self.counts.sourcesAnalyzed}, competitors={self.counts.competitorsFound}, "
            f"pricing={self.counts.pricingSources}, market_signals={self.counts.marketSignals}",
            "",
        ]
        for i, f in enumerate(self.findings[:14], 1):
            excerpt = " ".join(f.evidence.split())[:400]
            lines.append(f"{i}. [{f.category.upper()} | {f.confidence}] {f.claim}")
            lines.append(f"   evidence: {excerpt}")
            lines.append(f"   source: {f.source} — {f.sourceUrl}")
        return "\n".join(lines)


def _queries(form: dict) -> dict:
    idea = " ".join(form["idea"].split())[:300]
    target = " ".join(form.get("target", "").split())[:120]
    subject = f"{idea} for {target}" if target else idea
    return {
        "competitors": f"{subject} competitors alternatives products",
        "pricing": f"{idea} pricing plans cost",
        "market": f"{idea} market demand trends industry",
        "community": f"{idea} reviews complaints discussion forum",
    }


async def _fetch_excerpt(url: str) -> Optional[dict]:
    """Access the underlying source so strong claims are not snippet-only."""
    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(8.0, connect=4.0),
            follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0 (compatible; KillMyIdea-Research/1.0)"},
        ) as client:
            resp = await client.get(url)
            if resp.status_code != 200 or "text/html" not in resp.headers.get("content-type", ""):
                return None
            html = resp.text[:300000]
            text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
            return {"excerpt": text[:1500]}
    except Exception:
        return None


class ResearchEngine:
    """Turns an idea into a validated evidence pack. Provider is injectable/replaceable."""

    def __init__(self, provider=None) -> None:
        self.provider = provider or TavilySearchProvider()

    async def research(self, form: dict) -> EvidencePack:
        if not self.provider.configured:
            return EvidencePack(status="unavailable")

        queries = _queries(form)
        # One bounded batch of searches; no repeated queries.
        results = await asyncio.gather(*(self.provider.search(q) for q in queries.values()))
        by_cat = {cat: (res or []) for cat, res in zip(queries.keys(), results)}

        seen = set()
        findings: List[Finding] = []
        fetch_targets = []
        for cat, items in by_cat.items():
            kept = 0
            for item in sorted(items, key=lambda x: x["score"], reverse=True):
                if kept >= 4:
                    break
                if item["score"] < 0.4 or not valid_http_url(item["url"]):
                    continue
                key = hashlib.sha256(item["url"].rstrip("/").lower().encode()).hexdigest()
                if key in seen:
                    continue
                seen.add(key)
                domain = urlparse(item["url"]).netloc.replace("www.", "")
                findings.append(
                    Finding(
                        category=cat,
                        claim=item["title"],
                        source=domain,
                        sourceUrl=item["url"],
                        evidence=item["snippet"],
                        confidence="LOW",  # snippet-only until the source is accessed
                    )
                )
                kept += 1
            if items:
                top = max(items, key=lambda x: x["score"])
                if valid_http_url(top["url"]):
                    fetch_targets.append(top["url"])

        fetched = (
            await asyncio.gather(*(_fetch_excerpt(u) for u in fetch_targets)) if fetch_targets else []
        )
        fetched_map = {url: content for url, content in zip(fetch_targets, fetched) if content}

        upgraded = []
        for f in findings:
            content = fetched_map.get(f.sourceUrl)
            if content:
                # Direct primary evidence accessed.
                upgraded.append(
                    f.model_copy(
                        update={
                            "evidence": (content["excerpt"] or f.evidence)[:1200],
                            "confidence": "HIGH" if f.category == "pricing" else "MEDIUM",
                        }
                    )
                )
            elif f.category in ("competitors", "pricing"):
                upgraded.append(f.model_copy(update={"confidence": "MEDIUM"}))
            else:
                upgraded.append(f)
        findings = upgraded

        counts = ResearchCounts(
            sourcesAnalyzed=len(findings),
            competitorsFound=sum(1 for f in findings if f.category == "competitors"),
            pricingSources=sum(1 for f in findings if f.category == "pricing"),
            marketSignals=sum(1 for f in findings if f.category in ("market", "community")),
        )
        if not findings:
            return EvidencePack(status="unavailable", counts=counts)

        covered = sum(1 for c in CATEGORIES if any(f.category == c for f in findings))
        status = "success" if covered >= 3 else "partial"
        highs = sum(1 for f in findings if f.confidence == "HIGH")
        confidence = (
            "HIGH" if len(findings) >= 6 and highs >= 2 else "MEDIUM" if len(findings) >= 4 else "LOW"
        )
        return EvidencePack(status=status, confidence=confidence, counts=counts, findings=findings)
