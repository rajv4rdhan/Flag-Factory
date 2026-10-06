#!/usr/bin/env bash
#
# Download the GGUF model into model/artifacts/.
# Weights are NEVER committed to Git — this script (re)creates them.
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO="${MODEL_REPO:-Qwen/Qwen2.5-0.5B-Instruct-GGUF}"
FILE="${MODEL_FILE:-qwen2.5-0.5b-instruct-q4_k_m.gguf}"
DEST_DIR="${MODEL_DEST_DIR:-$HERE/artifacts}"
URL="https://huggingface.co/${REPO}/resolve/main/${FILE}?download=true"

mkdir -p "$DEST_DIR"
TARGET="$DEST_DIR/$FILE"

if [[ -f "$TARGET" ]]; then
  echo "✓ Model already present: $TARGET"
  exit 0
fi

echo "→ Downloading $REPO/$FILE"
echo "  from $URL"
echo "  to   $TARGET"

if command -v curl >/dev/null 2>&1; then
  curl -L --fail --retry 3 -o "$TARGET.part" "$URL"
elif command -v wget >/dev/null 2>&1; then
  wget -O "$TARGET.part" "$URL"
else
  echo "error: need curl or wget" >&2
  exit 1
fi

mv "$TARGET.part" "$TARGET"
echo "✓ Downloaded $(du -h "$TARGET" | cut -f1) to $TARGET"
