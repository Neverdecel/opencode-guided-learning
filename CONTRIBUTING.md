# Contributing

Keep the capability small: agent guidance, human approval, native skills.
Read [AGENTS.md](AGENTS.md) and [docs/research.md](docs/research.md) before
changing the runtime. Do not add independent persistence, autonomous writes,
or cleanup infrastructure.

## Development setup

Requires Node.js 24+ and npm. OpenCode 1.18.30 is required for live CLI tests.

```sh
git clone https://github.com/Neverdecel/opencode-guided-learning.git
cd opencode-guided-learning
npm ci
npm run check
npm test
```

GitHub Actions runs the same deterministic checks. They cover hook
registration, isolation, options, and bundled skill format. They do **not**
certify model consent or secret detection.

## Pull requests

1. Branch from `main`. Direct pushes, force-pushes, and deleting `main` are
   blocked.
2. Keep the change focused. Update docs and examples with options or behavior.
3. Inspect pinned `@opencode-ai/plugin` and SDK types before changing hooks.
4. Open a PR targeting `main`. The `check` CI job must pass.
5. Squash or rebase merge only (linear history).

Ship product skills under `skills/` and load them via `skills.paths`. Keep
examples outside auto-discovery directories. Do not copy product skills into
another project’s `.opencode/skills/` in docs or tests unless the point is a
fork.

## Live CLI and model checks

Linux, Docker, and a native OpenCode binary. From the checkout root:

```sh
# Actual OpenCode system request and persisted-session isolation; fake provider.
EVAL_SCRIPT=context sh test/live.sh

# Real model, native file tools, disposable skill libraries.
sh test/live.sh

EVAL_CASE=4 sh test/live.sh
EVAL_MODEL=opencode/mimo-v2.5-free EVAL_CASE=4 sh test/live.sh
```

The scripts mount the checkout and CLI read-only in a disposable container.
They do not mount a real home or credentials. Default live model:
`opencode/big-pickle` (provider-dependent). The noninteractive runner uses
text replies and disables the `question` tool. These tests are opt-in, not CI.

Review tool traces and generated prose, not only exit status. No-write cases
fail on attempted skill/config writes, including blocked tool calls. Keyword
checks are smoke only. Acceptance criteria:
[test/SCENARIOS.md](test/SCENARIOS.md). Record intermittent failures; a later
pass does not erase them. Never run evaluation writes against a real skill
library.

## Releases

Package, repo, and plugin id are `opencode-guided-learning`. Publish with a
`v*` tag or `workflow_dispatch` on `.github/workflows/publish.yml`; it needs
the `NPM_TOKEN` secret. Do not `npm publish` from a laptop. Bump
`package.json` version before tagging.

## Issues

Include OpenCode and model versions and a minimal, sanitized reproduction.
Do not upload configuration secrets, credentials, or private session exports.
Security reports go through [SECURITY.md](SECURITY.md), not public issues.
