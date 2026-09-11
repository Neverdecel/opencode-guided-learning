#!/bin/sh
set -eu
# Invoke from the checkout root. No host credentials or skill libraries are mounted.
docker run --rm \
  --mount "type=bind,src=$(pwd),dst=/app,readonly" \
  --mount "type=bind,src=$(command -v opencode),dst=/usr/local/bin/opencode,readonly" \
  --workdir /work \
  --env GUIDED_LEARNING_CONTAINER=1 \
  --env "EVAL_MODEL=${EVAL_MODEL:-opencode/big-pickle}" \
  --env "EVAL_CASE=${EVAL_CASE:-}" \
  node:24-bookworm-slim node "/app/test/${EVAL_SCRIPT:-live}.ts"
