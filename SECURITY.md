# Security

Report vulnerabilities privately: **Security → Report a vulnerability** on
[Neverdecel/OpenSkillGen](https://github.com/Neverdecel/OpenSkillGen/security/advisories/new).

Do not open a public issue or pull request with exploit details, secrets, or
credentials.

## Scope

This plugin injects instructions. It is **not** a filesystem sandbox. Skill
writes use OpenCode’s normal tools and permissions. Conversational approval is
not a security boundary.

In scope: unexpected code execution from this repository, secret leakage in
shipped examples or docs, install paths that load unintended code.

Out of scope: a model ignoring consent, writing a low-quality skill, or
following a user request to store secrets — those are instruction-following
failures. Disable the plugin and use OpenCode permissions if you need a guard.

Supported: the current `main` branch of this checkout, tested with OpenCode
1.18.30.
