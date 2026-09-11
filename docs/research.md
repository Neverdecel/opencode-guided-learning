# API and design notes — 2026-09-10

Maintainer notes for hook and runtime changes. Users installing the plugin can
skip this file; see the [README](../README.md) and
[installation](installation.md) instead.

## Inspected before implementation

- Installed CLI: `opencode --version` → **1.18.30**; npm package metadata agrees.
- Official [plugins](https://opencode.ai/docs/plugins/),
  [rules/instructions](https://opencode.ai/docs/rules/),
  [tools](https://opencode.ai/docs/tools/),
  [custom tools](https://opencode.ai/docs/custom-tools/),
  [skills](https://opencode.ai/docs/skills/),
  [session SDK](https://opencode.ai/docs/sdk/), and
  [configuration schema](https://opencode.ai/config.json).
- Version-pinned [V2 Promise API guide](https://github.com/anomalyco/opencode/blob/v1.18.30/packages/plugin/src/v2/promise/README.md),
  `context.ts`, `plugin.ts`, `agent.ts`, `skill.ts`; published 1.18.30 `.d.ts`
  files from npm, including SDK `AgentV2Info`.
- Core `config/plugin/external.ts` accepts a default `{ id, setup }` export and
  passes native plugin options to the Promise adapter. `AgentV2Info.system`
  is the system instruction string; V2 uses `id`, not the V1 agent `name`.

The installed package exports `@opencode-ai/plugin/v2/promise`: `define({ id,
setup })`, with `ctx.agent.transform(callback)` and synchronous draft `list/update`
operations. An initial implementation used this API. An actual isolated CLI
`debug agent build` check revealed that it did not affect the normal session
agent. Inspecting `packages/opencode/src/agent/agent.ts` confirmed that the V1
agent path still builds its own agents from config rather than V2 transforms.
Export availability is not end-to-end support for the needed extension point.

V1's `experimental.chat.system.transform` and
`experimental.session.compacting` can mutate context without user-message
insertion. V2's public Promise context has no session/tool hook namespace in
this release. Therefore the implementation uses the actual session path's
`experimental.chat.system.transform` hook, typed against the pinned published
`PluginModule`/`Hooks` definitions. It requires a session ID and appends one system
block per request (idempotently).

That hook's input is only `{ sessionID?, model }`. Compaction, title, summary,
and explore still have session IDs, so agent-id filtering is impossible.
1.18.30 request prep joins the agent prompt into `output.system[0]` before the
hook runs; the plugin skips injection when that text contains the distinctive
built-in prefixes from `packages/opencode/src/agent/agent.ts`. `general` and
other custom subagents still receive guidance; remaining suppression is a
behavioral instruction. Prefixes are version-coupled and must be rechecked on
OpenCode upgrades.

`experimental.session.compacting` adds a short preservation note to
`output.context` and never sets `output.prompt` (that would replace OpenCode's
compaction prompt). If another plugin already set `prompt`, the note is skipped
because OpenCode ignores `context` in that case.

The plugin does not maintain pending approvals outside the session; uncertain
or lost approval must be clarified, never inferred. It does not intercept
writes: filesystem permissions remain OpenCode's; natural-language consent
remains the model's.

Native skills already advertise name/description and load bodies on demand.
V2 `skill.transform` contributes sources, not a skill-write API. No additional
catalog or custom write tool is needed. The filesystem tool permissions remain
OpenCode's responsibility; natural-language consent remains the model's.

## Small-plugin inspiration

- [opencode-shell-strategy](https://github.com/JRedeker/opencode-shell-strategy):
  now a small instruction-file integration. Useful precedent for teaching a
  capability without implementing a runtime policy engine.
- [opencode-skillful](https://github.com/zenobi-us/opencode-skillful/blob/main/src/index.ts):
  inspected discovery/loading and silent `noReply` injection. Modern native
  skills replace its discovery need here; persisted message injection would
  conflict with this project's desired architecture.
- [opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session/blob/main/index.ts):
  inspected its small hook-based entrypoint. Its session bookkeeping and
  telemetry are unnecessary here.

No implementation was copied. No threshold scores, timers, write interception,
regex-based consent parser, or custom persistence layer were introduced.
