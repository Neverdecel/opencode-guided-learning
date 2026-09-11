# Installation and maintenance

OpenSkillGen is distributed as a GitHub source checkout. The package/plugin ID
is `opencode-guided-learning`; it has not been published to npm. Do not add that
bare package name to OpenCode's config: use the local source-file URL.

## Install from source

1. Check `opencode --version`. Version 1.18.30 was tested against its actual plugin
   types and session runtime. The experimental hook may change in future releases.
2. Clone `https://github.com/Neverdecel/OpenSkillGen.git` to a permanent location.
3. Add a `file:///.../OpenSkillGen/src/index.ts` entry to the existing `plugin`
   array in the global or project OpenCode config. An absolute file URL avoids
   resolving a relative path against the wrong config directory. On Windows,
   use a URL such as `file:///C:/projects/OpenSkillGen/src/index.ts`.
4. Quit and restart the OpenCode process. Restart the backend as well when a
   frontend such as OpenChamber manages it.

The source imports only TypeScript types from `@opencode-ai/plugin`. OpenCode's
TypeScript loader handles it directly, so no build or runtime dependency install
is required. `npm ci` installs the pinned SDK types and development tools for
contributors. Package metadata remains `private: true` to prevent accidental npm
publication; this does not affect local plugin loading or GitHub visibility.

Global config normally lives at `~/.config/opencode/opencode.json` or
`opencode.jsonc`; respect custom config-directory settings. Project config lives
at the repository root or in `.opencode/`. Preserve comments, provider settings,
permissions, and other plugin entries when editing an existing file.

## Verify installation

Run `opencode debug config` from the project where you intend to use the plugin.
Confirm the resolved plugin list contains the source-file URL. This output can
include private configuration; do not paste the complete output into an issue.

For transport verification, contributors can run the isolated test in
[CONTRIBUTING.md](../CONTRIBUTING.md). That test checks the actual model request,
not merely the presence of a config entry. A lack of learning suggestions during
ordinary work is expected and does not by itself indicate a loading problem.

## Update

From the plugin checkout, inspect local changes and pull the update:

```sh
git status
git pull --ff-only
```

Preserve local edits before updating. Contributors should rerun `npm ci` if the
lockfile changes, then `npm run check` and `npm test`. Restart OpenCode to load the
updated source. For a stable local deployment, keep the checkout at a reviewed
commit instead of following new commits automatically.

## Disable or uninstall

- Temporarily disable: set `enabled: false` in the plugin's options tuple.
- Uninstall: remove its entry from the config where it was added.
- Restart OpenCode after either change. Previously approved skills remain native
  skill files; remove or change them only if that is also your intent.

## Troubleshooting

- **Plugin absent from resolved config:** check the config scope, file URL, and
  custom config-directory environment settings.
- **File moved or deleted:** update the source-file URL and restart.
- **Config rejected:** check against the [official schema](https://opencode.ai/config.json).
  Plugin options belong inside the tuple, not at the config's top level.
- **Changes not reflected:** restart the actual OpenCode backend, not only its UI.
- **Duplicate guidance:** avoid registering the checkout both in `plugin` and as
  an auto-discovered `.opencode/plugins/` file.
- **Agent ignores consent or creates poor skills:** this is a model-behavior
  failure, not a guaranteed write guard. Disable the plugin if needed and report
  a credential-free reproduction with OpenCode/model versions and the relevant
  sanitized tool calls. Never test fixes against a real skill library.

Official references: [plugins](https://opencode.ai/docs/plugins/),
[configuration](https://opencode.ai/docs/config/),
[skills](https://opencode.ai/docs/skills/), and
[permissions](https://opencode.ai/docs/permissions/).
