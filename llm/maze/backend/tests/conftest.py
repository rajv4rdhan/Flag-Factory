"""Pytest bootstrap: make the app importable/runnable without a full stack."""

from __future__ import annotations

import os
from pathlib import Path

# The app renders its system prompt at import time. Point PROMPT_PATH at the
# repo template when it exists and the env var is not already set (the container
# image sets PROMPT_PATH=/app/prompts/system.txt explicitly).
_here = Path(__file__).resolve()
_maze_root = _here.parents[2] if len(_here.parents) >= 3 else _here.parent
_template = _maze_root / "model" / "prompts" / "system.txt"
if _template.exists():
    os.environ.setdefault("PROMPT_PATH", str(_template))

os.environ.setdefault("MAZE_FLAG", "flag{test_placeholder}")
