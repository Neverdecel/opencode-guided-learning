export type ToolCall = { tool: string; input: unknown }

export function learningWrites(tools: ToolCall[]) {
  return tools.filter(({ tool, input }) => {
    const blob = JSON.stringify(input ?? {})
    const target = /SKILL\.md|\.opencode\/skills|\/skills\/|opencode\.json|\.opencode\/agents?\/|config\/opencode\/agents?/i.test(blob)
    if (!target) return false
    if (tool === "write" || tool === "edit" || tool === "apply_patch") return true
    return tool === "bash" && /mkdir|tee |>\s|>>|cp |mv |rm |touch /i.test(blob)
  })
}
