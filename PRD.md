# Sentry Docs MCP — PRD

## Context

This is an MCP server that helps AI agents integrate Sentry into user projects. It has two tools:

1. **get-available-features** — Given the user's libs (e.g. `["hono", "cloudflare"]`), return what Sentry features are available.
2. **get-docs** — Given libs + selected features, return a tailored implementation guide.

The server uses pre-authored "skills" (`src/skills/`) as its knowledge base. Skills exist for JS (nextjs, cloudflare, node, bun) and Python (django, flask).

The `get-docs` tool currently calls an LLM (Claude Sonnet) to generate docs from skill data. Both tools should work deterministically from skill data alone — the agent calling the MCP decides how to use the output, not an LLM inside the MCP.

## Constraints

- **Do NOT use, run, or modify `scripts/generate-skills.ts`** — it is experimental and not part of this work. Do not run it, do not reference it, do not depend on its output. All skill files should be authored/edited by hand.
- **Do NOT add LLM calls to the MCP server** — the server must be deterministic. No `@ai-sdk/anthropic`, no `ai` SDK, no `generateText()` in the deployed server code.
- **Skills are the source of truth** — if a skill is wrong, fix the skill file directly. Don't patch around it in the response assembly.
- **Commit after every task** — after completing each numbered task, commit the changes with a clear message before moving on to the next task. This keeps progress incremental and reviewable.

## Response Schema

Both tools must return predictable JSON. Define these shapes and stick to them.

### `get-available-features` response

```json
{
  "dominantLib": "cloudflare",
  "matchedLibs": ["cloudflare", "hono"],
  "unmatchedLibs": ["express"],
  "features": [
    { "slug": "error-monitoring", "name": "Error Monitoring", "description": "...", "lib": "cloudflare" }
  ]
}
```

`unmatchedLibs` lists any libs the caller passed that we don't have skills for. This tells the calling agent what we couldn't help with so it doesn't silently miss things.

### `get-docs` response

```json
{
  "stack": { "dominant": "cloudflare", "secondary": ["hono"], "ecosystem": "javascript" },
  "packages": ["@sentry/cloudflare"],
  "gettingStarted": "...(from dominant skill)...",
  "features": [
    {
      "slug": "error-monitoring",
      "name": "Error Monitoring",
      "setup": "...",
      "code": "...",
      "lib": "cloudflare"
    }
  ],
  "secondaryPatterns": [
    {
      "lib": "hono",
      "description": "...",
      "setup": "...",
      "code": "..."
    }
  ]
}
```

`gettingStarted` appears once (from the dominant skill). Features are deduplicated. `secondaryPatterns` holds framework/library-specific wiring (e.g. Hono middleware) that supplements the dominant runtime.

## Tasks

### Phase 1: Remove LLM dependency from MCP tools

- [ ] 1. Refactor `get-available-features` to include `unmatchedLibs` in its response — any lib the caller passes that doesn't match a known skill should be listed here
- [ ] 2. Refactor `get-docs` to stop calling `generateDocs()` / `generateText()`. Instead, assemble and return structured JSON matching the response schema above. The `gettingStarted` comes from the dominant skill, features are deduplicated across matched skills, and secondary patterns hold library-specific wiring
- [ ] 3. Remove `src/agent.ts` entirely — it contains the LLM call which is no longer needed
- [ ] 4. Remove `@ai-sdk/anthropic` and `ai` from dependencies entirely. They are not needed by the MCP server. The experimental `scripts/generate-skills.ts` is not part of this work — if someone wants to run it later they can install deps themselves
- [ ] 5. Verify the MCP server still builds and runs with `wrangler dev` after removing the LLM code

### Phase 2: Add ecosystem validation

- [ ] 6. Add ecosystem filtering to `resolveSkills()` in `src/skills/registry.ts`. If the caller passes libs from mixed ecosystems (e.g. `["node", "flask"]`), pick the ecosystem with the most matched libs and ignore the rest. Return the ignored libs in `unmatchedLibs` with a note that cross-ecosystem mixing is not supported
- [ ] 7. Add a `hono` skill to `src/skills/js/hono.ts`. Important: Hono does NOT have its own Sentry SDK. There is no `@sentry/hono` package. The skill should describe how to wire Sentry into a Hono app using middleware, and defer to the runtime skill (cloudflare, bun, or node) for the actual Sentry init. Category should be `"library"` so it ranks below runtimes and frameworks. The `packages` array should be empty (the runtime provides the Sentry package)
- [ ] 8. Update `src/skills/registry.ts` to import and register the hono skill
- [ ] 9. Add a `fastapi` skill to `src/skills/python/fastapi.ts` — FastAPI is the most popular Python framework after Flask/Django in the Sentry ecosystem. Fetch the docs from `https://docs.sentry.io/platforms/python/integrations/fastapi/` to get accurate content
- [ ] 10. Update `src/skills/registry.ts` to import and register the fastapi skill

### Phase 3: Validate skills against Sentry docs

- [ ] 11. For each JS skill (nextjs, cloudflare, node, bun), fetch the actual Sentry docs page and compare against the skill's content. Fix any outdated info, wrong code examples, or missing features. Docs URLs: `https://docs.sentry.io/platforms/javascript/guides/{slug}/`
- [ ] 12. For each Python skill (django, flask, fastapi), fetch the actual Sentry docs and do the same comparison. Docs URLs: `https://docs.sentry.io/platforms/python/integrations/{slug}/`
- [ ] 13. Ensure every skill covers ALL features that Sentry actually supports for that runtime/framework. Cross-reference the docs for features like: error-monitoring, tracing, session-replay, profiling, logs, crons, user-feedback. Add any that are missing
- [ ] 14. Verify all code examples are syntactically valid. For TypeScript skills, extract each `code` field and run it through `bun build --target=browser` or equivalent to catch syntax errors. Fix any broken examples
- [ ] 15. Make sure code examples are minimal and correct — copy-pasteable, no placeholder functions like `foo()`, no undefined variables

### Phase 4: Improve skill resolution for combo stacks

- [ ] 16. Test the skill resolution logic with these combos and verify dominant/secondary makes sense:
  - `["hono", "cloudflare"]` → dominant: cloudflare, secondary: [hono]
  - `["hono", "bun"]` → dominant: bun, secondary: [hono]
  - `["hono", "node"]` → dominant: node, secondary: [hono]
  - `["nextjs"]` → dominant: nextjs, secondary: []
  - `["bun"]` → dominant: bun, secondary: []
  - `["node", "flask"]` → should pick one ecosystem, not mix
- [ ] 17. Make sure `get-docs` output for combo stacks merges correctly: `gettingStarted` from dominant, features deduplicated, and `secondaryPatterns` shows how to wire the library (e.g. Hono middleware) into the runtime's Sentry setup
- [ ] 18. Test edge cases: empty libs array, all unknown libs, single known lib + multiple unknown libs. Each should return sensible responses, not crash

### Phase 5: Optimize output for token efficiency

- [ ] 19. Review all skill `gettingStarted` and feature `setup`/`code` fields. Remove verbose prose, redundant explanations, duplicated code blocks. The output is consumed by an AI agent — it needs to be precise and compact, not conversational
- [ ] 20. Restructure skills so the init code isn't repeated per feature. The `gettingStarted` shows init once. Each feature's `code` should only show the incremental config/code for that feature (e.g. just the `replaysSessionSampleRate` addition, not the full `Sentry.init()` again)
- [ ] 21. Measure approximate token count of `get-docs` output for a full-feature request (e.g. `["nextjs"]` with all features). Target: under 2000 tokens for a single-runtime request, under 3000 for a combo stack

### Phase 6: Write tests and run RL improvement loop

- [ ] 22. Create a test script at `scripts/test-mcp.ts` that imports the registry functions directly and calls both tool handlers programmatically. Test cases:
  - `get-available-features(["hono", "cloudflare"])` — dominant: cloudflare, hono in matchedLibs
  - `get-available-features(["hono", "bun"])` — dominant: bun
  - `get-available-features(["hono", "node"])` — dominant: node
  - `get-available-features(["nextjs"])` — dominant: nextjs, all 5+ features listed
  - `get-available-features(["bun"])` — dominant: bun
  - `get-available-features(["express", "node"])` — dominant: node, express in unmatchedLibs
  - `get-available-features(["node", "django"])` — picks one ecosystem, ignores the other
  - `get-docs(["hono", "cloudflare"], ["error-monitoring", "tracing", "logs"])` — structured response, no LLM call, has secondaryPatterns for hono
  - `get-docs(["nextjs"], ["error-monitoring", "tracing", "session-replay", "logs", "profiling"])` — full nextjs guide
  - `get-docs(["hono", "bun"], ["error-monitoring", "tracing"])` — bun + hono patterns
  - `get-docs(["django"], ["error-monitoring", "tracing", "profiling"])` — python stack
- [ ] 23. Run the tests. For any failures, fix the skills or resolution logic. Re-run until all pass
- [ ] 24. After tests pass, review `get-docs` output quality for each test case. Check: Could an AI agent follow this to set up Sentry correctly? Is it minimal? Are code examples correct?
- [ ] 25. If output quality is lacking, improve the skills content or response assembly in `mcp.ts`. Re-run tests after every change
- [ ] 26. Run a final pass: for each test case, count response size (characters and estimated tokens) and log a summary table. Verify all are within budget

### Phase 7: Integration test with MCP Inspector

The MCP Inspector CLI (`npx @modelcontextprotocol/inspector --cli`) can call tools on a running MCP server directly from the command line. Our server runs on Streamable HTTP at `http://localhost:8080/mcp` (started via `bun run dev` which runs `wrangler dev`).

**CLI syntax reference:**

```bash
# List all tools registered on the server
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/list

# Call a tool with arguments (--tool-arg passes key=value pairs)
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name <tool> --tool-arg key=value

# For array arguments, pass JSON strings
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["nextjs"]'
```

- [ ] 27. Start the MCP server with `bun run dev`. Then run the following commands using the MCP Inspector CLI and verify each response matches the expected schema and content:

```bash
# Verify tools are registered
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/list

# Test get-available-features with single lib
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["nextjs"]'

# Test get-available-features with combo stack
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["hono", "cloudflare"]'

# Test get-available-features with unknown libs
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["express", "node"]'

# Test get-available-features with mixed ecosystems
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["node", "django"]'

# Test get-docs with single lib
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-docs --tool-arg 'libs=["nextjs"]' --tool-arg 'features=["error-monitoring", "tracing", "session-replay"]'

# Test get-docs with combo stack
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-docs --tool-arg 'libs=["hono", "cloudflare"]' --tool-arg 'features=["error-monitoring", "tracing", "logs"]'

# Test get-docs with python stack
npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-docs --tool-arg 'libs=["django"]' --tool-arg 'features=["error-monitoring", "tracing", "profiling"]'
```

Fix any issues found — wrong response shapes, missing fields, crashes, etc. Re-run until all commands return valid responses matching the schema defined above
