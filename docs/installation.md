# Installation and troubleshooting

OpenSkillGen is a **source checkout**, not an npm package. The plugin id is
`opencode-guided-learning`. Do not put that bare name in OpenCode’s `plugin`
array; use a `file:///` URL to `src/index.ts`.

Official references: [plugins](https://opencode.ai/docs/plugins/),
[configuration](https://opencode.ai/docs/config/),
[skills](https://opencode.ai/docs/skills/),
[permissions](https://opencode.ai/docs/permissions/).

## Install

1. Check `opencode --version`. **1.18.30** was tested against its plugin types
   and session runtime. Experimental hooks may change.
2. Clone `https://github.com/Neverdecel/OpenSkillGen.git` to a path you will
   keep. Moving the checkout later requires updating the config URL.
3. Add `file:///absolute/path/to/OpenSkillGen/src/index.ts` to the existing
   `plugin` array in global or project config. An absolute file URL avoids
   resolving against the wrong config directory. Windows:
   `file:///C:/projects/OpenSkillGen/src/index.ts`.
4. Optional: add the checkout’s `skills` directory to `skills.paths` (absolute
   path) so `skill-mining` and `skill-curation` are invocable. Do not copy them
   into another project’s `.opencode/skills/` unless you want a fork.
5. Quit and restart OpenCode. Restart the backend as well when a frontend such
   as OpenChamber manages it.

OpenCode’s TypeScript loader runs `src/index.ts` directly. No build or
`npm install` is required to use the plugin. `npm ci` is for contributors
(pinned SDK types and tests). `package.json` is `private: true` so the package
is not published by accident; that does not affect GitHub or local loading.

Global config: `~/.config/opencode/opencode.json` or `opencode.jsonc` (honor a
custom config directory). Project config: repository root or `.opencode/`.
Preserve comments, providers, permissions, and other plugin entries.

## Verify

From the project where you use the plugin:

```sh
opencode debug config
```

The resolved plugin list should include the source-file URL. With bundled
skills enabled, `opencode debug skill` should list `skill-mining` and
`skill-curation`. That output can include private configuration — do not paste
it into an issue.

A lack of learning suggestions during ordinary work is expected. Contributors
can run the isolated transport test in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Update

```sh
git status
git pull --ff-only
```

Keep local edits; pin a reviewed commit for a stable install. Restart OpenCode
after pulling. Contributors should rerun `npm ci` when the lockfile changes,
then `npm run check` and `npm test`.

## Disable or uninstall

- Disable: `"enabled": false` in the plugin options tuple.
- Uninstall: remove the plugin (and `skills.paths` entry, if added) from the
  config where you installed it.
- Restart OpenCode. Previously saved skills remain on disk until you delete
  them.

## Troubleshooting

- **Not in resolved config:** check config scope, the `file:///` URL, and
  `XDG` / custom config-directory settings.
- **Checkout moved:** update the URL and restart.
- **Schema error:** validate against [https://opencode.ai/config.json](https://opencode.ai/config.json).
  Options belong in the plugin tuple, not at the top level of the config.
- **Stale behavior:** restart the OpenCode backend, not only the UI.
- **Duplicate guidance:** do not also drop `src/index.ts` into
  `.opencode/plugins/` or `~/.config/opencode/plugins/` while it is listed in
  `plugin`.
- **Ignores consent or writes a poor skill:** model behavior, not a write
  guard. Disable the plugin if needed. File a credential-free issue with
  OpenCode/model versions and sanitized tool calls. Never test against a real
  skill library.
