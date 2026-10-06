"""Environment-driven configuration for the Maze backend.

Deliberately dependency-light: plain environment variables, no extra libraries.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


def _int(name: str, default: int) -> int:
    try:
        return int(os.environ[name])
    except (KeyError, ValueError):
        return default


def _float(name: str, default: float) -> float:
    try:
        return float(os.environ[name])
    except (KeyError, ValueError):
        return default


@dataclass(frozen=True)
class Settings:
    # The secret the bot must protect. Provided via env (later: K8s Secret).
    flag: str

    # Inference server (OpenAI-compatible)
    inference_base_url: str
    inference_model: str
    inference_timeout: float

    # Generation
    max_new_tokens: int
    temperature: float
    top_p: float

    # Limits / abuse control
    max_prompt_chars: int
    max_turns_per_session: int
    rate_limit_per_minute: int

    # System prompt template location
    prompt_path: str

    # CORS
    frontend_origin: str


@lru_cache
def get_settings() -> Settings:
    return Settings(
        flag=os.getenv("MAZE_FLAG", "flag{dev_placeholder_change_me}"),
        inference_base_url=os.getenv("INFERENCE_BASE_URL", "http://inference:8080").rstrip("/"),
        inference_model=os.getenv("INFERENCE_MODEL", "qwen2.5-0.5b-instruct"),
        inference_timeout=_float("INFERENCE_TIMEOUT", 60.0),
        max_new_tokens=_int("MAX_NEW_TOKENS", 256),
        temperature=_float("TEMPERATURE", 0.7),
        top_p=_float("TOP_P", 0.95),
        max_prompt_chars=_int("MAX_PROMPT_CHARS", 2000),
        max_turns_per_session=_int("MAX_TURNS_PER_SESSION", 40),
        rate_limit_per_minute=_int("RATE_LIMIT_PER_MINUTE", 20),
        prompt_path=os.getenv("PROMPT_PATH", "model/prompts/system.txt"),
        frontend_origin=os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
    )
