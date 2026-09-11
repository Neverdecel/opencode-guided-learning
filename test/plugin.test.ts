import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import type { Hooks, PluginInput, PluginOptions } from "@opencode-ai/plugin"
import plugin from "../src/index.ts"

type Input = Parameters<NonNullable<Hooks["experimental.chat.system.transform"]>>[0]
const input = (sessionID?: string): Input => ({ sessionID, model: {} as Input["model"] })

async function load(options: PluginOptions = {}): Promise<Hooks> {
  // The entire host context is inaccessible: the plugin must not call SDK,
  // filesystem, shell, or session APIs. This is not a model simulator.
  const ctx = new Proxy({} as PluginInput, {
    get(_target, key) { assert.fail(`Unexpected host access: ${String(key)}`) },
  })
  return plugin.server(ctx, options)
}

test("registers only a system-context hook, with no persistence or permission hooks", async () => {
  const hooks = await load()
  assert.deepEqual(Object.keys(hooks), ["experimental.chat.system.transform"])
  const output = { system: ["Original system", "Existing instructions"] }
  await hooks["experimental.chat.system.transform"]!(input("session-a"), output)
  assert.deepEqual(output.system.slice(0, 2), ["Original system", "Existing instructions"])
  assert.equal(output.system.length, 3)
  assert.ok(output.system[2].includes("## Guided learning"))
})

test("non-session calls are unchanged", async () => {
  const hooks = await load()
  const output = { system: ["Generate an agent configuration"] }
  await hooks["experimental.chat.system.transform"]!(input(), output)
  assert.deepEqual(output.system, ["Generate an agent configuration"])
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

test("example has the documented native skill frontmatter and matching folder", async () => {
  const source = await readFile(new URL("../examples/terraform-plan-review/SKILL.md", import.meta.url), "utf8")
  const match = source.match(/^---\nname: (.+)\ndescription: (.+)\n---\n\n([\s\S]+)$/)
  assert.ok(match)
  const [, name, description, body] = match
  assert.equal(name, "terraform-plan-review")
  assert.match(name, /^[a-z0-9]+(-[a-z0-9]+)*$/)
  assert.ok(name.length <= 64)
  assert.ok(description.length >= 1 && description.length <= 1024)
  assert.ok(body.trim())
})
