# Installation and troubleshooting

The package, GitHub repo, and plugin id are `opencode-guided-learning`.
Install with OpenCode’s `plugin` command, which installs the package and
patches `opencode.json`.

Official references: [plugins](https://opencode.ai/docs/plugins/),
[configuration](https://opencode.ai/docs/config/),
[skills](https://opencode.ai/docs/skills/),
[permissions](https://opencode.ai/docs/permissions/).

## Install

1. Check `opencode --version`. **1.18.30** was tested against its plugin types
   and session runtime. Experimental hooks may change.
2. Install into global config (all projects) or omit `--global` / `-g` for the
   current project:

   From a clone (works without npm):

   ```sh
    git clone https://github.com/Neverdecel/opencode-guided-learning.git
    sh opencode-guided-learning/scripts/install.sh
   ```

   `scripts/install.sh --local` patches this project only. `--force` replaces
   an existing `opencode-guided-learning` entry. Windows:

   ```bat
    opencode plugin -g C:\projects\opencode-guided-learning
   ```

   After the package is published:

   ```sh
   opencode plugin -g opencode-guided-learning@0.1.0
   ```

   Pin the version. OpenCode caches `name@latest` and does not refresh it.
3. Optional: add the checkout’s `skills` directory to `skills.paths` (absolute
   path) so `skill-mining` and `skill-curation` are invocable. The installer
   prints that path. Do not copy them into another project’s
   `.opencode/skills/` unless you want a fork. npm installs keep skills inside
   the cached package; prefer the clone path if you want those skills.
4. Quit and restart OpenCode. Restart the backend as well when a frontend such
   as OpenChamber manages it.

OpenCode’s TypeScript loader runs `src/index.ts` directly. No build or
`npm install` is required to use a clone. `npm ci` is for contributors
(pinned SDK types and tests).

If you previously listed `file:///…/src/index.ts`, remove that entry after
switching to `opencode plugin`. `--force` does not replace `file://` specs, and
both would load.

Global config: `~/.config/opencode/opencode.json` or `opencode.jsonc` (honor a
custom config directory). Project config: repository root or `.opencode/`.
Preserve comments, providers, permissions, and other plugin entries.

## Verify

From the project where you use the plugin:

```sh
opencode debug config
```

The resolved plugin list should include the checkout directory or
`opencode-guided-learning@…`. With bundled skills enabled, `opencode debug skill`
should list `skill-mining` and `skill-curation`. That output can include private
configuration — do not paste it into an issue.

A lack of learning suggestions during ordinary work is expected. Contributors
can run the isolated transport test in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Update

Clone:

```sh
git status
git pull --ff-only
```

Keep local edits; pin a reviewed commit for a stable install. Restart OpenCode
after pulling.

npm pin (new version uses a new cache directory):

```sh
opencode plugin -g -f opencode-guided-learning@0.1.1
```

Contributors should rerun `npm ci` when the lockfile changes, then
`npm run check` and `npm test`.

## Disable or uninstall

- Disable: `"enabled": false` in the plugin options tuple.
- Uninstall: remove the plugin (and `skills.paths` entry, if added) from the
  config where you installed it.
- Restart OpenCode. Previously saved skills remain on disk until you delete
  them.

## Troubleshooting

- **Not in resolved config:** check config scope, the plugin spec, and
  `XDG` / custom config-directory settings.
- **Checkout moved:** rerun `scripts/install.sh --force` (or pass the new
  absolute path to `opencode plugin`) and restart.
- **Schema error:** validate against [https://opencode.ai/config.json](https://opencode.ai/config.json).
  Options belong in the plugin tuple, not at the top level of the config.
- **Stale behavior:** restart the OpenCode backend, not only the UI.
- **Duplicate guidance:** remove old `file:///` entries; do not also drop
  `src/index.ts` into `.opencode/plugins/` or `~/.config/opencode/plugins/`
  while it is listed in `plugin`.
- **Ignores consent or writes a poor skill:** model behavior, not a write
  guard. Disable the plugin if needed. File a credential-free issue with
  OpenCode/model versions and sanitized tool calls. Never test against a real
  skill library.
