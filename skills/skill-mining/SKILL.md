---
name: skill-mining
description: Use ONLY when the user explicitly asks to mine, extract, capture, or harvest skills from the current work. Do not use for ordinary tasks or the plugin's unsolicited learning suggestions.
---

# Skill mining

The user asked to mine skills. That is initiative to **propose** captures from this work, not a write permission and not a cue to suggest mining later on its own.

## Mine

From this conversation, extract only durable, reusable, specific knowledge the user would otherwise explain again: repeated workflows, consequential corrections, local conventions, proven troubleshooting, decision rules.

Skip temporary state, one-off commands, repository-obvious facts, generic knowledge, speculation, secrets, credentials, and casual preferences. When uncertain, omit the candidate.

Load relevant existing skills first. Classify each candidate as new, improvement, duplicate, conflict, or temporary. Drop duplicates and temporary knowledge. Prefer updating an existing skill over creating another.

## Propose

List each keeper in at most two short sentences: the rule, action (create or update), name, and scope (project vs global). No wizard, dump of the transcript, or unsolicited outline.

Infer project scope for repository/team procedures; global only for how this user works across projects. If nothing qualifies, say so and stop.

## Save

Do not write until the user approves the specific create/update (yes, rename, make it global, add X, merge with Y). Mining, silence, or task success is not approval. Merging does not authorize deleting a source skill unless that was explicit.

After approval, use native file tools. Project: `.opencode/skills/<name>/SKILL.md`. Global: `~/.config/opencode/skills/<name>/SKILL.md`. Frontmatter `name` must match the folder (`^[a-z0-9]+(-[a-z0-9]+)*$`, ≤64). Description 1–1024 characters, when to use it. Body: confirmed rules, constraints, verification only — no transcripts, rollout counts, or today's outcome. Never persist secrets. Show the path. Restart OpenCode to rediscover it.
