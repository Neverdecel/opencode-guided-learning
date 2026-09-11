# OpenSkillGen

[![Checks](https://github.com/Neverdecel/OpenSkillGen/actions/workflows/checks.yml/badge.svg)](https://github.com/Neverdecel/OpenSkillGen/actions/workflows/checks.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Agent notices. Human decides. OpenCode remembers.**

An [OpenCode](https://opencode.ai) [plugin](https://opencode.ai/docs/plugins/) that notices durable, reusable procedures during normal work and asks before saving them as native [skills](https://opencode.ai/docs/skills/).

It is not a memory store, skill database, or write sandbox. After you approve, saves use OpenCode’s existing file tools and [permissions](https://opencode.ai/docs/permissions/).

> This looks reusable: review the saved Terraform plan with the on-call owner, then apply only that artifact. Save as `terraform-deploy-review` (project skill)?

Reply **yes**, **no**, **make it global**, **rename it**, **add X**, or **merge with Y**. Ordinary work should produce no suggestion.

## Requirements

- [OpenCode](https://opencode.ai) **1.18.30** (tested). The plugin uses experimental hooks; later versions need a compatibility check.
- A git clone of this repository at a stable path.

**Not published to npm.** Do not add `opencode-guided-learning` as a package name in `plugin`. Load the source file URL instead.

## Install

```sh
git clone https://github.com/Neverdecel/OpenSkillGen.git
```

Add the **absolute** source-file URL to `plugin` in `~/.config/opencode/opencode.json` (all projects) or the project’s `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///absolute/path/to/OpenSkillGen/src/index.ts"],
  "skills": { "paths": ["/absolute/path/to/OpenSkillGen/skills"] }
}
```

`skills.paths` is optional; it enables the bundled `skill-mining` and `skill-curation` skills. Keep existing config entries. **Quit and restart OpenCode** (including its backend when using OpenChamber).

Windows example: `file:///C:/projects/OpenSkillGen/src/index.ts`.

Confirm with `opencode debug config` (the resolved plugin list should include the file URL). Do not paste that output into issues; it can contain secrets. Full steps and troubleshooting: [docs/installation.md](docs/installation.md).

## Usage

| You | Plugin |
| --- | --- |
| Ordinary work | No extra chatter |
| Confirm a durable team or personal procedure | Short save proposal at a stopping point |
| Approve, reject, rename, or merge | Writes only after that reply |
| Ask to mine or curate skills | Uses bundled skills if `skills.paths` is set |

- **Project skills** (this repository only): `.opencode/skills/<name>/SKILL.md`
- **Global skills** (how you work across projects): `~/.config/opencode/skills/<name>/SKILL.md`

Example of a saved skill: [examples/terraform-plan-review/SKILL.md](examples/terraform-plan-review/SKILL.md). Bundled skills are not copied into other projects unless you want a fork.

## Configuration

Both options are optional. Defaults: enabled, conservative, no ignored topics.

| Option | Type | Meaning |
| --- | --- | --- |
| `enabled` | boolean | `false` registers no hooks |
| `ignoredTopics` | nonempty strings | Labels or skill names to never suggest (not regexes) |

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [["file:///absolute/path/to/OpenSkillGen/src/index.ts", {
    "enabled": true,
    "ignoredTopics": ["personal editor preferences", "release-notes"]
  }]]
}
```

“Never suggest this kind again” may record that label in `ignoredTopics` of the existing config. Restart after config changes or skill writes.

## Limits

The runtime is one file: it appends guidance and a compaction note. No extra model calls, background work, or separate memory.

**Consent and secret exclusion are model instructions, not a filesystem guard.** Hook tests do not prove model compliance. Live evaluations have shown inconsistent scope, verbosity, and skill quality, and an earlier unapproved write with weaker wording. See [test/RESULTS.md](test/RESULTS.md).

## Repository

| Path | Role |
| --- | --- |
| [`src/index.ts`](src/index.ts) | Plugin (`id`: `opencode-guided-learning`) |
| [`skills/`](skills/) | Opt-in mining and curation skills |
| [`examples/`](examples/) | Sample generated skill (not auto-discovered) |
| [`test/`](test/) | Hook tests and isolated live eval |
| [`docs/`](docs/installation.md) | Install, troubleshooting, hook research |

## Contributing

PRs target `main`. The `check` CI job must pass.

```sh
npm ci
npm run check
npm test
```

Node.js 24+ is for development checks only; OpenCode loads the TypeScript source directly. See [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md), and [docs/research.md](docs/research.md).

## License

[MIT](LICENSE). Vulnerability reports: [SECURITY.md](SECURITY.md).
