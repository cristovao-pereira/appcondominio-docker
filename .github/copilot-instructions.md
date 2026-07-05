# Antigravity Kit — MANDATORY Agent Routing

> Rules defined here are always active. Priority: copilot-instructions.md > agents > skills.

## 🤖 INTELLIGENT AGENT AUTO-ROUTING (ALWAYS ACTIVE)

**Before responding to ANY request, silently analyze and auto-select the best specialist.**

### Agent Selection Matrix

| User Intent | Keywords | Selected Agent(s) |
|---|---|---|
| **UI/Frontend** | component, button, layout, style, page, ui, ux, react, next, tailwind, css | `frontend-specialist` |
| **API/Backend** | endpoint, route, api, post, get, service, controller, nestjs, prisma | `backend-specialist` |
| **Database** | schema, migration, query, table, model, relation, seed | `database-architect` + `backend-specialist` |
| **Auth/Login** | login, auth, signup, password, token, jwt, session | `security-auditor` + `backend-specialist` |
| **Bug/Error** | error, bug, not working, broken, fix, crash, falha, erro | `debugger` |
| **Tests** | test, coverage, unit, e2e, spec, vitest, playwright | `test-engineer` |
| **Deploy/Docker** | deploy, docker, compose, ci/cd, production, nginx, ssl | `devops-engineer` |
| **Security** | security, vulnerability, exploit, owasp, xss, injection | `security-auditor` + `penetration-tester` |
| **Performance** | slow, optimize, performance, speed, bundle, lighthouse | `performance-optimizer` |
| **New Feature** | build, create, implement, new, multi-domain | `orchestrator` → multi-agent |

### Response Format (MANDATORY)

When applying an agent, always announce first:

```
🤖 Applying knowledge of `{agent-name}`...
```

### Rules

1. **Silent Analysis** — detect domain from keywords before any response
2. **Read agent file** — load `.agent/agents/{agent}.md` rules before acting
3. **Load skills** — read frontmatter `skills:` from the agent file and load them
4. **Respect explicit mentions** — if user says `@agent-name`, use that agent
5. **Multi-domain** → use `orchestrator`, ask Socratic questions before coding

### 🛑 Socratic Gate (Complex Tasks)

For "build", "create", "implement", "new feature": **ASK minimum 3 questions first** before writing any code.

### 📁 File Dependency Awareness

Before modifying ANY file: check `CODEBASE.md` → identify dependents → update all affected files together.

### 🌐 Language

Respond in the user's language. Code comments/variables remain in English.

---

# context-mode — MANDATORY routing rules

You have context-mode MCP tools
available. These rules are NOT optional — they protect your context window from
flooding. A single unrouted command can dump 56 KB into context and waste the entire
session.

## Think in Code — MANDATORY

When you need to analyze, count, filter,
compare, search, parse, transform, or process data: **write code** that does the
work via `ctx_execute(language, code)` and `console.log()` only the answer. Do
NOT read raw data into context to process mentally. Your role is to PROGRAM the
analysis, not to COMPUTE it. Write robust, pure JavaScript — no npm
dependencies, only Node.js built-ins (`fs`, `path`, `child_process`). Always use
`try/catch`, handle `null`/`undefined`, and ensure compatibility with both Node.js and Bun.
One script replaces ten tool calls and saves 100x context.

## BLOCKED commands
— do NOT attempt these

### curl / wget — BLOCKED
Any terminal command
containing `curl` or `wget` will be intercepted and blocked. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls
in sandbox

### Inline HTTP — BLOCKED

Any terminal command containing
`fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` will be
intercepted and blocked. Do NOT retry with terminal.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch / fetch — BLOCKED
Direct web fetching tools are blocked. Use the
sandbox equivalent.
Instead use:
- `ctx_fetch_and_index(url, source)` then
`ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Terminal / run_in_terminal (>20 lines output)
Terminal is ONLY for:
`git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other
short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### read_file (for analysis)
If you are reading a file to **edit** it → read_file is
correct (edit needs content in context).
If you are reading to **analyze, explore, or
summarize** → use `ctx_execute_file(path, language, code)` instead. Only your
printed summary enters context.

### grep / search (large results)
Search results
can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to
run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary
tool. Runs all commands, auto-indexes output, returns search results. ONE call
replaces 30+ individual calls. Each command: `{label: "descriptive header",
command: "..."}`. Label becomes FTS5 chunk title — descriptive labels improve
search.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed
content. Pass ALL questions as array in ONE call.
3. **PROCESSING**:
`ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution.
Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then
`ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters
context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge
base for later search.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline
text. Return only: file path + 1-line description.
- When indexing content, use
descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
| `ctx purge` | Call the `ctx_purge` MCP tool with confirm: true. Warns before wiping the knowledge base. |

After /clear or /compact: knowledge base and session stats are preserved. Use `ctx purge` if you want
to start fresh.
