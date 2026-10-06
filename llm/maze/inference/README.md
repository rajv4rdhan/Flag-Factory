# Maze — inference server

Thin wrapper around **llama.cpp**'s `llama-server`. It loads (or downloads) the
Qwen2.5-0.5B GGUF model and exposes:

- `POST /v1/chat/completions` — OpenAI-compatible chat completions
- `GET  /health` — readiness (200 only once the model is loaded)
- `GET  /v1/models` — model listing

The backend talks to this service; it is **not** exposed to users.

## Model resolution order

1. If `LLAMA_MODEL_PATH` points at an existing file, use it (`--model`).
2. Otherwise download from Hugging Face using `MODEL_REPO` + `MODEL_FILE`
   (`--hf-repo` / `--hf-file`), cached under `LLAMA_CACHE` (`/models`).

Weights are downloaded at first start and cached in a volume — never committed.

## Environment

| Var | Default | Meaning |
|---|---|---|
| `MODEL_REPO` | `Qwen/Qwen2.5-0.5B-Instruct-GGUF` | HF repo |
| `MODEL_FILE` | `qwen2.5-0.5b-instruct-q4_k_m.gguf` | HF file |
| `LLAMA_MODEL_PATH` | `/models/model.gguf` | local model path (takes priority) |
| `LLAMA_CACHE` | `/models` | download cache |
| `LLAMA_PORT` | `8080` | listen port |
| `LLAMA_CTX_SIZE` | `2048` | context window |
| `LLAMA_N_PREDICT` | `256` | max tokens to generate |
| `LLAMA_THREADS` | `0` (=auto) | CPU threads |

## Run standalone

```bash
docker build -f inference/Dockerfile -t maze-inference ..
docker run --rm -p 8080:8080 -v maze-models:/models maze-inference
curl localhost:8080/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"hi"}]}'
```
