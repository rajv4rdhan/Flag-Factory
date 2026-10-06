from fastapi.testclient import TestClient

from app import main


class FakeInference:
    """Stands in for the model server so API tests need no model."""

    def __init__(self, reply: str = "ok") -> None:
        self.reply = reply

    async def chat(self, messages: list[dict[str, str]]) -> str:
        return self.reply


def test_healthz() -> None:
    with TestClient(main.app) as client:
        resp = client.get("/healthz")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}


def test_ask_applies_guardrail() -> None:
    with TestClient(main.app) as client:
        client.app.state.inference = FakeInference("the token is flag{leaked} — keep it safe")
        resp = client.post("/api/ask", json={"prompt": "hi"})
        assert resp.status_code == 200
        data = resp.json()
        assert "[REDACTED]" in data["reply"]
        assert "flag{leaked}" not in data["reply"]
        assert data["session_id"]
        assert data["turns"] == 1


def test_ask_passes_through_transformed_reply() -> None:
    with TestClient(main.app) as client:
        # A bypassed (spaced) token must NOT be redacted.
        client.app.state.inference = FakeInference("f l a g { l e a k e d }")
        resp = client.post("/api/ask", json={"prompt": "hi"})
        assert resp.status_code == 200
        assert "f l a g { l e a k e d }" in resp.json()["reply"]


def test_ask_rejects_empty_prompt() -> None:
    with TestClient(main.app) as client:
        assert client.post("/api/ask", json={"prompt": "   "}).status_code == 422


def test_ask_rejects_too_long_prompt() -> None:
    with TestClient(main.app) as client:
        client.app.state.inference = FakeInference("ok")
        too_long = "x" * (main.settings.max_prompt_chars + 1)
        assert client.post("/api/ask", json={"prompt": too_long}).status_code == 413


def test_sessions_are_isolated_via_api() -> None:
    with TestClient(main.app) as client:
        client.app.state.inference = FakeInference("ok")
        first = client.post("/api/ask", json={"prompt": "hello"}).json()
        second = client.post("/api/ask", json={"prompt": "hello"}).json()
        assert first["session_id"] != second["session_id"]


def test_inference_failure_returns_502() -> None:
    class Broken:
        async def chat(self, messages: list[dict[str, str]]) -> str:
            from app.inference_client import InferenceError

            raise InferenceError("boom")

    with TestClient(main.app) as client:
        client.app.state.inference = Broken()
        resp = client.post("/api/ask", json={"prompt": "hi"})
        assert resp.status_code == 502
