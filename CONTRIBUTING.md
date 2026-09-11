# Contributing

Keep this capability small: agent guidance, human approval, native skills.
Read [AGENTS.md](AGENTS.md) and [the API research](docs/research.md) before changing
the runtime. Avoid adding independent persistence, autonomous writes, or cleanup
infrastructure.

## Local checks

Requires Node.js 24+ and npm:

```sh
npm ci
npm run check
npm test
```

GitHub Actions runs these deterministic checks. They verify hook registration,
context isolation between calls, options, and the example format; they do not
certify model consent or secret detection.

## Actual CLI and model checks

On Linux, install Docker and the native OpenCode binary, then run from the
checkout root:

```sh
# Actual OpenCode system request and persisted-session isolation; fake provider.
EVAL_SCRIPT=context sh test/live.sh

# Real model, native file tools, disposable skill libraries.
sh test/live.sh

# Target one scenario or another credential-free model.
EVAL_CASE=4 sh test/live.sh
EVAL_MODEL=opencode/mimo-v2.5-free EVAL_CASE=4 sh test/live.sh
```

The scripts mount the checkout and installed CLI read-only in a disposable
container. They do not mount a real home or credentials. The default live model
is `opencode/big-pickle`; availability depends on the provider. The noninteractive
runner uses text replies and disables the `question` tool. Model tests are
opt-in, not GitHub CI jobs.

Review tool traces and generated prose as well as exit status. Live cases that
must not persist now fail on attempted skill/config writes, including blocked
tool calls. Keyword assertions are only smoke checks. Use [SCENARIOS.md](test/SCENARIOS.md) for the complete acceptance
criteria and additional manual regressions. Record failures honestly, including
intermittent failures; a successful rerun does not erase them.

## Changes and issues

- Inspect pinned `@opencode-ai/plugin` and SDK types before changing hooks.
- Update documentation and examples together with options or behavior changes.
- Keep example skills outside auto-discovery directories. Ship product skills
  under `skills/`; users load them via `skills.paths`, not by copying into
  another project's `.opencode/skills/` unless they want a fork.
- Submit focused pull requests targeting `main`. Direct pushes, force-pushes,
  and deleting `main` are blocked. The `check` CI job must pass before merge.
- Include OpenCode/model versions and a minimal, sanitized reproduction in bug
  reports. Do not upload configuration secrets, real credentials, or private
  session exports.
