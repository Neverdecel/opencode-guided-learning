# opencode-guided-learning

[![Checks](https://github.com/Neverdecel/opencode-guided-learning/actions/workflows/checks.yml/badge.svg)](https://github.com/Neverdecel/opencode-guided-learning/actions/workflows/checks.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Agent notices. Human decides. OpenCode remembers.**

An [OpenCode](https://opencode.ai) [plugin](https://opencode.ai/docs/plugins/) that notices durable, reusable procedures during normal work and asks before saving them as native [skills](https://opencode.ai/docs/skills/). A skill is one on-demand job, not always-on project rules, an agent, a command, or memory.

It is not a memory store, skill database, or write sandbox. After you approve, saves use OpenCode’s existing file tools and [permissions](https://opencode.ai/docs/permissions/).

> This looks reusable: review the saved Terraform plan with the on-call owner, then apply only that artifact. Save as `terraform-deploy-review` (project skill)?

Reply **yes**, **no**, **make it global**, **rename it**, **add X**, or **merge with Y**. Ordinary work should produce no suggestion.

## Requirements

- [OpenCode](https://opencode.ai) **1.18.30** (tested). The plugin uses experimental hooks; later versions need a compatibility check.

## Install

```sh
git clone https://github.com/Neverdecel/opencode-guided-learning.git
sh opencode-guided-learning/scripts/install.sh
```

That runs `opencode plugin -g` with the checkout’s absolute path (patches global config). `scripts/install.sh --local` is this project only. After npm publish: `opencode plugin -g opencode-guided-learning@0.1.0` (pin the version).

Optional: add the checkout `skills/` directory to `skills.paths` for `skill-mining` and `skill-curation`. **Quit and restart OpenCode** (including its backend when using OpenChamber).

Confirm with `opencode debug config`. Do not paste that output into issues; it can contain secrets. Full steps: [docs/installation.md](docs/installation.md).

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
  "plugin": [["opencode-guided-learning@0.1.0", {
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
| [`scripts/install.sh`](scripts/install.sh) | Clone install via `opencode plugin` |
| [`docs/`](docs/installation.md) | Install, troubleshooting, hook research, [skill entity](docs/skill-definition.md) |

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
