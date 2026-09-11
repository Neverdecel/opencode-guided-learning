import assert from "node:assert/strict"
import test from "node:test"
import type { Hooks, PluginInput, PluginOptions } from "@opencode-ai/plugin"
import plugin from "../src/index.ts"

type Input = Parameters<NonNullable<Hooks["experimental.chat.system.transform"]>>[0]
const input = (sessionID?: string): Input => ({ sessionID, model: {} as Input["model"] })
const hookNames = ["experimental.chat.system.transform", "experimental.session.compacting"]

async function load(options: PluginOptions = {}): Promise<Hooks> {
  const ctx = new Proxy({} as PluginInput, {
    get(_target, key) { assert.fail(`Unexpected host access: ${String(key)}`) },
  })
  return plugin.server(ctx, options)
}

test("registers only context hooks, with no persistence or permission hooks", async () => {
  const hooks = await load()
  assert.deepEqual(Object.keys(hooks).sort(), [...hookNames].sort())
  const output = { system: ["Original system", "Existing instructions"] }
  await hooks["experimental.chat.system.transform"]!(input("session-a"), output)
  assert.deepEqual(output.system.slice(0, 2), ["Original system", "Existing instructions"])
  assert.equal(output.system.length, 3)
  assert.ok(output.system[2].includes("## Guided learning"))
})

test("guidance defines an on-demand skill entity and does not write adjacent artifacts", async () => {
  const hooks = await load()
  const output = { system: [] as string[] }
  await hooks["experimental.chat.system.transform"]!(input("session-a"), output)
  const text = output.system[0] ?? ""
  assert.match(text, /one on-demand job/)
  assert.match(text, /what the skill does, when to load it/)
  assert.match(text, /One job per skill/)
  assert.match(text, /Do not write AGENTS\.md, agents, or commands/)
  assert.match(text, /Never start a generated description with "Use ONLY when"/)
})

test("non-session calls are unchanged", async () => {
  const hooks = await load()
  const output = { system: ["Generate an agent configuration"] }
  await hooks["experimental.chat.system.transform"]!(input(), output)
  assert.deepEqual(output.system, ["Generate an agent configuration"])
})

test("skips hidden and read-only built-in agent systems", async () => {
  const hooks = await load()
  const transform = hooks["experimental.chat.system.transform"]!
  for (const system of [
    ["You are a context summarization agent.\nKeep every section."],
    ["You are a title generator. You output ONLY a thread title.\nNothing else."],
    ["Summarize what was done in this conversation. Write like a pull request description."],
    ["You are a file search specialist. You excel at thoroughly navigating and exploring codebases."],
  ]) {
    const output = { system: [...system] }
    await transform(input("session-a"), output)
    assert.deepEqual(output.system, system)
  }
})

test("disabled plugin registers nothing", async () => {
  assert.deepEqual(await load({ enabled: false }), {})
})

test("repeated transforms are idempotent and independent sessions get guidance", async () => {
  const hooks = await load()
  const transform = hooks["experimental.chat.system.transform"]!
  const output = { system: ["Existing instructions"] }
  await transform(input("session-a"), output)
  const first = structuredClone(output)
  await transform(input("session-a"), output)
  assert.deepEqual(output, first)
  const second = { system: ["Existing instructions"] }
  await transform(input("session-b"), second)
  assert.deepEqual(second, first)
})

test("compaction adds a preservation note and does not replace the prompt", async () => {
  const hooks = await load()
  const compact = hooks["experimental.session.compacting"]!
  const output = { context: ["prior"] as string[], prompt: undefined as string | undefined }
  await compact({ sessionID: "session-a" }, output)
  assert.equal(output.prompt, undefined)
  assert.equal(output.context[0], "prior")
  assert.match(output.context[1] ?? "", /ask rather than infer/)
  const once = structuredClone(output)
  await compact({ sessionID: "session-a" }, output)
  assert.deepEqual(output, once)
})

test("compaction leaves a replaced prompt and its context untouched", async () => {
  const hooks = await load()
  const output = { context: ["keep"], prompt: "custom compaction prompt" }
  await hooks["experimental.session.compacting"]!({ sessionID: "session-a" }, output)
  assert.deepEqual(output, { context: ["keep"], prompt: "custom compaction prompt" })
})

test("ignored labels are encoded as data; options do not leak across instances", async () => {
  const topics = ['editor "preferences"', "multi\nline"]
  const configured = await load({ ignoredTopics: topics })
  const plain = await load()
  const custom = { system: [] as string[] }
  const normal = { system: [] as string[] }
  await configured["experimental.chat.system.transform"]!(input("a"), custom)
  await plain["experimental.chat.system.transform"]!(input("b"), normal)
  assert.ok(custom.system[0].includes(JSON.stringify(topics)))
  assert.ok(!normal.system[0].includes(JSON.stringify(topics)))
})

test("invalid options reject rather than accidentally enabling learning", async () => {
  for (const options of [{ enabled: "false" }, { ignoredTopics: "terraform" },
    { ignoredTopics: [" "] }, { ignoredTopics: [1] }, { threshold: 0.5 }]) {
    await assert.rejects(load(options), TypeError)
  }
})

test("example generated skill has native frontmatter matching its folder", async () => {
  const { readFile } = await import("node:fs/promises")
  const source = await readFile(new URL("../examples/terraform-plan-review/SKILL.md", import.meta.url), "utf8")
  const match = source.match(/^---\nname: (.+)\ndescription: (.+)\n---\n\n([\s\S]+)$/)
  assert.ok(match)
  const [, name, description, body] = match
  assert.equal(name, "terraform-plan-review")
  assert.match(name, /^[a-z0-9]+(-[a-z0-9]+)*$/)
  assert.ok(name.length <= 64)
  assert.ok(description.length >= 1 && description.length <= 1024)
  assert.match(description, /Review and apply/)
  assert.match(description, /Use when preparing, reviewing, or applying/)
  assert.doesNotMatch(description, /^Use ONLY when /)
  assert.ok(body.trim())
})
