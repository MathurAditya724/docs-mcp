# Sentry Docs MCP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an MCP server with two tools (`get-available-features`, `get-docs`) that generate tailored Sentry integration documentation using an internal AI agent loaded with skill files.

**Architecture:** Hono + Cloudflare Workers serves the MCP transport. Each tool call loads relevant TypeScript skill files into a system prompt, then calls `generateText()` via the Vercel AI SDK + Anthropic to produce tailored docs. Stateless, one agent call per request.

**Tech Stack:** Hono, `@modelcontextprotocol/sdk`, `ai` (Vercel AI SDK), `@ai-sdk/anthropic`, `zod`, Cloudflare Workers (wrangler)

---

### Task 1: Create shared types

**Files:**
- Create: `src/types.ts`

**Step 1: Write the types file**

```typescript
export type Feature = {
  name: string;
  slug: string;
  description: string;
  setup: string;
  code: string;
};

export type SentrySkill = {
  name: string;
  slug: string;
  ecosystem: "javascript" | "python";
  category: "framework" | "runtime" | "library";
  rank: number;
  packages: string[];
  features: Feature[];
  gettingStarted: string;
};
```

**Step 2: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add SentrySkill and Feature types"
```

---

### Task 2: Create the Node.js skill

**Files:**
- Create: `src/skills/js/node.ts`

**Step 1: Write the Node.js skill file**

Use the Sentry Node.js docs as reference (https://docs.sentry.io/platforms/javascript/guides/node/). The skill must export a `SentrySkill` object with:
- `slug: "node"`, `ecosystem: "javascript"`, `category: "runtime"`, `rank: 3`
- `packages: ["@sentry/node", "@sentry/profiling-node"]`
- Features: `error-monitoring`, `tracing`, `profiling`, `logs`
- `gettingStarted`: Instructions to create `instrument.js` (or `.mjs`), import it first, run with `--import` flag for ESM
- Each feature's `setup` and `code` fields should contain complete, copy-pasteable instructions and code

Reference code for the `gettingStarted` field:
```typescript
gettingStarted: `
Install the Sentry Node.js SDK:

\`\`\`bash
npm install @sentry/node
\`\`\`

Create an \`instrument.js\` file in your project root. This file must be loaded before any other modules:

\`\`\`javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
\`\`\`

Import this file at the very top of your application entry point:

\`\`\`javascript
require("./instrument");
// ... rest of your application
\`\`\`

For ESM projects, create \`instrument.mjs\` and run with:
\`\`\`bash
node --import ./instrument.mjs app.mjs
\`\`\`
`,
```

Reference for the error-monitoring feature:
```typescript
{
  name: "Error Monitoring",
  slug: "error-monitoring",
  description: "Automatically captures unhandled exceptions and unhandled promise rejections.",
  setup: "Error monitoring is enabled by default when you call Sentry.init(). No additional configuration is needed.",
  code: `const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
});

// Manually capture an error
Sentry.captureException(new Error("Something went wrong"));

// Manually capture a message
Sentry.captureMessage("Something happened");`,
}
```

Follow this pattern for `tracing` (with `tracesSampleRate`), `profiling` (with `@sentry/profiling-node` and `nodeProfilingIntegration()`), and `logs` (with `enableLogs: true` and `Sentry.logger.*` usage).

**Step 2: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/skills/js/node.ts
git commit -m "feat: add Node.js Sentry skill"
```

---

### Task 3: Create the Bun skill

**Files:**
- Create: `src/skills/js/bun.ts`

**Step 1: Write the Bun skill file**

Reference: https://docs.sentry.io/platforms/javascript/guides/bun/

Key differences from Node.js:
- Package: `@sentry/bun` (not `@sentry/node`)
- Run with: `bun --preload ./instrument.js app.js`
- No profiling support
- Features: `error-monitoring`, `tracing`, `logs`
- `slug: "bun"`, `category: "runtime"`, `rank: 3`
- Note in gettingStarted: "Auto-instrumentation does not work with bundled code, including Bun's single-file executables."

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/skills/js/bun.ts
git commit -m "feat: add Bun Sentry skill"
```

---

### Task 4: Create the Hono skill

**Files:**
- Create: `src/skills/js/hono.ts`

**Step 1: Write the Hono skill file**

Reference: https://docs.sentry.io/platforms/javascript/guides/hono/

Key details:
- Package: `@sentry/node` (Hono uses the Node.js SDK)
- `slug: "hono"`, `category: "framework"`, `rank: 5`
- Features: `error-monitoring`, `tracing`, `profiling`, `logs`
- `gettingStarted` must note: create `instrument.js`, import before Hono app, for ESM use `--import` flag
- The setup is essentially Node.js SDK setup but with Hono-specific context about middleware ordering

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/skills/js/hono.ts
git commit -m "feat: add Hono Sentry skill"
```

---

### Task 5: Create the Next.js skill

**Files:**
- Create: `src/skills/js/nextjs.ts`

**Step 1: Write the Next.js skill file**

Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/

This is the most feature-rich skill. Key details:
- Package: `@sentry/nextjs`
- `slug: "nextjs"`, `category: "framework"`, `rank: 10`
- Features: `error-monitoring`, `tracing`, `session-replay`, `profiling`, `crons`, `user-feedback`, `logs`

The `gettingStarted` should cover:
- `npx @sentry/wizard@latest -i nextjs` (or manual setup)
- Files to create: `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`, `next.config.ts` wrapping with `withSentryConfig`, `app/global-error.tsx`
- The `instrumentation.ts` file with `register()` and `onRequestError`

Each feature needs full setup + code:
- `session-replay`: `replayIntegration()`, sampling rates, privacy masking options
- `crons`: `Sentry.cron.instrumentCron()`, `withMonitor()`, `captureCheckIn()`, Vercel cron support
- `user-feedback`: `feedbackIntegration()` with config options
- `profiling`: profiling integration setup (client-side via `browserProfilingIntegration()`)
- `logs`: `enableLogs: true`, `Sentry.logger.*` usage

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/skills/js/nextjs.ts
git commit -m "feat: add Next.js Sentry skill"
```

---

### Task 6: Create the Flask skill

**Files:**
- Create: `src/skills/python/flask.ts`

**Step 1: Write the Flask skill file**

Reference: https://docs.sentry.io/platforms/python/integrations/flask/

Key details:
- Package: `sentry-sdk` (pip)
- `slug: "flask"`, `ecosystem: "python"`, `category: "framework"`, `rank: 10`
- Features: `error-monitoring`, `tracing`, `profiling`, `logs`
- Flask integration auto-activates when flask is installed
- `gettingStarted`: `pip install sentry-sdk`, call `sentry_sdk.init()` before creating Flask app
- Code uses Python syntax (not JS)

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/skills/python/flask.ts
git commit -m "feat: add Flask Sentry skill"
```

---

### Task 7: Create the skill registry

**Files:**
- Create: `src/skills/registry.ts`

**Step 1: Write the registry**

The registry:
1. Imports all skill modules
2. Exports a `skills` map: `Record<string, SentrySkill>`
3. Exports `resolveSkills(libs: string[])` function that:
   - Filters `libs` to only known slugs
   - Sorts by category priority (`framework` > `runtime` > `library`) then by `rank` descending
   - Returns `{ dominant: SentrySkill, secondary: SentrySkill[] }`
4. Exports `getAvailableFeatures(libs: string[])` that:
   - Calls `resolveSkills(libs)`
   - Collects all features across matched skills (deduped by slug)
   - Returns `{ dominantLib: string, matchedLibs: string[], features: Array<{ slug, name, description, lib }> }`

```typescript
import type { SentrySkill } from "../types";
import bun from "./js/bun";
import hono from "./js/hono";
import nextjs from "./js/nextjs";
import node from "./js/node";
import flask from "./python/flask";

const skills: Record<string, SentrySkill> = {
  nextjs,
  hono,
  bun,
  node,
  flask,
};

const categoryPriority: Record<string, number> = {
  framework: 3,
  runtime: 2,
  library: 1,
};

export function resolveSkills(libs: string[]) {
  const matched = libs
    .filter((lib) => lib in skills)
    .map((lib) => skills[lib])
    .sort((a, b) => {
      const catDiff = (categoryPriority[b.category] ?? 0) - (categoryPriority[a.category] ?? 0);
      if (catDiff !== 0) return catDiff;
      return b.rank - a.rank;
    });

  return {
    dominant: matched[0] ?? null,
    secondary: matched.slice(1),
  };
}

export function getAvailableFeatures(libs: string[]) {
  const { dominant, secondary } = resolveSkills(libs);
  if (!dominant) return { dominantLib: null, matchedLibs: [], features: [] };

  const allSkills = [dominant, ...secondary];
  const seen = new Set<string>();
  const features: Array<{ slug: string; name: string; description: string; lib: string }> = [];

  for (const skill of allSkills) {
    for (const feature of skill.features) {
      if (!seen.has(feature.slug)) {
        seen.add(feature.slug);
        features.push({
          slug: feature.slug,
          name: feature.name,
          description: feature.description,
          lib: skill.slug,
        });
      }
    }
  }

  return {
    dominantLib: dominant.slug,
    matchedLibs: allSkills.map((s) => s.slug),
    features,
  };
}

export { skills };
```

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/skills/registry.ts
git commit -m "feat: add skill registry with priority resolution"
```

---

### Task 8: Rewrite the agent module

**Files:**
- Modify: `src/agent.ts`

**Step 1: Rewrite agent.ts**

Replace the current `ToolLoopAgent` usage with a `generateDocs` function:

```typescript
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { SentrySkill, Feature } from "./types";

function buildSystemPrompt(dominant: SentrySkill, secondary: SentrySkill[], features: string[]): string {
  const featureSet = new Set(features);

  let prompt = `You are a Sentry integration expert. Generate a complete, self-contained implementation guide.
The user's primary framework/runtime is ${dominant.name}.

## Getting Started with ${dominant.name}

${dominant.gettingStarted}

## Available Features for ${dominant.name}
`;

  const relevantFeatures: Feature[] = [];
  for (const feature of dominant.features) {
    if (featureSet.has(feature.slug)) {
      relevantFeatures.push(feature);
    }
  }

  for (const feature of relevantFeatures) {
    prompt += `
### ${feature.name}

${feature.setup}

\`\`\`
${feature.code}
\`\`\`
`;
  }

  // Add secondary lib features if they provide features not in dominant
  for (const skill of secondary) {
    const extraFeatures = skill.features.filter(
      (f) => featureSet.has(f.slug) && !dominant.features.some((df) => df.slug === f.slug)
    );
    if (extraFeatures.length > 0) {
      prompt += `\n## Additional Features from ${skill.name}\n`;
      for (const feature of extraFeatures) {
        prompt += `\n### ${feature.name}\n\n${feature.setup}\n\n\`\`\`\n${feature.code}\n\`\`\`\n`;
      }
    }
  }

  prompt += `
## Instructions

Generate a complete implementation guide that:
1. Lists all packages to install with exact install commands
2. Shows every file that needs to be created or modified, with full file paths
3. Provides complete, copy-pasteable code for each file
4. Lists any environment variables needed (DSN, auth tokens, etc.)
5. Includes verification steps to confirm the setup works
6. Is written for another AI agent to follow — be explicit, no ambiguity
`;

  return prompt;
}

export async function generateDocs(
  dominant: SentrySkill,
  secondary: SentrySkill[],
  features: string[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(dominant, secondary, features);

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemPrompt,
    prompt: `Generate a complete Sentry implementation guide for ${dominant.name} covering these features: ${features.join(", ")}. Include all code, file paths, install commands, and environment variables needed.`,
  });

  return text;
}
```

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/agent.ts
git commit -m "feat: rewrite agent with generateText and skill injection"
```

---

### Task 9: Rewrite MCP server with both tools

**Files:**
- Modify: `src/mcp.ts`

**Step 1: Rewrite mcp.ts**

Replace the stub tool with the two real tools. Both accept `libs` as a zod-validated string array. `get-docs` also accepts `features`.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDocs } from "./agent";
import { getAvailableFeatures, resolveSkills } from "./skills/registry";

export function createMcpServer() {
  const mcp = new McpServer({
    name: "sentry-docs",
    version: "0.0.1",
    description: "Generates tailored Sentry integration docs for your codebase",
  });

  mcp.registerTool(
    "get-available-features",
    {
      title: "Get Available Features",
      description:
        "Given the libraries/frameworks in your codebase, returns all Sentry features you can enable. Pass library slugs like 'nextjs', 'hono', 'bun', 'node', 'flask'.",
      inputSchema: {
        libs: z.array(z.string()).describe("Library/framework slugs from the user's codebase"),
      },
    },
    async ({ libs }) => {
      const result = getAvailableFeatures(libs);

      if (!result.dominantLib) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { error: "No matching Sentry skills found for the provided libraries.", knownLibs: ["nextjs", "hono", "bun", "node", "flask"] },
                null,
                2
              ),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "get-docs",
    {
      title: "Get Sentry Integration Docs",
      description:
        "Generates a complete Sentry implementation guide tailored to your stack. Pass your library slugs and the feature slugs you want to enable.",
      inputSchema: {
        libs: z.array(z.string()).describe("Library/framework slugs from the user's codebase"),
        features: z.array(z.string()).describe("Feature slugs to include (from get-available-features)"),
      },
    },
    async ({ libs, features }) => {
      const { dominant, secondary } = resolveSkills(libs);

      if (!dominant) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No matching Sentry skills found. Use get-available-features first to see supported libraries.",
            },
          ],
        };
      }

      const docs = await generateDocs(dominant, secondary, features);

      return {
        content: [
          {
            type: "text" as const,
            text: docs,
          },
        ],
      };
    }
  );

  return mcp;
}
```

**Step 2: Verify lint passes**

Run: `bun run lint`

**Step 3: Commit**

```bash
git add src/mcp.ts
git commit -m "feat: add get-available-features and get-docs MCP tools"
```

---

### Task 10: Enable nodejs_compat in wrangler config

**Files:**
- Modify: `wrangler.jsonc`

**Step 1: Uncomment the nodejs_compat flag**

The AI SDK needs Node.js APIs on Cloudflare Workers. Uncomment the `compatibility_flags` line in `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "docs-mcp",
  "main": "src/index.ts",
  "compatibility_date": "2026-02-26",
  "compatibility_flags": [
    "nodejs_compat"
  ]
}
```

Remove all the commented-out boilerplate (KV, R2, D1, AI, observability) to keep it clean.

**Step 2: Verify dev server starts**

Run: `bun run dev`
Expected: Server starts without errors on localhost

**Step 3: Commit**

```bash
git add wrangler.jsonc
git commit -m "feat: enable nodejs_compat for AI SDK on Workers"
```

---

### Task 11: Smoke test the MCP server

**Files:** None (testing only)

**Step 1: Start the dev server**

Run: `bun run dev` (in background)

**Step 2: Test get-available-features via curl**

```bash
# Initialize MCP session
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'

# Call get-available-features
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: <session-id-from-above>" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get-available-features","arguments":{"libs":["nextjs","hono"]}}}'
```

Expected: JSON response with `dominantLib: "nextjs"`, matched libs, and a features list including session-replay, crons, user-feedback (from nextjs) plus any extras.

**Step 3: Test get-docs via curl**

```bash
curl -X POST http://localhost:8787/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: <session-id-from-above>" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get-docs","arguments":{"libs":["nextjs"],"features":["error-monitoring","session-replay"]}}}'
```

Expected: A complete markdown implementation guide for Next.js with error monitoring and session replay setup.

**Step 4: Stop the dev server and commit any fixes if needed**
