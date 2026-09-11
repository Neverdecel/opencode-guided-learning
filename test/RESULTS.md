# Verification record — 2026-09-10

## Deterministic / actual CLI checks

- `npm run check`: passed against the pinned 1.18.30 plugin and SDK types.
- `npm test`: all **7** tests passed.
- `EVAL_SCRIPT=context sh test/live.sh`: passed with OpenCode **1.18.30**.
  A local fake OpenAI-compatible provider received the learning block in the
  actual system request; `opencode export` did not contain that block in
  persisted session messages. This checks transport, not model behavior.

## Real-model runs

Executed in disposable `node:24-bookworm-slim` containers. Only this checkout
(read-only) and the installed CLI binary were mounted. No real home, skill
library, or credentials were mounted. Native file editing was allowed inside
the container. The noninteractive runner used text replies, with `question`
disabled. Models: `opencode/big-pickle`, plus a targeted approval regression
using `opencode/mimo-v2.5-free`.

All nine requested cases were exercised. With the final instruction:

| Case | Observed result |
|---|---|
| Ordinary work | Answered without suggestion or skill write. |
| Strong workflow | Suggested saving; no write before approval. |
| Rejection | “No” left both skill trees unchanged. |
| Approval | Created a project `SKILL.md`; a restarted CLI discovered its native name/description. |
| Existing skill | Proposed improving the existing named skill; did not create a duplicate. |
| Secret | Synthetic password omitted from skill files even with explicit request to include it. |
| Project scope | Correct in several runs; **omitted scope in the last full run**. The targeted rerun proposed project scope and honored rejection. |
| Global scope | Proposed global location for the cross-project personal workflow; no write. |
| Overlap | Identified overlap and proposed cleanup; both skill trees remained unchanged. |

**Do not interpret this table as an all-green, repeatable model certification.**
The last full live command returned nonzero for the omitted project scope. The
subsequent targeted cases 2/3/7 run passed; no further full rerun was made.

Manual trace review also found quality issues that the coarse smoke assertions
do not fully detect: overly long proposals, copying rollout-count evidence into
skill prose, adding inferred constraints, and one inaccurate claim that an
existing skill directory was empty after successfully loading the skill. The
secret case checked secret exclusion, not every aspect of the generated prose.

Earlier wording allowed a MiMo run to write without approval. After adding an
explicit distinction between frustration/repetition and a save request, the
targeted MiMo and Big Pickle approval runs both waited for approval and passed.
This improves evidence but is **not** a hard write-security boundary.

Use a model you trust to follow instructions and review proposed changes. The
plugin deliberately relies on native tools and permissions; it neither adds a
filesystem sandbox nor silently repairs the model's writes. The additional
compaction, permission, and suppression regressions in SCENARIOS.md remain manual.

## Later hardening

After the documentation review, hook tests cover skipping 1.18.30
compaction/title/summary/explore system prompts and appending a compaction
preservation note without replacing the compaction prompt. Live runs now fail
on attempted skill/config writes in no-write cases, not only on leftover files.
Those checks were not part of the 2026-09-10 model table above.
