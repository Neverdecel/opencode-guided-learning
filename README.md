# OpenSkillGen

[![Checks](https://github.com/Neverdecel/OpenSkillGen/actions/workflows/checks.yml/badge.svg)](https://github.com/Neverdecel/OpenSkillGen/actions/workflows/checks.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Agent notices. Human decides. OpenCode remembers.**

A lightweight [OpenCode plugin](https://opencode.ai/docs/plugins/) for user-guided
learning. During normal work, it nudges the agent to notice exceptionally useful,
durable procedures and ask whether to save them as native skills.

> This looks reusable: review the saved Terraform plan with the on-call owner,
> then apply only that artifact. Save as `terraform-deploy-review` (project skill)?

Reply naturally: **yes**, **no**, **make it global**, **rename it**, **add X**, or
**merge with Y**. Ordinary work should produce no suggestion. Task completion
comes first.

## Install

Tested with **OpenCode 1.18.30**. The plugin uses an experimental hook; later
versions need compatibility verification. Node.js 24+ and npm are needed for
development checks, not for OpenCode to load the TypeScript source.

Clone the repository to a permanent location:

```sh
git clone https://github.com/Neverdecel/OpenSkillGen.git
```

Append its **absolute source-file URL** to `plugin` in
`~/.config/opencode/opencode.json` for all projects, or your project's
`opencode.json` for that project only:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///absolute/path/to/OpenSkillGen/src/index.ts"]
}
```

To invoke **skill-mining** and **skill-curation**, also add the checkout's
`skills` directory:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///absolute/path/to/OpenSkillGen/src/index.ts"],
  "skills": { "paths": ["/absolute/path/to/OpenSkillGen/skills"] }
}
```

Replace the example paths and preserve existing config entries. OpenCode loads
the plugin file directly: **no build or npm publication is required**. Keep the
checkout at those paths. **Quit and restart OpenCode** (including its backend
when using OpenChamber). See [installation and troubleshooting](docs/installation.md).

## Behavior

- **Conservative:** confirmed workflows, meaningful corrections, team procedures,
  and proven troubleshooting. Skip generic advice, temporary state, and guesses.
- **Existing skills first:** load relevant native skills; prefer updating them
  over creating duplicates. Suggest cleanup only when overlap or conflicts arise
  during actual work. Changes and deletions require explicit approval.
- **Two scopes:** project/team knowledge goes in
  `.opencode/skills/<name>/SKILL.md`; general user workflows go in
  `~/.config/opencode/skills/<name>/SKILL.md`. You can override the proposed scope.
- **Concise skills:** reusable rules and verification, not transcripts or secrets.
  See the [example generated skill](examples/terraform-plan-review/SKILL.md).
- **On demand:** invoke `skill-mining` to extract candidates from the current
  work, or `skill-curation` to review the existing library for merges, edits, or
  deletions. Neither is a write permission. See
  [skills/skill-mining/SKILL.md](skills/skill-mining/SKILL.md) and
  [skills/skill-curation/SKILL.md](skills/skill-curation/SKILL.md).

## Configuration

Both options are optional; the default is enabled and conservative.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [["file:///absolute/path/to/OpenSkillGen/src/index.ts", {
    "enabled": true,
    "ignoredTopics": ["personal editor preferences", "release-notes"]
  }]]
}
```

Ignored topics are natural-language labels or skill names, not regexes. “Never
suggest this kind again” authorizes saving that preference in these options.
Restart after config changes or skill writes to refresh discovery.

## Architecture and limits

One source file appends guidance through `experimental.chat.system.transform`
and a short note through `experimental.session.compacting`. It skips 1.18.30
hidden/read-only built-in system prompts (compaction, title, summary, explore)
because that hook has no agent id. It uses native skill discovery and editing
tools. No additional model calls, background work, skill database, write
interceptor, or automatic pruning.

**Consent and secret exclusion are model instructions, not a filesystem security
boundary.** Existing OpenCode permissions still apply. Live evaluations have
shown inconsistent scope, verbosity, and skill quality, plus an earlier
unapproved write with weaker wording. Read the [verification record](test/RESULTS.md);
passing hook tests does not prove model compliance.

## Contributing

```sh
npm ci
npm run check
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for isolated CLI/model tests and
[research notes](docs/research.md) for the V1/V2 API decision. Changes to
`main` go through pull requests; the `check` workflow must pass.

## License

[MIT](LICENSE). See [SECURITY.md](SECURITY.md) to report a vulnerability.
