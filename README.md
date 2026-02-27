# sentry-docs-mcp

An MCP server that generates tailored Sentry integration docs for your codebase. Pass your libraries, get back feature lists and implementation guides an AI agent can follow.

## Tools

**`get-available-features`** — Returns all Sentry features available for your stack.

```json
{ "libs": ["nextjs", "hono"] }
```

Resolves the dominant framework (Next.js > Hono by rank) and returns a deduplicated feature list.

**`get-docs`** — Generates a complete implementation guide for selected features.

```json
{ "libs": ["nextjs"], "features": ["error-monitoring", "session-replay"] }
```

Calls an internal AI agent loaded with skill context to produce step-by-step instructions, code snippets, file paths, and env vars.

## Supported Libraries

| Slug | Ecosystem | Category | Features |
|------|-----------|----------|----------|
| `nextjs` | JS | framework | error-monitoring, tracing, session-replay, profiling, crons, user-feedback, logs |
| `hono` | JS | framework | error-monitoring, tracing, profiling, logs |
| `node` | JS | runtime | error-monitoring, tracing, profiling, logs |
| `bun` | JS | runtime | error-monitoring, tracing, logs |
| `flask` | Python | framework | error-monitoring, tracing, profiling, logs |

## Priority Resolution

When multiple libs are passed, the dominant one is picked by: **framework > runtime > library**, then by rank within category. Unknown libs are ignored.

## Structure

```
src/
  index.ts              Hono app + MCP transport
  mcp.ts                Tool definitions (get-available-features, get-docs)
  agent.ts              generateText() with skill-injected system prompt
  types.ts              SentrySkill, Feature interfaces
  skills/
    registry.ts         Skill lookup + priority resolution
    js/
      nextjs.ts
      hono.ts
      node.ts
      bun.ts
    python/
      flask.ts
```

## Setup

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY

bun install
bun run dev
```

Server starts at `http://localhost:8787/mcp`.

## Adding a New Skill

1. Create `src/skills/<ecosystem>/<slug>.ts` exporting a `SentrySkill` object
2. Register it in `src/skills/registry.ts`

## Deploy

```bash
bun run deploy
```

Runs on Cloudflare Workers.
