// Real CLI integration with a local fake provider; checks transport, not model compliance.
import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { createServer } from "node:http"
import { promisify } from "node:util"

assert.equal(process.env.GUIDED_LEARNING_CONTAINER, "1", "Use test/live.sh")
const requests: { messages: { role: string; content: unknown }[] }[] = []
const server = createServer(async (req, res) => {
  let body = ""
  for await (const chunk of req) body += chunk
  requests.push(JSON.parse(body))
  res.writeHead(200, { "content-type": "text/event-stream" })
  for (const choice of [
    { index: 0, delta: { role: "assistant", content: "OK" }, finish_reason: null },
    { index: 0, delta: {}, finish_reason: "stop" },
  ]) res.write(`data: ${JSON.stringify({ id: "probe", object: "chat.completion.chunk", created: 1, model: "probe", choices: [choice] })}\n\n`)
  res.end("data: [DONE]\n\n")
})
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
const address = server.address()
assert.ok(address && typeof address !== "string")
try {
  const config = {
    plugin: ["file:///app/src/index.ts"], share: "disabled",
    model: "probe/probe", small_model: "probe/probe",
    provider: { probe: {
      npm: "@ai-sdk/openai-compatible",
      options: { baseURL: `http://127.0.0.1:${address.port}/v1`, apiKey: "fixture" },
      models: { probe: { name: "Probe", limit: { context: 32000, output: 1000 } } },
    } },
  }
  const env = { ...process.env, HOME: "/home/probe", PWD: "/work",
    OPENCODE_DISABLE_DEFAULT_PLUGINS: "1", OPENCODE_DISABLE_EXTERNAL_SKILLS: "1",
    OPENCODE_CONFIG_CONTENT: JSON.stringify(config) }
  const run = async (args: string[]) => {
    const pending = promisify(execFile)("opencode", args, { env, timeout: 60_000, maxBuffer: 2_000_000 })
    pending.child.stdin?.end()
    return pending
  }
  const { stdout } = await run(["run", "--format", "json", "Say OK."])
  assert.ok(requests.some((request) => request.messages.some((message) =>
    message.role === "system" && JSON.stringify(message.content).includes("## Guided learning"))),
  "Guidance must reach the actual model request")
  const events = stdout.split("\n").filter((line) => line.startsWith("{")).map((line) => JSON.parse(line))
  const session = events.find((event) => event.sessionID)?.sessionID
  assert.ok(session)
  const exported = await run(["export", session])
  assert.ok(!exported.stdout.includes("## Guided learning"), "Guidance must not pollute persisted session messages")
  console.log("PASS real CLI: guidance in system request, absent from persisted session export")
} finally {
  server.closeAllConnections()
  await new Promise<void>((resolve) => server.close(() => resolve()))
}
