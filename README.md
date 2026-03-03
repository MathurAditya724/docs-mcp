# sentry-docs-mcp

An MCP server that provides Sentry integration knowledge to AI agents. Pass your libraries, get back feature lists and implementation guides. No LLM inside — responses are deterministic, assembled from pre-authored skills.

Designed to be consumed by an AI agent that initializes Sentry in a user's project. The agent queries this MCP to understand what features are available for the user's stack and how to implement them.

## Connect

The server runs on Cloudflare Workers and exposes a single MCP endpoint via Streamable HTTP:

```
http://localhost:8080/mcp
```

### MCP client config

```json
{
  "mcpServers": {
    "sentry-docs": {
      "type": "streamable-http",
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

## Tools

### `get-available-features`

Given the libraries/frameworks in the user's codebase, returns all Sentry features that can be enabled.

**Input:**

```json
{ "libs": ["hono", "cloudflare"] }
```

**Response:**

```json
{
  "dominantLib": "cloudflare",
  "matchedLibs": ["cloudflare", "hono"],
  "unmatchedLibs": [],
  "features": [
    { "slug": "error-monitoring", "name": "Error Monitoring", "description": "...", "lib": "cloudflare" },
    { "slug": "tracing", "name": "Tracing", "description": "...", "lib": "cloudflare" },
    { "slug": "logs", "name": "Logs", "description": "...", "lib": "cloudflare" }
  ]
}
```

- `dominantLib` — the primary framework/runtime that drives the Sentry setup. Picked by priority: framework > runtime > library, then by rank within category.
- `matchedLibs` — all libs that matched a known skill.
- `unmatchedLibs` — libs the caller passed that we don't have skills for. Tells you what we can't help with.
- `features` — deduplicated list of Sentry features available across all matched libs.

### `get-docs`

Given the user's libs and the features they want, returns a structured implementation guide.

**Input:**

```json
{ "libs": ["hono", "cloudflare"], "features": ["error-monitoring", "tracing", "logs"] }
```

**Response:**

```json
{
  "stack": {
    "dominant": "cloudflare",
    "secondary": ["hono"],
    "ecosystem": "javascript"
  },
  "packages": ["@sentry/cloudflare"],
  "gettingStarted": "## Cloudflare Workers & Pages Setup\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/cloudflare --save\n```\n...",
  "features": [
    {
      "slug": "error-monitoring",
      "name": "Error Monitoring",
      "setup": "Install the @sentry/cloudflare package, add the nodejs_compat compatibility flag...",
      "code": "import * as Sentry from \"@sentry/cloudflare\";\n\nexport default Sentry.withSentry(...)",
      "lib": "cloudflare"
    }
  ],
  "secondaryPatterns": [
    {
      "lib": "hono",
      "description": "How to wire Sentry into a Hono app via middleware",
      "setup": "...",
      "code": "..."
    }
  ]
}
```

- `gettingStarted` — full setup guide from the dominant skill. Appears once. Contains install commands, init code, file paths, and verification steps.
- `features` — implementation details for each requested feature. Each has `setup` (prose instructions) and `code` (copy-pasteable snippet).
- `secondaryPatterns` — additional wiring needed for secondary libs (e.g. Hono middleware on top of Cloudflare runtime). Only present when the stack has secondary libs.

## Typical agent workflow

1. Scan the user's project to identify frameworks, runtimes, and libraries.
2. Call `get-available-features` with the identified libs.
3. Present the available features to the user or select all.
4. Call `get-docs` with the libs and selected features.
5. Follow the `gettingStarted` guide to install and initialize Sentry.
6. Implement each feature using the `setup` instructions and `code` snippets.
7. If `secondaryPatterns` exist, apply those on top of the base setup.

## Supported skills

| Slug | Ecosystem | Category | Sentry Package | Features |
|------|-----------|----------|----------------|----------|
| `nextjs` | JavaScript | framework | `@sentry/nextjs` | error-monitoring, tracing, session-replay, profiling, logs |
| `cloudflare` | JavaScript | runtime | `@sentry/cloudflare` | error-monitoring, tracing, logs |
| `node` | JavaScript | runtime | `@sentry/node` | error-monitoring, tracing, profiling, logs |
| `bun` | JavaScript | runtime | `@sentry/bun` | error-monitoring, tracing, logs |
| `django` | Python | framework | `sentry-sdk` | error-monitoring, tracing, profiling, logs |
| `flask` | Python | framework | `sentry-sdk` | error-monitoring, tracing, profiling, logs |

### Priority resolution

When multiple libs are passed, the dominant one is picked by:

1. **Category priority**: framework (3) > runtime (2) > library (1)
2. **Rank within category**: higher rank wins (e.g. nextjs=10 beats hono)

Examples:
- `["hono", "cloudflare"]` → dominant: `cloudflare` (runtime), secondary: `["hono"]` (library)
- `["hono", "bun"]` → dominant: `bun` (runtime), secondary: `["hono"]` (library)
- `["nextjs"]` → dominant: `nextjs` (framework), no secondary
- `["node", "django"]` → picks the ecosystem with the most matches, ignores the other

### Ecosystem filtering

Libs from different ecosystems (JS + Python) cannot be mixed. If both are passed, the ecosystem with the most matched libs wins. The other ecosystem's libs go into `unmatchedLibs`.

## Project structure

```
src/
  index.ts              Hono app + Streamable HTTP MCP transport
  mcp.ts                Tool definitions (get-available-features, get-docs)
  types.ts              SentrySkill, Feature interfaces
  skills/
    registry.ts         Skill lookup + priority resolution
    js/
      nextjs.ts         Next.js skill
      cloudflare.ts     Cloudflare Workers skill
      node.ts           Node.js skill
      bun.ts            Bun skill
    python/
      django.ts         Django skill
      flask.ts          Flask skill
scripts/
  ralph.ts              Iterative AI task runner (reads PRD.md, runs opencode in a loop)
```

## Setup

```bash
bun install
cp .env.example .env
# Add your ANTHROPIC_API_KEY (only needed for skill generation script, not the MCP server)

bun run dev
```

Server starts at `http://localhost:8080/mcp`.

## Test with MCP Inspector

```bash
# List registered tools
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/list

# Call get-available-features
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["nextjs"]'

# Call get-docs
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-docs --tool-arg 'libs=["nextjs"]' --tool-arg 'features=["error-monitoring", "tracing"]'
```

## Deploy

```bash
bun run deploy
```

Runs on Cloudflare Workers.
