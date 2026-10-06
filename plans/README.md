# Flag-Factory — LLM Jailbreak Challenge Plan

Add a second CTF challenge to Flag-Factory: **Maze**, a jailbreakable LLM chat
bot. The web challenge (Zoo) already exists; this plan adds the Maze challenge
and then layers on deployment, MLOps, and advanced DevOps/cloud.

> Zoo (`web/zoo`) is left as-is. The LLM challenge is a new, separate app.

## The 4 phases

| Phase | What | File |
|---|---|---|
| **1. Build** | **Maze**, a simple working LLM jailbreak: frontend + backend + small model, organized with an industry-style folder layout (ChatGPT-like separation of client / API / inference / ML) | [phase-1-build.md](phase-1-build.md) |
| **2. Deploy** | Kubernetes deployment of **both** challenges (Zoo web + Maze) so users can access both | [phase-2-kubernetes-deployment.md](phase-2-kubernetes-deployment.md) |
| **3. MLOps** | Model fine-tuning, evaluation, registry and pipelines with Kubeflow (KFP), MLflow, MinIO | [phase-3-mlops-kubeflow.md](phase-3-mlops-kubeflow.md) |
| **4. Advanced** | Extra advanced DevOps + cloud: GitOps, CI/CD supply chain, observability, autoscaling, policy, Terraform | [phase-4-advanced-devops-cloud.md](phase-4-advanced-devops-cloud.md) |

**Rule:** do them in order. Phase 1 must produce a solvable challenge locally
before it is deployed.

## Core decisions

| Decision | Choice |
|---|---|
| Model | **Qwen2.5-0.5B-Instruct** (≈0.5B params, Q4 GGUF ≈470 MB), CPU-only |
| Inference engine | **llama.cpp** (`llama-server`) exposing an OpenAI-compatible API |
| Backend | Python **FastAPI** gateway (auth, sessions, prompt assembly, guardrails, rate limit) |
| Frontend | React + Vite + Tailwind chat UI |
| Challenge mechanic | Flag hidden in the **system prompt**; guardrails deny it; player jailbreaks to leak it |

## Target layout (industry-style, built across the phases)

```
llm/maze/
  frontend/     # chat client                     (phase 1)
  backend/      # API gateway / orchestration     (phase 1)
  inference/    # model server (llama.cpp)        (phase 1)
  model/        # prompts, configs, artifacts     (phase 1, managed in phase 3)
  deploy/       # compose (phase 1), k8s/helm     (phase 2)
  ml/           # pipelines, evals, finetuning    (phase 3)
  infra/        # terraform / cloud               (phase 4)
  docs/
  tests/
```

## Why this mirrors how industry (ChatGPT-like) builds it

| Industry layer | This repo |
|---|---|
| Client (web/mobile) | `frontend/` |
| API + application layer (auth, conversation state, moderation, routing) | `backend/` |
| Inference/serving layer (model server, OpenAI-compatible API) | `inference/` |
| Model assets (prompts, configs, weights) | `model/` |
| Training / finetuning / evals / registry | `ml/` + Kubeflow/MLflow (phase 3) |
| Deployment + platform + cloud | `deploy/` + `infra/` (phases 2 & 4) |
