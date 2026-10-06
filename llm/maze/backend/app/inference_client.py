"""Client for the OpenAI-compatible inference server."""

from __future__ import annotations

import httpx


class InferenceError(RuntimeError):
    """Raised when the inference server cannot produce a completion."""


class InferenceClient:
    def __init__(
        self,
        client: httpx.AsyncClient,
        model: str,
        max_tokens: int,
        temperature: float,
        top_p: float,
    ) -> None:
        self._client = client
        self._model = model
        self._max_tokens = max_tokens
        self._temperature = temperature
        self._top_p = top_p

    async def chat(self, messages: list[dict[str, str]]) -> str:
        payload = {
            "model": self._model,
            "messages": messages,
            "max_tokens": self._max_tokens,
            "temperature": self._temperature,
            "top_p": self._top_p,
            "stream": False,
        }
        try:
            resp = await self._client.post("/v1/chat/completions", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
        except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
            raise InferenceError(str(exc)) from exc
