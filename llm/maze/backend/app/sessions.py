"""In-memory conversation session store.

Simple and process-local for now. Distinct sessions never share context, which
keeps one player's leak from helping another. (A shared store arrives in a later
phase if we scale horizontally.)
"""

from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass, field


@dataclass
class Turn:
    role: str  # "user" | "assistant"
    content: str


@dataclass
class Session:
    id: str
    turns: list[Turn] = field(default_factory=list)


class SessionStore:
    def __init__(self, max_turns: int) -> None:
        self._sessions: dict[str, Session] = {}
        self._lock = threading.Lock()
        self.max_turns = max_turns

    def get_or_create(self, session_id: str | None) -> Session:
        with self._lock:
            if session_id and session_id in self._sessions:
                return self._sessions[session_id]
            new_id = session_id or uuid.uuid4().hex
            session = Session(id=new_id)
            self._sessions[new_id] = session
            return session

    def append(self, session: Session, role: str, content: str) -> None:
        with self._lock:
            session.turns.append(Turn(role=role, content=content))

    def history(self, session: Session) -> list[dict[str, str]]:
        """Conversation history as OpenAI-style messages."""
        with self._lock:
            return [{"role": t.role, "content": t.content} for t in session.turns]

    def turn_count(self, session: Session) -> int:
        """Number of user turns so far."""
        with self._lock:
            return sum(1 for t in session.turns if t.role == "user")
