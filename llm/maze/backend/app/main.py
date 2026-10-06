"""Maze backend — FastAPI application (the "application layer")."""

from __future__ import annotations

from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import get_settings
from .guardrails import apply_guardrail
from .inference_client import InferenceClient, InferenceError
from .prompts import PromptBuilder
from .ratelimit import SlidingWindowLimiter
from .sessions import SessionStore

settings = get_settings()

prompt_builder = PromptBuilder(settings.prompt_path, settings.flag)
session_store = SessionStore(settings.max_turns_per_session)
limiter = SlidingWindowLimiter(settings.rate_limit_per_minute)


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = httpx.AsyncClient(
        base_url=settings.inference_base_url,
        timeout=settings.inference_timeout,
    )
    app.state.inference = InferenceClient(
        client,
        model=settings.inference_model,
        max_tokens=settings.max_new_tokens,
        temperature=settings.temperature,
        top_p=settings.top_p,
    )
    try:
        yield
    finally:
        await client.aclose()


app = FastAPI(title="Maze", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(
        {
            settings.frontend_origin,
            "http://localhost:3000",
            "http://localhost:5173",
        }
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    prompt: str = Field(min_length=1)
    session_id: str | None = None


class AskResponse(BaseModel):
    session_id: str
    reply: str
    turns: int


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/ask", response_model=AskResponse)
async def ask(req: AskRequest, request: Request) -> AskResponse:
    client_ip = request.client.host if request.client else "unknown"
    if not limiter.allow(f"ip:{client_ip}"):
        raise HTTPException(status_code=429, detail="Too many requests. Slow down.")

    prompt = req.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=422, detail="Empty prompt.")
    if len(prompt) > settings.max_prompt_chars:
        raise HTTPException(status_code=413, detail="Prompt too long.")

    session = session_store.get_or_create(req.session_id)
    if not limiter.allow(f"session:{session.id}"):
        raise HTTPException(status_code=429, detail="Too many requests for this session.")
    if session_store.turn_count(session) >= settings.max_turns_per_session:
        raise HTTPException(status_code=429, detail="Session turn limit reached. Start a new chat.")

    messages = [
        {"role": "system", "content": prompt_builder.system_prompt()},
        *session_store.history(session),
        {"role": "user", "content": prompt},
    ]

    try:
        reply = await request.app.state.inference.chat(messages)
    except InferenceError:
        raise HTTPException(status_code=502, detail="The vault is unreachable right now.") from None

    safe_reply = apply_guardrail(reply)

    session_store.append(session, "user", prompt)
    session_store.append(session, "assistant", safe_reply)

    return AskResponse(
        session_id=session.id,
        reply=safe_reply,
        turns=session_store.turn_count(session),
    )
