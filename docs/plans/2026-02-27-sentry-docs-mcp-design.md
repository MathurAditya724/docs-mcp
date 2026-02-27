# Sentry Docs MCP — Design

## Purpose

An MCP server that generates tailored Sentry integration documentation for a user's agent. The user's agent calls MCP tools with the libraries in their codebase, and gets back feature lists and implementation guides customized to their stack.

## Architecture

**Stack:** Hono + Cloudflare Workers, `@modelcontextprotocol/sdk`, Vercel AI SDK (`generateText`), Anthropic Claude.

**Approach:** Agent-per-call. Each MCP tool call loads relevant skill files into a system prompt and calls `generateText()` via the Anthropic API. Stateless — fits Workers perfectly.

## Project Structure

```
src/
  index.ts          — Hono app + MCP transport
  mcp.ts            — MCP server with tool definitions
  agent.ts          — generateText wrapper with skill injection
  types.ts          — SentrySkill, Feature types
  skills/
    registry.ts     — Maps lib slugs to skills, handles priority resolution
    js/
      nextjs.ts
      hono.ts
      bun.ts
      node.ts
    python/
      flask.ts
```

## MCP Tools

### `get-available-features`

- **Input:** `{ libs: string[] }` — library slugs from the user's codebase
- **Process:** Resolve dominant lib via ecosystem hierarchy, load matching skills, return structured feature list
- **Output:** JSON with dominant lib, matched libs, and features (slug, name, description, which lib)

### `get-docs`

- **Input:** `{ libs: string[], features: string[] }` — libs + selected feature slugs
- **Process:** Load skills, build system prompt, call `generateText()` asking for full implementation guide
- **Output:** Markdown implementation guide with step-by-step instructions, code snippets, file paths, env vars

## Agent

Uses `generateText()` from Vercel AI SDK (not `ToolLoopAgent` — no tool use needed, just generation from skill context).

The system prompt is built by serializing:
1. The dominant lib's getting-started guide
2. Only the requested features' setup + code from matched skills
3. Instructions to generate a complete, self-contained implementation guide

## Skill Type

```typescript
type SentrySkill = {
  name: string;
  slug: string;
  ecosystem: "javascript" | "python";
  category: "framework" | "runtime" | "library";
  rank: number;
  packages: string[];
  features: Feature[];
  gettingStarted: string;
};

type Feature = {
  name: string;
  slug: string;
  description: string;
  setup: string;
  code: string;
};
```

## Priority Resolution

When multiple libs are passed:
1. Filter to known skills (ignore unknown libs)
2. Sort by category: framework > runtime > library
3. Within same category, sort by rank descending
4. First result = dominant lib (its getting-started guide is the base)
5. Others provide supplementary feature info

**Rank examples:** nextjs: 10, hono: 5, express: 5, node: 3, bun: 3, flask: 10

## Initial Skills (5)

| Slug    | Ecosystem  | Category  | Rank | Features |
|---------|-----------|-----------|------|----------|
| nextjs  | javascript | framework | 10   | error-monitoring, tracing, session-replay, profiling, crons, user-feedback, logs |
| hono    | javascript | framework | 5    | error-monitoring, tracing, profiling, logs |
| bun     | javascript | runtime   | 3    | error-monitoring, tracing, logs |
| node    | javascript | runtime   | 3    | error-monitoring, tracing, profiling, logs |
| flask   | python     | framework | 10   | error-monitoring, tracing, profiling, logs |
