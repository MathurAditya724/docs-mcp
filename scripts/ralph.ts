import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const CWD = process.cwd();
const PRD_PATH = join(CWD, "PRD.md");
const DEFAULT_ITERATIONS = 5;

const PROMPT = [
  "Read PRD.md and progress.txt in the project root.",
  "Find the next incomplete task and implement it.",
  "Commit your changes with a clear message.",
  "Update progress.txt with what you did.",
  "ONLY DO ONE TASK AT A TIME.",
  "If all tasks are complete, respond with: <ralph>COMPLETE</ralph>",
].join("\n");

function log(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

function main(): void {
  if (!existsSync(PRD_PATH)) {
    console.error("Error: PRD.md not found in project root.");
    console.error("Create a PRD.md with your tasks before running ralph.");
    process.exit(1);
  }

  const iterations = Number.parseInt(process.argv[2], 10) || DEFAULT_ITERATIONS;

  log(`Starting ralph loop (${iterations} iterations)`);
  console.log("");

  for (let i = 1; i <= iterations; i++) {
    log(`--- Iteration ${i}/${iterations} ---`);

    try {
      const result = execSync(`opencode run "${PROMPT.replace(/"/g, '\\"')}"`, {
        cwd: CWD,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "inherit"],
        timeout: 5 * 60 * 1000, // 5 minute timeout per iteration
      });

      console.log(result);

      if (result.includes("<ralph>COMPLETE</ralph>")) {
        log(`PRD complete after ${i} iteration(s).`);
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
}

main();
