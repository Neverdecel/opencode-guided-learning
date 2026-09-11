# Skill entity

Maintainer notes for generation and curation. Install users can skip this;
runtime hooks stay in [research.md](research.md).

A **skill** is one on-demand job: a named folder whose `description` is the only
discovery index, and whose body is the confirmed procedure the agent would get
wrong without it.

It is not always-on rules (`AGENTS.md`), an agent persona, a `/command`, or
memory. Stay silent on those; do not write them.

## Must hold

Procedural, on-demand, discoverable (what + when + trigger terms), non-generic,
confirmed, durable, one trigger family, secret-free.

One job per skill. Split unrelated jobs. Merge if two skills would fire on the
same future prompts and teach the same job. Prefer updating an existing skill.

## Generated `SKILL.md`

- Frontmatter: only native `name` and `description`. Folder matches `name`.
- Description: third person, what it does and when to load it, distinct from
  other known skills, 1–1024 characters. Never `Use ONLY when` (that gate is
  for bundled `skill-mining` / `skill-curation`).
- Body: confirmed steps, constraints, and verification only. Default with an
  escape hatch, not a menu. No inferred rules, rollout counts, generic teaching,
  transcripts, or today's outcome.
- Supporting files only when the confirmed procedure actually needs them.

Projections: always-on guidance in `src/index.ts`; explicit capture in
`skills/skill-mining`; library hygiene in `skills/skill-curation`; shape in
`examples/terraform-plan-review`.
