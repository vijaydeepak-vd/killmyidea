import logging
import os
import re
from typing import Optional
from urllib.parse import urlparse

import httpx

log = logging.getLogger(__name__)


def valid_http_url(value: str) -> bool:
    p = urlparse(value)
    return p.scheme in {"http", "https"} and bool(p.netloc)


class TavilySearchProvider:
    """Tavily Search API, server-side only. Swap this class to change search providers."""

    name = "tavily"

    def __init__(self) -> None:
        self.api_key = os.environ.get("TAVILY_API_KEY")
        self.base_url = os.environ.get("TAVILY_BASE_URL", "https://api.tavily.com").rstrip("/")

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    async def search(self, query: str, max_results: int = 5) -> Optional[list]:
        """Return validated [{title, url, snippet, score}] or None when unavailable."""
        if not self.api_key:
            return None
        payload = {
            "query": query,
            "search_depth": "basic",
            "topic": "general",
            "max_results": max_results,
            "include_answer": False,
            "include_raw_content": False,
        }
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(12.0, connect=5.0)) as client:
                resp = await client.post(
                    f"{self.base_url}/search",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
                resp.raise_for_status()
                data = resp.json()
        except Exception as exc:
            # Never log the key or request headers.
            log.warning("Search provider request failed: %s", type(exc).__name__)
            return None

        import html as html_lib

        results = []
        for item in data.get("results", []):
            title = html_lib.unescape(str(item.get("title", ""))).strip()
            url = str(item.get("url", "")).strip()
            snippet = html_lib.unescape(str(item.get("content", ""))).strip()
            snippet = re.sub(r"\s+", " ", snippet.replace("Skip to main content", "").replace("Skip to content", "")).strip()
            try:
                score = float(item.get("score", 0) or 0)
            except (TypeError, ValueError):
                continue
            if not title or not snippet or not valid_http_url(url):
                continue
            results.append({"title": title, "url": url, "snippet": snippet[:1200], "score": score})
        return results
