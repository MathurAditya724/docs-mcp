import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

// ─── Types ──────────────────────────────────────────────────────────────────

interface SdkEntry {
  canonical?: string;
  categories?: string[];
  features?: Record<string, unknown>;
  main_docs_url?: string;
  name?: string;
  package_url?: string;
  version?: string;
}

interface SkillOutput {
  category: "framework" | "runtime" | "library";
  ecosystem: "javascript" | "python";
  features: Array<{
    code: string;
    description: string;
    name: string;
    setup: string;
    slug: string;
  }>;
  gettingStarted: string;
  name: string;
  packages: string[];
  rank: number;
  slug: string;
}

interface GeneratedSkill {
  ecosystem: "javascript" | "python";
  filePath: string;
  slug: string;
  varName: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");
const SDKS_PATH = join(ROOT, "sdks.json");
const SKILLS_DIR = join(ROOT, "src", "skills");

// Regex patterns for stripping markdown code fences from agent output
const FENCE_START = /^```(?:json)?\n?/;
const FENCE_END = /\n?```$/;

// Python web framework integrations to generate skills for.
// These are the integrations that represent standalone web frameworks
// (as opposed to libraries/middleware that supplement a framework).
const PYTHON_FRAMEWORK_INTEGRATIONS = [
  {
    slug: "django",
    name: "Django",
    url: "https://docs.sentry.io/platforms/python/integrations/django/",
  },
  {
    slug: "flask",
    name: "Flask",
    url: "https://docs.sentry.io/platforms/python/integrations/flask/",
  },
  {
    slug: "fastapi",
    name: "FastAPI",
    url: "https://docs.sentry.io/platforms/python/integrations/fastapi/",
  },
  {
    slug: "starlette",
    name: "Starlette",
    url: "https://docs.sentry.io/platforms/python/integrations/starlette/",
  },
  {
    slug: "aiohttp",
    name: "AIOHTTP",
    url: "https://docs.sentry.io/platforms/python/integrations/aiohttp/",
  },
  {
    slug: "tornado",
    name: "Tornado",
    url: "https://docs.sentry.io/platforms/python/integrations/tornado/",
  },
  {
    slug: "sanic",
    name: "Sanic",
    url: "https://docs.sentry.io/platforms/python/integrations/sanic/",
  },
  {
    slug: "falcon",
    name: "Falcon",
    url: "https://docs.sentry.io/platforms/python/integrations/falcon/",
  },
  {
    slug: "bottle",
    name: "Bottle",
    url: "https://docs.sentry.io/platforms/python/integrations/bottle/",
  },
  {
    slug: "pyramid",
    name: "Pyramid",
    url: "https://docs.sentry.io/platforms/python/integrations/pyramid/",
  },
  {
    slug: "quart",
    name: "Quart",
    url: "https://docs.sentry.io/platforms/python/integrations/quart/",
  },
  {
    slug: "litestar",
    name: "Litestar",
    url: "https://docs.sentry.io/platforms/python/integrations/litestar/",
  },
  {
    slug: "celery",
    name: "Celery",
    url: "https://docs.sentry.io/platforms/python/integrations/celery/",
  },
  {
    slug: "aws-lambda",
    name: "AWS Lambda",
    url: "https://docs.sentry.io/platforms/python/integrations/aws-lambda/",
  },
  {
    slug: "gcp-functions",
    name: "Google Cloud Functions",
    url: "https://docs.sentry.io/platforms/python/integrations/gcp-functions/",
  },
];

// ─── System Prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Sentry SDK documentation expert. Your job is to read a Sentry docs page and extract structured skill data.

You will receive:
1. The raw text content of a Sentry docs page for a specific SDK or integration
2. Metadata about the SDK (name, package, docs URL)

You MUST output a single valid JSON object (no markdown, no code fences, no explanation) that matches this TypeScript interface:

interface SkillOutput {
  category: "framework" | "runtime" | "library";
  ecosystem: "javascript" | "python";
  features: Array<{
    code: string;       // Complete, copy-pasteable code example
    description: string; // One sentence describing the feature
    name: string;       // Human-readable name (e.g., "Error Monitoring")
    setup: string;      // Setup instructions as a paragraph
    slug: string;       // kebab-case slug (e.g., "error-monitoring")
  }>;
  gettingStarted: string; // Complete getting-started guide with code blocks (use backtick fences)
  name: string;           // Human-readable SDK/framework name
  packages: string[];     // npm/pip packages to install
  rank: number;           // Priority rank (10 for major frameworks, 5 for minor frameworks, 3 for runtimes, 1 for libraries)
  slug: string;           // kebab-case identifier (e.g., "nextjs", "flask")
}

## Feature Slugs

Use these standardized slugs for features:
- "error-monitoring" — Capturing errors and exceptions
- "tracing" — Performance monitoring / distributed tracing
- "session-replay" — Recording user sessions (browser only)
- "profiling" — Code-level profiling
- "crons" — Cron job / scheduled task monitoring
- "user-feedback" — User feedback widget
- "logs" — Structured logging via Sentry

Only include features that the SDK/integration actually supports based on the docs content.
If a feature isn't mentioned in the docs, do NOT include it.

## Category Classification

- "framework" — Web frameworks (Next.js, Django, Flask, Express, React, Vue, Angular, etc.)
- "runtime" — Language runtimes (Node.js, Bun, Deno, browser, Python base)
- "library" — Utility libraries, integrations, or middleware

## Rank Assignment

- 10: Major full-stack frameworks (Next.js, Django, Nuxt, SvelteKit, Remix)
- 8: Major UI frameworks (React, Vue, Angular)
- 7: Server frameworks (Express, Hono, NestJS, FastAPI, Flask)
- 5: Minor or niche frameworks (Astro, Solid, Ember, Svelte, Starlette, Bottle)
- 3: Runtimes (Node.js, Bun, Deno, Cloudflare Workers)
- 1: Libraries and utilities

## Code Examples

All code examples MUST be complete and copy-pasteable. Include:
- Import statements
- Full Sentry.init() calls with relevant options
- Example usage

For JavaScript, use modern ES module syntax (import/export).
For Python, use standard Python import syntax.

Use "___PUBLIC_DSN___" as the DSN placeholder.

## Getting Started Guide

The gettingStarted field should be a complete setup guide using markdown with code fences.
Include:
- Package installation command
- All files that need to be created/modified
- Complete initialization code
- Any special setup steps (e.g., Next.js wizard, instrument.js preloading)

IMPORTANT: Output ONLY the JSON object. No markdown fences, no explanation, no commentary.`;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchDocsPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  ⚠ Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    const html = await response.text();
    // Strip HTML tags for a rough text extraction
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30_000); // Limit to ~30k chars to fit in context
  } catch (error) {
    console.warn(`  ⚠ Error fetching ${url}:`, error);
    return null;
  }
}

function extractSlug(sdkKey: string): string {
  // "sentry.javascript.nextjs" -> "nextjs"
  // "sentry.javascript.react-router" -> "react-router"
  const parts = sdkKey.split(".");
  return parts.at(-1) ?? sdkKey;
}

function toVarName(slug: string): string {
  // "react-router" -> "reactRouter"
  // "nextjs" -> "nextjs"
  // "aws-serverless" -> "awsServerless"
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

async function generateSkillJson(
  docsContent: string,
  metadata: {
    name: string;
    slug: string;
    ecosystem: "javascript" | "python";
    docsUrl: string;
    packageUrl?: string;
  }
): Promise<SkillOutput | null> {
  const userPrompt = `Generate a SentrySkill JSON object for this SDK:

Name: ${metadata.name}
Slug: ${metadata.slug}
Ecosystem: ${metadata.ecosystem}
Docs URL: ${metadata.docsUrl}
${metadata.packageUrl ? `Package: ${metadata.packageUrl}` : ""}

Here is the documentation content:

${docsContent}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { text } = await generateText({
        model: anthropic("claude-sonnet-4-6"),
        prompt: userPrompt,
        system: SYSTEM_PROMPT,
      });

      // Try to extract JSON from the response (strip markdown fences if present)
      let jsonStr = text.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(FENCE_START, "").replace(FENCE_END, "");
      }

      const parsed = JSON.parse(jsonStr) as SkillOutput;

      // Validate required fields
      if (
        !(
          parsed.name &&
          parsed.slug &&
          parsed.features &&
          parsed.gettingStarted
        )
      ) {
        throw new Error("Missing required fields in agent output");
      }

      return parsed;
    } catch (error) {
      if (attempt === 0) {
        console.warn(
          `  ⚠ Retry: Failed to parse agent output for ${metadata.slug}:`,
          error instanceof Error ? error.message : error
        );
      } else {
        console.error(
          `  ✗ Failed to generate skill for ${metadata.slug} after 2 attempts`
        );
        return null;
      }
    }
  }

  return null;
}

function writeSkillFile(
  skill: SkillOutput,
  ecosystem: "javascript" | "python"
): string {
  const subdir = ecosystem === "javascript" ? "js" : "python";
  const dir = join(SKILLS_DIR, subdir);
  mkdirSync(dir, { recursive: true });

  const varName = toVarName(skill.slug);
  const relImportPath =
    ecosystem === "javascript" ? "../../types" : "../../types";

  const content = `import type { SentrySkill } from "${relImportPath}";

const ${varName}: SentrySkill = ${JSON.stringify(skill, null, 2)};

export default ${varName};
`;

  const filePath = join(dir, `${skill.slug}.ts`);
  writeFileSync(filePath, content, "utf-8");
  return filePath;
}

function writeRegistryFile(skills: GeneratedSkill[]) {
  const jsSKills = skills
    .filter((s) => s.ecosystem === "javascript")
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const pySkills = skills
    .filter((s) => s.ecosystem === "python")
    .sort((a, b) => a.slug.localeCompare(b.slug));

  let imports = 'import type { SentrySkill } from "../types";\n';

  for (const s of jsSKills) {
    imports += `import ${s.varName} from "./js/${s.slug}";\n`;
  }
  for (const s of pySkills) {
    imports += `import ${s.varName} from "./python/${s.slug}";\n`;
  }

  const allSkills = [...jsSKills, ...pySkills].sort((a, b) =>
    a.varName.localeCompare(b.varName)
  );
  const skillEntries = allSkills.map((s) => `  ${s.varName},`).join("\n");

  const content = `${imports}
const skills: Record<string, SentrySkill> = {
${skillEntries}
};

const categoryPriority: Record<string, number> = {
  framework: 3,
  library: 1,
  runtime: 2,
};

export function resolveSkills(libs: string[]) {
  const matched = libs
    .filter((lib) => lib in skills)
    .map((lib) => skills[lib])
    .sort((a, b) => {
      const catDiff =
        (categoryPriority[b.category] ?? 0) -
        (categoryPriority[a.category] ?? 0);
      if (catDiff !== 0) {
        return catDiff;
      }
      return b.rank - a.rank;
    });

  return {
    dominant: matched[0] ?? null,
    secondary: matched.slice(1),
  };
}

export function getAvailableFeatures(libs: string[]) {
  const { dominant, secondary } = resolveSkills(libs);
  if (!dominant) {
    return { dominantLib: null, features: [], matchedLibs: [] as string[] };
  }

  const allSkills = [dominant, ...secondary];
  const seen = new Set<string>();
  const features: Array<{
    description: string;
    lib: string;
    name: string;
    slug: string;
  }> = [];

  for (const skill of allSkills) {
    for (const feature of skill.features) {
      if (!seen.has(feature.slug)) {
        seen.add(feature.slug);
        features.push({
          description: feature.description,
          lib: skill.slug,
          name: feature.name,
          slug: feature.slug,
        });
      }
    }
  }

  return {
    dominantLib: dominant.slug,
    features,
    matchedLibs: allSkills.map((s) => s.slug),
  };
}

export { skills };
`;

  writeFileSync(join(SKILLS_DIR, "registry.ts"), content, "utf-8");
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔧 Sentry Skills Generator\n");

  // 1. Read sdks.json
  const sdksRaw = readFileSync(SDKS_PATH, "utf-8");
  const sdks: Record<string, SdkEntry> = JSON.parse(sdksRaw);

  const generated: GeneratedSkill[] = [];
  const failures: string[] = [];

  // 2. Process JavaScript SDKs
  const jsEntries = Object.entries(sdks)
    .filter(([key]) => key.startsWith("sentry.javascript."))
    .filter(([_, entry]) => {
      // Skip entries without docs URLs or with generic JS docs
      const url = entry.main_docs_url;
      if (!url) {
        return false;
      }
      // Skip entries that point to the generic JS platform page (no specific guide)
      if (
        url === "https://docs.sentry.io/platforms/javascript" ||
        url === "https://docs.sentry.io/platforms/javascript/"
      ) {
        return false;
      }
      return true;
    })
    // Skip duplicate angular entry
    .filter(([key]) => key !== "sentry.javascript.angular-ivy")
    // Skip node-core (duplicate of node)
    .filter(([key]) => key !== "sentry.javascript.node-core")
    // Skip vercel-edge (generic JS page)
    .filter(([key]) => key !== "sentry.javascript.vercel-edge");

  console.log(`📦 Found ${jsEntries.length} JavaScript SDKs to process\n`);

  for (const [sdkKey, entry] of jsEntries) {
    const slug = extractSlug(sdkKey);
    const docsUrl = entry.main_docs_url ?? "";
    if (!docsUrl) {
      continue;
    }

    console.log(`→ [JS] ${entry.name || slug} (${docsUrl})`);

    const docsContent = await fetchDocsPage(docsUrl);
    if (!docsContent) {
      failures.push(`${slug} (JS): fetch failed`);
      continue;
    }

    const skill = await generateSkillJson(docsContent, {
      docsUrl,
      ecosystem: "javascript",
      name: entry.name || slug,
      packageUrl: entry.package_url,
      slug,
    });

    if (!skill) {
      failures.push(`${slug} (JS): agent failed`);
      continue;
    }

    // Ensure ecosystem and slug are correct
    skill.ecosystem = "javascript";
    skill.slug = slug;

    const filePath = writeSkillFile(skill, "javascript");
    generated.push({
      ecosystem: "javascript",
      filePath,
      slug,
      varName: toVarName(slug),
    });

    console.log(`  ✓ Generated ${filePath}`);
  }

  // 3. Process Python integrations
  console.log(
    `\n📦 Processing ${PYTHON_FRAMEWORK_INTEGRATIONS.length} Python integrations\n`
  );

  for (const integration of PYTHON_FRAMEWORK_INTEGRATIONS) {
    console.log(`→ [Python] ${integration.name} (${integration.url})`);

    const docsContent = await fetchDocsPage(integration.url);
    if (!docsContent) {
      failures.push(`${integration.slug} (Python): fetch failed`);
      continue;
    }

    // Also fetch the base Python getting-started for context
    const basePythonContent = await fetchDocsPage(
      "https://docs.sentry.io/platforms/python/"
    );

    const combinedContent = [
      `=== Base Python SDK Setup ===\n${basePythonContent || ""}`,
      `\n=== ${integration.name} Integration ===\n${docsContent}`,
    ].join("\n");

    const skill = await generateSkillJson(combinedContent, {
      docsUrl: integration.url,
      ecosystem: "python",
      name: integration.name,
      slug: integration.slug,
    });

    if (!skill) {
      failures.push(`${integration.slug} (Python): agent failed`);
      continue;
    }

    // Ensure ecosystem and slug are correct
    skill.ecosystem = "python";
    skill.slug = integration.slug;

    const filePath = writeSkillFile(skill, "python");
    generated.push({
      ecosystem: "python",
      filePath,
      slug: integration.slug,
      varName: toVarName(integration.slug),
    });

    console.log(`  ✓ Generated ${filePath}`);
  }

  // 4. Generate registry
  console.log("\n📝 Generating registry.ts...");
  writeRegistryFile(generated);
  console.log("  ✓ Generated src/skills/registry.ts");

  // 5. Summary
  console.log(`\n${"═".repeat(50)}`);
  console.log(`✅ Generated: ${generated.length} skills`);
  if (failures.length > 0) {
    console.log(`❌ Failed: ${failures.length}`);
    for (const f of failures) {
      console.log(`   - ${f}`);
    }
  }
  console.log("═".repeat(50));
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
