import assert from "node:assert/strict"
import test from "node:test"
import { learningWrites } from "./learning-writes.ts"

test("treats skill and config file edits as learning writes", () => {
  assert.equal(learningWrites([
    { tool: "write", input: { filePath: "/work/.opencode/skills/deploy-review/SKILL.md" } },
    { tool: "edit", input: { filePath: "/home/user/.config/opencode/opencode.json" } },
    { tool: "apply_patch", input: { patchText: "*** Add File: .opencode/skills/x/SKILL.md" } },
  ]).length, 3)
})

test("treats bash mutations of skill paths as learning writes", () => {
  assert.equal(learningWrites([
    { tool: "bash", input: { command: "mkdir -p .opencode/skills/deploy-review" } },
    { tool: "bash", input: { command: "rm -rf ~/.config/opencode/skills/old-skill" } },
  ]).length, 2)
})

test("ignores reads, skill loads, and unrelated writes", () => {
  assert.deepEqual(learningWrites([
    { tool: "read", input: { filePath: "/work/.opencode/skills/deploy-review/SKILL.md" } },
    { tool: "skill", input: { name: "skill-mining" } },
    { tool: "write", input: { filePath: "/work/README.md" } },
    { tool: "bash", input: { command: "ls .opencode/skills" } },
  ]), [])
})
