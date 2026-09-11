import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { fileURLToPath } from "node:url"
import plugin from "../src/index.ts"

const root = new URL("../", import.meta.url)

test("package.json is opencode plugin-ready", async () => {
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"))
  assert.equal(pkg.name, "opencode-guided-learning")
  assert.equal(plugin.id, pkg.name)
  assert.equal(pkg.main, "./src/index.ts")
  assert.equal(pkg.exports["."], "./src/index.ts")
  assert.equal(pkg.exports["./server"], "./src/index.ts")
  assert.ok(pkg.files.includes("src/index.ts"))
  assert.ok(pkg.files.includes("skills"))
  assert.equal(typeof pkg.engines?.opencode, "string")
  assert.equal(pkg.private, undefined)
  assert.equal(pkg.dependencies?.["@opencode-ai/plugin"], undefined)
  assert.equal(pkg.devDependencies["@opencode-ai/plugin"], "1.18.30")
})

test("install script is valid shell", () => {
  const script = fileURLToPath(new URL("scripts/install.sh", root))
  const result = spawnSync("sh", ["-n", script], { encoding: "utf8" })
  assert.equal(result.status, 0, result.stderr)
})
