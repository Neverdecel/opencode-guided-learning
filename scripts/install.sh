#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
GLOBAL=-g
FORCE=

while [ $# -gt 0 ]; do
  case $1 in
    --local) GLOBAL= ;;
    --force|-f) FORCE=-f ;;
    -h|--help)
      printf '%s\n' "usage: scripts/install.sh [--local] [--force]" \
        "  (default: global OpenCode config)" \
        "Windows: opencode plugin -g C:\\path\\to\\opencode-guided-learning"
      exit 0
      ;;
    *)
      printf 'unknown option: %s\n' "$1" >&2
      exit 1
      ;;
  esac
  shift
done

if ! command -v opencode >/dev/null 2>&1; then
  printf 'opencode not found in PATH\n' >&2
  exit 1
fi

opencode plugin $GLOBAL $FORCE "$ROOT"

printf '\nRestart OpenCode.\n'
printf 'Optional bundled skills: add "%s/skills" to skills.paths\n' "$ROOT"
printf 'If you previously used a file:///…/src/index.ts entry, remove it to avoid duplicate guidance.\n'
