/**
 * Validates all code examples from skills for syntax correctness.
 * For JS/TS skills: uses Bun's transpiler to check syntax.
 * For Python skills: uses a basic syntax check (parentheses/brackets balance).
 */

import bun_skill from "../src/skills/js/bun";
import cloudflare from "../src/skills/js/cloudflare";
import hono from "../src/skills/js/hono";
import nextjs from "../src/skills/js/nextjs";
import node from "../src/skills/js/node";
import django from "../src/skills/python/django";
import fastapi from "../src/skills/python/fastapi";
import flask from "../src/skills/python/flask";

import type { SentrySkill } from "../src/types";

interface CodeBlock {
  code: string;
  language: string;
  skill: string;
  source: string; // "feature:slug" or "gettingStarted"
}

function extractCodeBlocksFromMarkdown(
  markdown: string,
  skill: string
): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```(\w+)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({
      skill,
      source: "gettingStarted",
      language: match[1],
      code: match[2].trim(),
    });
  }
  return blocks;
}

function collectAllCodeBlocks(
  skills: Record<string, SentrySkill>
): CodeBlock[] {
  const blocks: CodeBlock[] = [];

  for (const [name, skill] of Object.entries(skills)) {
    // Feature code fields
    for (const feature of skill.features) {
      const lang = skill.ecosystem === "javascript" ? "typescript" : "python";
      blocks.push({
        skill: name,
        source: `feature:${feature.slug}`,
        language: lang,
        code: feature.code,
      });
    }

    // Code blocks from gettingStarted markdown
    const mdBlocks = extractCodeBlocksFromMarkdown(skill.gettingStarted, name);
    blocks.push(...mdBlocks);
  }

  return blocks;
}

async function validateJSCode(code: string): Promise<string | null> {
  try {
    const transpiler = new Bun.Transpiler({ loader: "tsx" });
    transpiler.transformSync(code);
    return null;
  } catch (e: any) {
    return e.message || String(e);
  }
}

async function validatePythonSyntax(code: string): Promise<string | null> {
  // Use Python's compile() for accurate syntax validation
  const tmpFile = `/tmp/validate_py_${Date.now()}_${Math.random().toString(36).slice(2)}.py`;
  await Bun.write(tmpFile, code);
  try {
    const proc = Bun.spawnSync({
      cmd: [
        "python3",
        "-c",
        `import py_compile; py_compile.compile('${tmpFile}', doraise=True)`,
      ],
      stdout: "pipe",
      stderr: "pipe",
    });
    if (proc.exitCode !== 0) {
      const stderr = proc.stderr.toString();
      // Extract just the error message, not the full traceback
      const lines = stderr.split("\n");
      const errorLine = lines.find(
        (l: string) => l.includes("SyntaxError") || l.includes("Error")
      );
      return errorLine || stderr.trim();
    }
    return null;
  } finally {
    try {
      const fs = require("fs");
      fs.unlinkSync(tmpFile);
    } catch {}
  }
}

async function main() {
  const skills: Record<string, SentrySkill> = {
    nextjs,
    node,
    cloudflare,
    bun: bun_skill,
    hono,
    django,
    flask,
    fastapi,
  };

  const blocks = collectAllCodeBlocks(skills);
  let errors = 0;
  let checked = 0;

  console.log(`Found ${blocks.length} code blocks to validate\n`);

  for (const block of blocks) {
    const isJS =
      block.language === "typescript" ||
      block.language === "ts" ||
      block.language === "javascript" ||
      block.language === "js" ||
      block.language === "tsx" ||
      block.language === "jsx";
    const isPython = block.language === "python" || block.language === "py";
    const isBash = block.language === "bash" || block.language === "sh";
    const isJSON = block.language === "json";

    if (isBash || isJSON) {
      // Skip bash/json blocks
      continue;
    }

    checked++;
    let error: string | null = null;

    if (isJS) {
      error = await validateJSCode(block.code);
    } else if (isPython) {
      error = await validatePythonSyntax(block.code);
    } else {
      console.log(
        `  SKIP [${block.skill}] ${block.source} (lang: ${block.language})`
      );
      continue;
    }

    if (error) {
      errors++;
      console.log(
        `  FAIL [${block.skill}] ${block.source} (${block.language})`
      );
      console.log(`       Error: ${error}`);
      console.log(
        `       Code:\n${block.code
          .split("\n")
          .map((l) => "         " + l)
          .join("\n")}`
      );
      console.log();
    } else {
      console.log(
        `  OK   [${block.skill}] ${block.source} (${block.language})`
      );
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Checked: ${checked}`);
  console.log(`Passed:  ${checked - errors}`);
  console.log(`Failed:  ${errors}`);

  if (errors > 0) {
    process.exit(1);
  }
}

main();
