import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import test from "node:test"

const namePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/
const skillsRoot = new URL("../skills/", import.meta.url)

async function bundledSkills() {
  const entries = await readdir(skillsRoot, { withFileTypes: true })
  const skills = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const source = await readFile(new URL(`${entry.name}/SKILL.md`, skillsRoot), "utf8")
    const match = source.match(/^---\nname: (.+)\ndescription: (.+)\n---\n\n([\s\S]+)$/)
    assert.ok(match, entry.name)
    const [, name, description, body] = match
    skills.push({ folder: entry.name, name, description, body, source })
  }
  return skills
}

test("every bundled skill is native-valid and gated", async () => {
  const skills = await bundledSkills()
  assert.deepEqual(skills.map((skill) => skill.name).sort(), ["skill-curation", "skill-mining"])
  for (const skill of skills) {
    assert.equal(skill.name, skill.folder)
    assert.match(skill.name, namePattern)
    assert.ok(skill.name.length <= 64)
    assert.ok(skill.description.length >= 1 && skill.description.length <= 1024)
    assert.match(skill.description, /^Use ONLY when /)
    assert.match(skill.body, /not a (write permission|cue)|not permission to/)
    assert.match(skill.body, /Never persist secrets/)
    assert.match(skill.body, /\.opencode\/skills/)
    assert.doesNotMatch(skill.source, /SYNTHETIC-DO-NOT-SAVE|BEGIN [A-Z ]+PRIVATE KEY/)
  }
})

test("skill-mining is capture-from-work, not library cleanup", async () => {
  const mining = (await bundledSkills()).find((skill) => skill.name === "skill-mining")
  assert.ok(mining)
  assert.match(mining.description, /mine|extract|capture|harvest/)
  assert.doesNotMatch(mining.description, /purge|curate existing/)
  assert.match(mining.body, /Do not write until the user approves/)
  assert.match(mining.body, /Mining, silence, or task success is not approval/)
  assert.match(mining.body, /Merging does not authorize deleting/)
})

test("skill-curation is library hygiene, not mining, and keeps sources unless deletion is approved", async () => {
  const curation = (await bundledSkills()).find((skill) => skill.name === "skill-curation")
  assert.ok(curation)
  assert.match(curation.description, /curate|merge|purge/)
  assert.match(curation.description, /Do not use for ordinary work, skill mining/)
  assert.match(curation.body, /Do not write, merge, rename, or delete until the user approves/)
  assert.match(curation.body, /does not authorize deleting the source/)
  assert.match(curation.body, /skill-mining/)
  assert.match(curation.body, /customize-opencode/)
  assert.match(curation.body, /Do not generate new procedural skills here/)
})
