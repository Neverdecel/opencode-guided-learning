---
name: skill-curation
description: Use ONLY when the user explicitly asks to review, curate, merge, consolidate, or purge existing OpenCode skills. Do not use for ordinary work, skill mining, or unsolicited cleanup.
---

# Skill curation

The user asked to curate the skill library. That is initiative to **inspect and propose** library changes, not permission to merge, rewrite, or delete, and not a cue to curate later on its own.

## Inspect

Discover skills OpenCode already knows (native `skill` listing and `SKILL.md` under project `.opencode/skills` and global `~/.config/opencode/skills`). Load only what you need to judge overlap. Do not dump bodies into the reply.

Skip bundled plugin skills (`skill-mining`, `skill-curation`) and built-ins such as `customize-opencode` unless the user named them. Do not invent skills that are not on disk.

Judge each skill as one on-demand job whose description is the discovery index and whose body is the procedure the agent would get wrong without it.

Look for:

- Description missing what or when, first person, too broad/narrow, or colliding trigger terms with another skill
- Body mixing two jobs (split) or two skills teaching the same job (merge)
- Always-on conventions stored as a skill (propose delete; do not write AGENTS.md)
- Generic model knowledge, inferred/unconfirmed rules, evidence or motivation in the body, equal-option menus, vague names (`helper`, `utils`)
- Significant overlap, contradictions, obsolete instructions, unnecessary fragmentation, a clearly better replacement, empty/broken frontmatter, or secrets that should never have been stored

When uncertain, leave the skill alone.

## Propose

For each issue, at most two short sentences: the problem, action (merge / edit / split / delete), exact skill name(s), and scope. No wizard or full rewrite in the proposal.

If nothing needs changing, say so and stop. Do not generate new procedural skills here; that is `skill-mining`.

## Apply

Do not write, merge, rename, or delete until the user approves that specific operation. Reviewing the library, listing overlap, or silence is not approval. Merging into a target does not authorize deleting the source unless the user said to delete it.

After approval, use native file tools. Read before edit. Preserve unrelated sections and supporting files. Keep valid `name`/`description` frontmatter; folder name must match. Generated descriptions stay third person, what+when+triggers, never "Use ONLY when". Never persist secrets; strip them if that is the approved edit. Show each path changed. Restart OpenCode to refresh discovery.
