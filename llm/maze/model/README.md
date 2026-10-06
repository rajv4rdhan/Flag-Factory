# Maze — model assets

This folder holds everything about the **model** (as opposed to the code that
serves or uses it).

```
model/
  prompts/
    system.txt        # system prompt template; contains the {flag} slot
  configs/
    generation.json   # sampling parameters shared by the inference server
  artifacts/          # downloaded GGUF weights — GITIGNORED, never committed
  download-model.sh   # fetches the GGUF from Hugging Face
```

## Model

- **Base:** `Qwen/Qwen2.5-0.5B-Instruct` (~0.5B parameters).
- **Quantization:** GGUF `Q4_K_M` (~470 MB) for CPU inference.
- **Default GGUF repo:** `Qwen/Qwen2.5-0.5B-Instruct-GGUF`.

Override with env vars:

```bash
MODEL_REPO=QuantFactory/Qwen2.5-0.5B-Instruct-GGUF \
MODEL_FILE=Qwen2.5-0.5B-Instruct.Q4_K_M.gguf \
  bash model/download-model.sh
```

## Why weights are not committed

Model binaries are large, change independently of code, and (in phase 3) become
**registry artifacts** rather than Git files. The download script is the single
source of truth for *which* model the challenge uses.
