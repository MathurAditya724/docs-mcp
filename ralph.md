# Ralph Mode

A pattern for running an AI coding agent in a loop to execute a series of tasks from a PRD autonomously. Each iteration picks the next task, implements it, commits, and logs what happened — so the next iteration (which starts with a fresh context) can pick up where the last one left off.

## How it works

```
PRD.md (task list) + progress.txt (memory)
        │
        ▼
┌─────────────────────────┐
│  Loop script (ralph.ts) │
│  ┌───────────────────┐  │
│  │ Iteration 1       │  │──▶ opencode run "<prompt>"
│  │ Iteration 2       │  │──▶ opencode run "<prompt>"
│  │ ...               │  │──▶ ...
│  │ Iteration N       │  │──▶ opencode run "<prompt>"
│  └───────────────────┘  │
└─────────────────────────┘
        │
        ▼
  progress.txt updated after each iteration
  git commits after each task
```

The loop script doesn't do the work. It just calls the agent repeatedly with the same prompt. The agent reads `PRD.md` to know what to do and `progress.txt` to know what's already done.

## The three files

### 1. PRD.md — the task list

The PRD is the only thing the agent sees as "what needs to be done." Write it carefully.

**What makes a good PRD:**

- Numbered tasks, each one atomic and independently completable
- Grouped into phases (so dependent tasks are ordered correctly)
- A constraints section at the top — hard rules the agent must follow
- Expected output schemas or formats when applicable
- Specific test commands or verification steps per task

**What to avoid:**

- Vague tasks like "improve the code" — the agent will do something random
- Tasks that require human judgment without clear criteria
- Mixing implementation and review in the same task
- Referencing files that don't exist yet without saying "create this file"

**Example structure:**

```markdown
# Project — PRD

## Context
What this project is and what we're building.

## Constraints
- Do NOT modify X
- Always commit after each task
- Target output: under 2000 tokens

## Tasks

### Phase 1: Foundation
- [ ] 1. Do the first thing. Specific details here.
- [ ] 2. Do the second thing. Expected output: ...

### Phase 2: Depends on Phase 1
- [ ] 3. Now do this. Verify by running `bun test`.
```

### 2. progress.txt — the agent's memory

Each agent session starts completely fresh. It has no memory of previous runs. `progress.txt` is the only way to pass knowledge between sessions.

The agent should update it after **every attempt** (not just successes) with:

- Task number and status: DONE, FAILED, or SKIPPED
- What was tried and what happened
- Errors, blockers, or unexpected behavior
- Key learnings the next session needs

This is the single most important thing in the system. Without good progress logging, the agent will repeat the same mistakes across sessions.

### 3. The loop script

A simple script that calls the agent in a loop. Here's the minimal version:

```typescript
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const CWD = process.cwd();
const PRD_PATH = join(CWD, "PRD.md");

const PROMPT = [
  "Read PRD.md and progress.txt in the project root.",
  "progress.txt is your memory between runs. Read it carefully before starting.",
  "Find the next incomplete task and implement it.",
  "Commit your changes with a clear message.",
  "After EVERY attempt (success or failure), update progress.txt with:",
  "  - Task number and status (DONE, FAILED, or SKIPPED)",
  "  - What you tried and what happened",
  "  - Any errors, blockers, or unexpected behavior encountered",
  "  - Key learnings or context the next agent will need to continue",
  "ONLY DO ONE TASK AT A TIME.",
  "If a task is marked as SKIPPED in progress.txt, skip it and move to the next one.",
  "If all tasks are complete or skipped, respond with: <ralph>COMPLETE</ralph>",
].join("\n");

function main(): void {
  if (!existsSync(PRD_PATH)) {
    console.error("PRD.md not found.");
    process.exit(1);
  }

  const iterations = Number.parseInt(process.argv[2], 10) || 5;

  for (let i = 1; i <= iterations; i++) {
    try {
      const result = execSync(
        `opencode run "${PROMPT.replace(/"/g, '\\"')}"`,
        { cwd: CWD, encoding: "utf-8", stdio: ["pipe", "pipe", "inherit"], timeout: 5 * 60 * 1000 },
      );
      console.log(result);
      if (result.includes("<ralph>COMPLETE</ralph>")) {
        console.log(`Done after ${i} iteration(s).`);
        process.exit(0);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`Iteration ${i} failed: ${msg}`);
    }
  }
}

main();
```

Run it: `bun run ralph.ts` or `bun run ralph.ts 30` for 30 iterations.

## Retry and skip system

Without retry tracking, a stuck task will burn all remaining iterations. The loop should track which task the agent is working on and skip it after N failed attempts.

How it works:
1. After each iteration, read `progress.txt` to detect which task was last attempted
2. If the same task appears in consecutive iterations, increment an attempt counter
3. After 3 failed attempts, mark the task as SKIPPED in `progress.txt` and move on
4. Log skipped tasks at the end of the run

Detection is simple — parse the last line of `progress.txt` for a task number. If it's the same as last iteration, the task hasn't progressed.

## Prompt design

The system prompt is short by design. Don't embed file contents in it — the agent has tools to read files. The prompt should only tell the agent:

1. **Where to find the plan**: "Read PRD.md and progress.txt"
2. **What to do**: "Find the next incomplete task and implement it"
3. **How to persist state**: "Update progress.txt after every attempt"
4. **When to stop**: "If all tasks are complete, respond with `<ralph>COMPLETE</ralph>`"
5. **Scope per iteration**: "ONLY DO ONE TASK AT A TIME"

Don't be tempted to add the PRD contents to the prompt. The agent can read the file and that keeps the prompt small and consistent across iterations.

## Writing effective PRD tasks

### Be specific about verification

Bad:
```
- [ ] 5. Make sure the server works
```

Good:
```
- [ ] 5. Verify the server builds with `wrangler deploy --dry-run` and starts with `bun run dev`. Hit the /mcp endpoint and confirm it responds (406 for missing Accept header is expected, not a crash).
```

### Include expected outputs

Bad:
```
- [ ] 2. Refactor get-docs to return structured data
```

Good:
```
- [ ] 2. Refactor get-docs to return structured JSON:
  { "stack": { "dominant": "...", "secondary": [...] }, "packages": [...], "gettingStarted": "...", "features": [...] }
  The gettingStarted comes from the dominant skill. Features are deduplicated.
```

### Put constraints at the top, not inline

Constraints that apply to all tasks should be in a dedicated section at the top of the PRD, not repeated in each task. The agent reads the whole file — it will see them.

```markdown
## Constraints
- Do NOT use or run scripts/generate-skills.ts — it is experimental
- Commit after every completed task
- All code examples must be syntactically valid
```

### Phase tasks correctly

If task 8 depends on task 7, they should be in the same phase and numbered in order. Don't put them in separate phases or the agent might try to parallelize.

### Include test commands the agent can copy-paste

If there's a way to verify a task, include the exact command:

```
- [ ] 27. Run these commands and verify the responses:
  npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/list
  npx @modelcontextprotocol/inspector --cli http://localhost:8080/mcp --transport http --method tools/call --tool-name get-available-features --tool-arg 'libs=["nextjs"]'
```

## Things we would do differently

### 1. Structured progress.txt format

We used freeform text for `progress.txt`. It worked, but a structured format would make parsing easier and give the agent a clearer template:

```
## Task 5
Status: DONE
Attempts: 1
What: Removed agent.ts, verified build passes
Learned: wrangler uses esbuild not tsc, so TS2589 type depth errors don't block builds

## Task 6
Status: FAILED
Attempts: 2
What: Tried adding ecosystem filtering, got circular import
Blocker: registry.ts imports from types.ts which re-exports from registry.ts
Learned: Need to break the cycle by moving types to a separate file first
```

This would also make the retry detection more reliable — parse `## Task N` + `Status:` instead of regex on the last line.

### 2. Task-level timeouts, not just iteration timeouts

We used a flat 5-minute timeout per iteration. But some tasks (like fetching 8 doc pages and comparing them) genuinely need more time, while simple refactors need 2 minutes. The PRD could include estimated time per task, and the loop script could read it.

### 3. Validation hooks between tasks

After each task completes, the loop could run a validation step before moving on — like `bun run lint` or `bun test`. If validation fails, the task isn't marked as done and the agent retries. We did this manually in the PRD ("verify the build passes") but it would be more reliable as an automated gate.

```typescript
// After each iteration, run validation
const lintResult = execSync("bun run lint", { encoding: "utf-8" });
if (lintResult.includes("error")) {
  // Don't count this as a successful iteration
}
```

### 4. Separate PRD from context docs

Our PRD included both task definitions and context (response schemas, CLI syntax reference). The agent had to parse all of it every iteration even though the context doesn't change. A better structure:

```
PRD.md          — just the task list
CONTEXT.md      — schemas, API docs, reference material
progress.txt    — memory between runs
```

The prompt would say "Read PRD.md, CONTEXT.md, and progress.txt." The agent reads all three but the separation makes each file smaller and more focused.

### 5. Git branch per phase

We committed everything to one branch. If a phase goes wrong, you can't easily revert to the end of the previous phase. Creating a branch per phase (or per task) would make rollbacks trivial.

### 6. Cost and token tracking

Each iteration consumes tokens. We didn't track cumulative cost. The loop script could log input/output tokens per iteration and running totals, so you can see if a stuck task is burning money.

### 7. Summary at the end

After the loop finishes, the script should print a summary: which tasks succeeded, which were skipped, how many iterations were used, and total time. We logged skipped tasks but not a full summary.

### 8. Don't let the agent modify the PRD

In some cases the agent might "helpfully" edit PRD.md to mark tasks as done. This can cause the loop to lose track. The PRD should be treated as read-only by the agent. All state goes in `progress.txt`.

## Adapting for other agents

The pattern works with any agent CLI that supports a non-interactive run mode:

```bash
# OpenCode
opencode run "<prompt>"

# Claude Code
claude -p "<prompt>" --allowedTools "Bash,Read,Write,Edit"

# Codex
codex --quiet --approval-mode full-auto "<prompt>"
```

Swap the `execSync` command in the loop script. The prompt and file structure stay the same.
