# Contributing

- Keep runtime code in `src/index.ts` small. Reuse native skill discovery and file tools. Do not add a consent parser or write interceptor.
- Preserve the human-approved learning contract. No autonomous persistence, background work, or separate memory store.
- Inspect the pinned OpenCode plugin/SDK TypeScript types before changing hooks.
- Run `npm run check` and `npm test`. Use `test/SCENARIOS.md` for model-behavior changes; never claim a prompt-string test proves model compliance.
- Keep examples credential-free. Never run evaluation writes against a real skill library.
