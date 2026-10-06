# Maze — LLM Jailbreak Challenge

**Maze** is a CTF challenge: a chat bot that guards a secret flag in its system
prompt and refuses to reveal it. Your job is to jailbreak it and leak the flag.

It is built the way an industry LLM product is structured — not as one monolith,
but as separate layers:

| Layer | Folder | Role |
|---|---|---|
| Client | [`frontend/`](frontend/) | The chat UI users type into |
| Application / API | [`backend/`](backend/) | Sessions, prompt assembly, guardrails, rate limiting, routing |
| Inference | [`inference/`](inference/) | Model server exposing an OpenAI-compatible API |
| Model | [`model/`](model/) | Prompt templates, generation config, artifacts (weights not committed) |
| Deploy | [`deploy/`](deploy/) | docker-compose for local dev |
| Docs / tests | [`docs/`](docs/), [`tests/`](tests/) | Architecture + automated checks |

```
browser → frontend → backend (/api/ask) → inference (/v1/chat/completions)
                          │                        │
                          └── system prompt + flag  └── Qwen2.5-0.5B-Instruct (GGUF, CPU)
                              + output guardrail
```

## Quickstart

```bash
cp .env.example .env          # set MAZE_FLAG (the secret)
make model-download           # fetch the GGUF into model/artifacts/ (never committed)
make up                       # docker compose build + up
open http://localhost:3000
```

`make down` stops everything, `make test` runs the unit tests.

> **Sandboxed / nested Docker:** if containers can't reach each other on the
> compose network, use `make up-restricted` (host networking, frontend on
> `http://localhost`). See [`deploy/docker-compose.restricted.yml`](deploy/docker-compose.restricted.yml).

## The challenge

- The flag lives in the **system prompt**, injected from the `MAZE_FLAG`
  environment variable.
- A naive output guardrail strips the exact `flag{...}` token.
- The intended solve is to jailbreak the model (prompt leak / role-play) **and**
  bypass the filter (spacing, encoding, splitting across turns).

The vulnerability is intentional. See [`docs/architecture.md`](docs/architecture.md)
for internals.

## Model

`Qwen/Qwen2.5-0.5B-Instruct`, quantized to GGUF `Q4_K_M` (~470 MB),
served on CPU by `llama.cpp`. Weights are **never committed** — they are
downloaded at build/run time.
