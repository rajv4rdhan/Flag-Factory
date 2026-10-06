#!/usr/bin/env bash
#
# Maze inference entrypoint.
#
# Wraps llama.cpp's llama-server and exposes an OpenAI-compatible API.
# The model is either mounted at LLAMA_MODEL_PATH or downloaded from the
# Hugging Face Hub at startup (cached in LLAMA_CACHE). Weights are never
# committed to Git.
#
set -euo pipefail

HOST="${LLAMA_HOST:-0.0.0.0}"
PORT="${LLAMA_PORT:-8080}"
CTX_SIZE="${LLAMA_CTX_SIZE:-2048}"
THREADS="${LLAMA_THREADS:-0}"
N_PREDICT="${LLAMA_N_PREDICT:-256}"
MODEL_PATH="${LLAMA_MODEL_PATH:-/models/model.gguf}"

REPO="${MODEL_REPO:-Qwen/Qwen2.5-0.5B-Instruct-GGUF}"
FILE="${MODEL_FILE:-qwen2.5-0.5b-instruct-q4_k_m.gguf}"
QUANT="${MODEL_QUANT:-Q4_K_M}"

export LLAMA_CACHE="${LLAMA_CACHE:-/models}"

ARGS=(--host "$HOST" --port "$PORT" --ctx-size "$CTX_SIZE" --n-predict "$N_PREDICT" --jinja)
[[ "$THREADS" != "0" ]] && ARGS+=(--threads "$THREADS")

if [[ -f "$MODEL_PATH" ]]; then
  echo "→ Loading local model: $MODEL_PATH"
  ARGS+=(--model "$MODEL_PATH")
elif [[ -n "$FILE" ]]; then
  echo "→ Downloading ${REPO}/${FILE} (cache: ${LLAMA_CACHE})"
  ARGS+=(--hf-repo "$REPO" --hf-file "$FILE")
else
  echo "→ Downloading ${REPO}:${QUANT} (cache: ${LLAMA_CACHE})"
  ARGS+=(--hf-repo "${REPO}:${QUANT}")
fi

echo "→ Starting llama-server: ${ARGS[*]}"
exec /app/llama-server "${ARGS[@]}"
