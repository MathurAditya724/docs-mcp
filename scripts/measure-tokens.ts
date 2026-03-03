/**
 * Task 26 (final pass): Measure response size (characters and estimated tokens)
 * for every get-docs test case across the full test suite. Log a summary table
 * and verify all responses are within budget.
 *
 * Target: under 2000 tokens for single-runtime, under 3000 for combo stack.
 * Token estimation: ~4 chars per token (standard for mixed English + code).
 */
import { resolveSkills } from "../src/skills/registry";

function simulateGetDocs(libs: string[], features: string[]) {
  const { dominant, secondary } = resolveSkills(libs);

  if (!dominant) {
    return null;
  }

  const featureSet = new Set(features);

  const packageSet = new Set<string>();
  for (const pkg of dominant.packages) {
    packageSet.add(pkg);
  }
  for (const skill of secondary) {
    for (const pkg of skill.packages) {
      packageSet.add(pkg);
    }
  }

  const seenFeatures = new Set<string>();
  const matchedFeatures: Array<{
    slug: string;
    name: string;
    setup: string;
    code: string;
    lib: string;
  }> = [];

  for (const feature of dominant.features) {
    if (featureSet.has(feature.slug) && !seenFeatures.has(feature.slug)) {
      seenFeatures.add(feature.slug);
      matchedFeatures.push({
        slug: feature.slug,
        name: feature.name,
        setup: feature.setup,
        code: feature.code,
        lib: dominant.slug,
      });
    }
  }

  for (const skill of secondary) {
    for (const feature of skill.features) {
      if (featureSet.has(feature.slug) && !seenFeatures.has(feature.slug)) {
        seenFeatures.add(feature.slug);
        matchedFeatures.push({
          slug: feature.slug,
          name: feature.name,
          setup: feature.setup,
          code: feature.code,
          lib: skill.slug,
        });
      }
    }
  }

  const secondaryPatterns: Array<{
    lib: string;
    description: string;
    setup: string;
    code: string;
  }> = [];

  for (const skill of secondary) {
    if (skill.gettingStarted) {
      secondaryPatterns.push({
        lib: skill.slug,
        description: `${skill.name} integration pattern`,
        setup: skill.gettingStarted,
        code: skill.features
          .filter((f) => featureSet.has(f.slug))
          .map((f) => f.code)
          .join("\n\n"),
      });
    }
  }

  return {
    stack: {
      dominant: dominant.slug,
      secondary: secondary.map((s) => s.slug),
      ecosystem: dominant.ecosystem,
    },
    packages: [...packageSet],
    gettingStarted: dominant.gettingStarted,
    features: matchedFeatures,
    secondaryPatterns,
  };
}

const WHITESPACE_RE = /\s+/;

function estimateTokens(text: string): number {
  // Approximate token count: ~4 characters per token for mixed English + code
  return Math.ceil(text.length / 4);
}

function wordCount(text: string): number {
  return text.split(WHITESPACE_RE).filter((w) => w.length > 0).length;
}

// All test cases from the full test suite (test-mcp.ts, test-get-docs.ts, test-edge-cases.ts)
const testCases: Array<{
  label: string;
  libs: string[];
  features: string[];
  type: "single" | "combo";
}> = [
  // ── Single-runtime, all features (target: <2000 tokens) ──
  {
    label: '["nextjs"] all 7 features',
    libs: ["nextjs"],
    features: [
      "errors",
      "tracing",
      "replay",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["node"] all 6 features',
    libs: ["node"],
    features: [
      "errors",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["bun"] all 5 features',
    libs: ["bun"],
    features: ["errors", "tracing", "logs", "crons", "user-feedback"],
    type: "single",
  },
  {
    label: '["cloudflare"] all 5 features',
    libs: ["cloudflare"],
    features: ["errors", "tracing", "logs", "crons", "user-feedback"],
    type: "single",
  },
  {
    label: '["django"] all 6 features',
    libs: ["django"],
    features: [
      "errors",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["flask"] all 6 features',
    libs: ["flask"],
    features: [
      "errors",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["fastapi"] all 6 features',
    libs: ["fastapi"],
    features: [
      "errors",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  // ── Single-runtime, partial features (from test-mcp.ts) ──
  {
    label: '["nextjs"] 5 features (no crons/feedback)',
    libs: ["nextjs"],
    features: ["errors", "tracing", "replay", "logs", "profiling"],
    type: "single",
  },
  {
    label: '["django"] 3 features',
    libs: ["django"],
    features: ["errors", "tracing", "profiling"],
    type: "single",
  },
  {
    label: '["bun"] 2 features',
    libs: ["bun"],
    features: ["errors", "tracing"],
    type: "single",
  },
  // ── Combo stacks (target: <3000 tokens) ──
  {
    label: '["hono","cloudflare"] all 5 features',
    libs: ["hono", "cloudflare"],
    features: ["errors", "tracing", "logs", "crons", "user-feedback"],
    type: "combo",
  },
  {
    label: '["hono","cloudflare"] 3 features',
    libs: ["hono", "cloudflare"],
    features: ["errors", "tracing", "logs"],
    type: "combo",
  },
  {
    label: '["hono","cloudflare"] 1 feature',
    libs: ["hono", "cloudflare"],
    features: ["errors"],
    type: "combo",
  },
  {
    label: '["hono","bun"] 2 features',
    libs: ["hono", "bun"],
    features: ["errors", "tracing"],
    type: "combo",
  },
  {
    label: '["hono","node"] all 6 features',
    libs: ["hono", "node"],
    features: [
      "errors",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "combo",
  },
  {
    label: '["hono","node"] 3 features',
    libs: ["hono", "node"],
    features: ["errors", "tracing", "logs"],
    type: "combo",
  },
  // ── Cross-ecosystem (picks one, treated as single) ──
  {
    label: '["node","flask"] cross-eco 2 features',
    libs: ["node", "flask"],
    features: ["errors", "tracing"],
    type: "single",
  },
  // ── Edge case: single known + unknown libs ──
  {
    label: '["node","express","koa"] 2 features',
    libs: ["node", "express", "koa"],
    features: ["errors", "tracing"],
    type: "single",
  },
];

console.log("=".repeat(110));
console.log("Task 26: Final pass — response size for all get-docs test cases");
console.log(
  "Budget: <2000 tokens (single-runtime), <3000 tokens (combo stack)"
);
console.log("=".repeat(110));
console.log("");

const results: Array<{
  label: string;
  type: string;
  chars: number;
  words: number;
  estTokens: number;
  budget: number;
  pass: boolean;
}> = [];

for (const tc of testCases) {
  const response = simulateGetDocs(tc.libs, tc.features);
  if (!response) {
    console.log(`SKIP: ${tc.label} — no response`);
    continue;
  }

  const json = JSON.stringify(response, null, 2);
  const chars = json.length;
  const words = wordCount(json);
  const estTokens = estimateTokens(json);
  const budget = tc.type === "single" ? 2000 : 3000;
  const pass = estTokens <= budget;

  results.push({
    label: tc.label,
    type: tc.type,
    chars,
    words,
    estTokens,
    budget,
    pass,
  });
}

// Print summary table
const COL = {
  label: 48,
  type: 8,
  chars: 8,
  words: 8,
  tokens: 10,
  budget: 8,
  pct: 8,
  status: 6,
};
console.log(
  "Label".padEnd(COL.label) +
    "Type".padEnd(COL.type) +
    "Chars".padEnd(COL.chars) +
    "Words".padEnd(COL.words) +
    "~Tokens".padEnd(COL.tokens) +
    "Budget".padEnd(COL.budget) +
    "% Used".padEnd(COL.pct) +
    "Status"
);
console.log("-".repeat(110));

let allPass = true;
for (const r of results) {
  const status = r.pass ? "✓ OK" : "✗ OVER";
  const pct = Math.round((r.estTokens / r.budget) * 100) + "%";
  if (!r.pass) {
    allPass = false;
  }
  console.log(
    r.label.padEnd(COL.label) +
      r.type.padEnd(COL.type) +
      String(r.chars).padEnd(COL.chars) +
      String(r.words).padEnd(COL.words) +
      String(r.estTokens).padEnd(COL.tokens) +
      String(r.budget).padEnd(COL.budget) +
      pct.padEnd(COL.pct) +
      status
  );
}

console.log("-".repeat(110));

// Summary statistics
const singleResults = results.filter((r) => r.type === "single");
const comboResults = results.filter((r) => r.type === "combo");
const maxSingle = singleResults.reduce(
  (max, r) => Math.max(max, r.estTokens),
  0
);
const maxCombo = comboResults.reduce((max, r) => Math.max(max, r.estTokens), 0);
const avgSingle = Math.round(
  singleResults.reduce((sum, r) => sum + r.estTokens, 0) / singleResults.length
);
const avgCombo =
  comboResults.length > 0
    ? Math.round(
        comboResults.reduce((sum, r) => sum + r.estTokens, 0) /
          comboResults.length
      )
    : 0;

console.log("");
console.log(
  `Total test cases: ${results.length} (${singleResults.length} single, ${comboResults.length} combo)`
);
console.log(
  `Single-runtime: max ${maxSingle} tokens (${Math.round((maxSingle / 2000) * 100)}% of 2000 budget), avg ${avgSingle} tokens`
);
if (comboResults.length > 0) {
  console.log(
    `Combo stack:    max ${maxCombo} tokens (${Math.round((maxCombo / 3000) * 100)}% of 3000 budget), avg ${avgCombo} tokens`
  );
}
console.log("");

if (allPass) {
  console.log(`All ${results.length} responses are within token budget.`);
} else {
  console.log(
    "WARNING: Some responses exceed token budget. See details above."
  );
  for (const r of results) {
    if (!r.pass) {
      console.log(
        `  ${r.label}: ${r.estTokens} tokens (${r.estTokens - r.budget} over budget of ${r.budget})`
      );
    }
  }
  process.exit(1);
}
