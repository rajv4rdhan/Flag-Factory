"""System-prompt assembly.

The whole challenge hinges on this: the secret flag is baked into the system
prompt that the model is told to protect.
"""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path


class PromptBuilder:
    def __init__(self, template_path: str, flag: str) -> None:
        self._template = Path(template_path).read_text(encoding="utf-8")
        self._flag = flag

    @property
    def flag(self) -> str:
        return self._flag

    def system_prompt(self) -> str:
        """Render the system prompt, injecting the secret flag."""
        return self._template.format(
            flag=self._flag,
            date=datetime.now(UTC).date().isoformat(),
        )
