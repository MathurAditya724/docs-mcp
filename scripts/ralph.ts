import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CWD = process.cwd();
const PRD_PATH = join(CWD, "PRD.md");
const PROGRESS_PATH = join(CWD, "progress.txt");
const DEFAULT_ITERATIONS = 5;
const MAX_ATTEMPTS = 3;
const TASK_PATTERN = /(?:task\s*)?(\d+)/i;

const PROMPT = [
  "Read PRD.md and progress.txt in the project root.",
  "progress.txt is your memory between runs. Read it carefully before starting — it contains completed tasks, failed attempts, learnings, and issues from previous runs.",
  "Find the next incomplete task and implement it.",
  "Commit your changes with a clear message.",
  "After EVERY attempt (success or failure), update progress.txt with:",
  "  - Task number and status (DONE, FAILED, or SKIPPED)",
  "  - What you tried and what happened",
  "  - Any errors, blockers, or unexpected behavior encountered",
  "  - Key learnings or context the next agent will need to continue",
  "This is critical — the next agent session starts fresh with no memory. progress.txt is the only way to pass knowledge forward.",
  "ONLY DO ONE TASK AT A TIME.",
  "If a task is marked as SKIPPED in progress.txt, skip it and move to the next one.",
  "If all tasks are complete or skipped, respond with: <ralph>COMPLETE</ralph>",
].join("\n");

function log(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

function getCurrentTask(): string | null {
  if (!existsSync(PROGRESS_PATH)) {
    return null;
  }
  const progress = readFileSync(PROGRESS_PATH, "utf-8");
  const lines = progress.trim().split("\n").filter(Boolean);
  const last = lines.at(-1);
  if (!last) {
    return null;
  }
  const match = last.match(TASK_PATTERN);
  return match ? match[1] : null;
}

function skipTask(task: string): void {
  try {
    execSync(
      `opencode run "Read progress.txt. Task ${task} has failed ${MAX_ATTEMPTS} times. Append a line: 'Task ${task}: SKIPPED (failed after ${MAX_ATTEMPTS} attempts)' and move on."`,
      {
        cwd: CWD,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "inherit"],
        timeout: 2 * 60 * 1000,
      }
    );
  } catch (_) {
    // best-effort skip
  }
}

function runIteration(): string {
  return execSync(`opencode run "${PROMPT.replace(/"/g, '\\"')}"`, {
    cwd: CWD,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "inherit"],
    timeout: 5 * 60 * 1000,
  });
}

function main(): void {
  if (!existsSync(PRD_PATH)) {
    console.error("Error: PRD.md not found in project root.");
    console.error("Create a PRD.md with your tasks before running ralph.");
    process.exit(1);
  }

  const iterations = Number.parseInt(process.argv[2], 10) || DEFAULT_ITERATIONS;

  log(
    `Starting ralph loop (${iterations} iterations, max ${MAX_ATTEMPTS} attempts per task)`
  );
  console.log("");

  let lastTask: string | null = null;
  let attempts = 0;
  const skipped: string[] = [];

  for (let i = 1; i <= iterations; i++) {
    log(`--- Iteration ${i}/${iterations} ---`);

    const currentTask = getCurrentTask();

    if (currentTask && currentTask === lastTask) {
      attempts++;
      log(`Task ${currentTask}: attempt ${attempts}/${MAX_ATTEMPTS}`);
      if (attempts >= MAX_ATTEMPTS) {
        log(
          `Task ${currentTask} failed after ${MAX_ATTEMPTS} attempts — skipping`
        );
        skipped.push(currentTask);
        skipTask(currentTask);
        attempts = 0;
        lastTask = null;
        continue;
      }
    } else {
      lastTask = currentTask;
      attempts = 1;
    }

    try {
      const result = runIteration();
      console.log(result);

      if (result.includes("<ralph>COMPLETE</ralph>")) {
        log(`PRD complete after ${i} iteration(s).`);
        if (skipped.length > 0) {
          log(`Skipped tasks: ${skipped.join(", ")}`);
        }
        process.exit(0);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      log(`Iteration ${i} failed: ${msg}`);
      log("Continuing to next iteration...");
    }

    console.log("");
  }

  log(`Finished ${iterations} iterations.`);
  if (skipped.length > 0) {
    log(`Skipped tasks: ${skipped.join(", ")}`);
  }
}

main();
