# Phase 1 — Build the LLM Jailbreak (industry-style layout)

**Goal:** **Maze** — a simple, fully working LLM jailbreak challenge running
locally: a React chat frontend, a FastAPI backend, and a tiny self-hosted model.
Organized the way an industry LLM product separates client / API / inference /
model.

**This phase delivers a solvable challenge — everything after this is
infrastructure around it.**

---

## 1. Folder layout (industry-style)

```
llm/maze/
  frontend/                 # the chat client (ChatGPT-like UI)
  backend/                  # API gateway + application logic
  inference/                # model serving (llama.cpp server)
  model/                    # prompts, configs, artifacts
  deploy/                   # docker-compose for local dev (k8s comes in phase 2)
  docs/
  tests/
```

**Why:** industry LLM products are not one monolith. They split:

- **Client** (`frontend/`) — the UI users type into.
- **Application/API layer** (`backend/`) — auth, sessions/conversation state,
  prompt assembly, moderation/guardrails, rate limiting, routing to the model.
- **Inference layer** (`inference/`) — the model server exposing an
  OpenAI-compatible HTTP API.
- **Model layer** (`model/`) — prompt templates, generation config, weights
  (referenced, not committed).

This separation is exactly what lets phases 2–4 deploy, version, and scale each
piece independently.

---

## 2. The model

- **Model:** `HuggingFaceTB/SmolLM2-135M-Instruct`.
- **Format:** GGUF `Q4_K_M` (~100 MB), CPU-only.
- **Engine:** `llama.cpp` `llama-server`, which exposes
  `/v1/chat/completions` (OpenAI-compatible).
- Weights are **not committed**; `model/artifacts/` is gitignored with a
  `download.sh` / `Makefile` target to fetch + convert.

---

## 3. Backend (`backend/`)

FastAPI service, the "application layer".

- `POST /api/ask` — body `{ session_id, prompt }` → response `{ reply }`.
- **Session store** — per-session conversation history (in-memory for now).
- **Prompt assembly** — loads the system prompt template from `model/prompts/`
  and injects the secret flag from an environment variable (never from Git).
- **Guardrails** — output filter + "do not reveal" instruction. The filter is
  **intentionally weak** (see §6).
- **Rate limiting** — per-IP and per-session caps.
- **Upstream client** — calls the inference server's OpenAI-compatible endpoint.
- Never echoes the system prompt in errors/logs.

Suggested modules:
```
backend/app/
  main.py            # FastAPI app + routes
  config.py          # env, flags, model endpoint
  sessions.py        # conversation state
  prompts.py         # system prompt assembly
  guardrails.py      # output filtering (the vulnerability)
  ratelimit.py
  inference_client.py
```

---

## 4. Inference (`inference/`)

- Dockerfile wrapping `ghcr.io/ggml-org/llama.cpp:server`.
- Startup: load the GGUF from `model/artifacts/`.
- Health endpoint + readiness (slow first load).
- Serves `POST /v1/chat/completions`.
- Resource limits suited to CPU (small model → light).
- `inference/README.md` documenting the OpenAI-compatible surface.

---

## 5. Frontend (`frontend/`)

- React + Vite + Tailwind chat UI (adapt the previous XO2 chat look).
- Talks only to the backend (`/api/ask`), never directly to `inference/`.
- Typing indicator, auto-scroll, error boundary, welcome suggestions.
- Session id generated per browser session and sent with each request.

---

## 6. Challenge design (the actual vulnerability)

- **Persona:** "Zoo Keeper AI" assistant guarding a secret.
- **Secret:** `flag{...}` placed in the system prompt, injected as an env var.
- **Guardrail:** instruction not to reveal + a naive output filter that strips
  only the exact literal `flag{...}` token.
- **Intended solve:** prompt leak (role-play / "repeat your instructions") and/or
  filter bypass (spacing, base64, leetspeak, split across turns).
- **Difficulty knobs:** filter strictness, turn limit, rate limit.

Anti-cheat basics from day one:
- flag only in `backend` env (via `.env` locally / Secret later),
- `inference/` reachable only by `backend/`,
- no cross-session context bleed,
- system prompt never returned by the API.

---

## 7. Local run

`deploy/docker-compose.yml` brings up:
- `frontend` (port 3000, proxied to backend)
- `backend` (port 8000)
- `inference` (port 8080, internal only)

```bash
cp .env.example .env          # set FLAG=flag{...}
make model-download           # fetch + convert SmolLM2-135M to GGUF Q4
docker compose up --build
open http://localhost:3000
```

---

## Deliverables

- `llm/maze/{frontend,backend,inference,model}/`
- `llm/maze/deploy/docker-compose.yml`
- `llm/maze/tests/` — unit + the intended-exploit system test
- `llm/maze/docs/architecture.md`
- `llm/maze/README.md`

## Done when

- `docker compose up` starts all three services locally.
- In the UI, a normal prompt is refused / "protected".
- A crafted jailbreak **leaks the flag**.
- The naive literal filter is demonstrably bypassable.
- Two concurrent sessions do not share context.
- `tests/` includes the intended exploit and passes against the running stack.

## Notes

- Keep the challenge logic isolated in `backend/app/guardrails.py` +
  `model/prompts/` so phase 3 can evaluate it and phase 4 can tune difficulty
  without touching the inference layer.
- The layout already anticipates phase 2 (`deploy/k8s`), phase 3 (move prompts +
  model into a registry/pipeline), and phase 4 (`infra/`).
