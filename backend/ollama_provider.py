import asyncio
import logging
import os
from typing import Optional

import httpx

log = logging.getLogger(__name__)


class OllamaCloudProvider:
    """Ollama Cloud via its OpenAI-compatible API. Exactly one call per analysis."""

    name = "ollama-cloud"

    def __init__(self) -> None:
        self.api_key = os.environ.get("OLLAMA_API_KEY")
        self.base_url = os.environ.get("OLLAMA_BASE_URL", "https://ollama.com/v1/").rstrip("/")
        self.model = os.environ.get("OLLAMA_MODEL", "gemma4:31b-cloud")

    async def complete(self, messages: list) -> Optional[str]:
        if not self.api_key:
            log.warning("OLLAMA_API_KEY is not configured")
            return None
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "temperature": 0.2,
        }
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(
                    timeout=httpx.Timeout(connect=5.0, read=90.0, write=10.0, pool=5.0)
                ) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json",
                        },
                        json=payload,
                    )
                    response.raise_for_status()
                    body = response.json()
                    return body["choices"][0]["message"]["content"]
            except Exception as exc:
                # Never log the key, headers, or the user's idea.
                transient = isinstance(exc, (httpx.TimeoutException, httpx.ConnectError)) or (
                    isinstance(exc, httpx.HTTPStatusError)
                    and exc.response.status_code in {429, 500, 502, 503, 504}
                )
                log.warning(
                    "Ollama Cloud request failed: %s (attempt %d, transient=%s)",
                    type(exc).__name__,
                    attempt + 1,
                    transient,
                )
                if not transient or attempt == 1:
                    return None
                await asyncio.sleep(3)
        return None
