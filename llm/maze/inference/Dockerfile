# syntax=docker/dockerfile:1
#
# Maze inference server.
#
# Built on the official llama.cpp server image (Ubuntu, ships llama-server and
# curl). We only add an entrypoint that loads or downloads the GGUF, then serves
# an OpenAI-compatible API on :8080.
#
FROM ghcr.io/ggml-org/llama.cpp:server

COPY inference/entrypoint.sh /usr/local/bin/maze-inference
RUN chmod +x /usr/local/bin/maze-inference

# Model download cache (mount a volume here so it survives restarts).
ENV LLAMA_CACHE=/models \
    LLAMA_HOST=0.0.0.0 \
    LLAMA_PORT=8080

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/maze-inference"]
