/**
 * Task 21: Measure approximate token count of get-docs output.
 * Target: under 2000 tokens for single-runtime, under 3000 for combo stack.
 *
 * Token estimation: ~4 chars per token is a common approximation for English + code.
 * We also count words as a secondary metric (roughly 1.3 tokens per word for code-heavy text).
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

// Test cases
const testCases: Array<{
  label: string;
  libs: string[];
  features: string[];
  type: "single" | "combo";
}> = [
  // Single-runtime requests (target: <2000 tokens)
  {
    label: '["nextjs"] all features',
    libs: ["nextjs"],
    features: [
      "error-monitoring",
      "tracing",
      "session-replay",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["node"] all features',
    libs: ["node"],
    features: [
      "error-monitoring",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["bun"] all features',
    libs: ["bun"],
    features: ["error-monitoring", "tracing", "logs", "crons", "user-feedback"],
    type: "single",
  },
  {
    label: '["cloudflare"] all features',
    libs: ["cloudflare"],
    features: ["error-monitoring", "tracing", "logs", "crons", "user-feedback"],
    type: "single",
  },
  {
    label: '["django"] all features',
    libs: ["django"],
    features: [
      "error-monitoring",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["flask"] all features',
    libs: ["flask"],
    features: [
      "error-monitoring",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  {
    label: '["fastapi"] all features',
    libs: ["fastapi"],
    features: [
      "error-monitoring",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "single",
  },
  // Combo stack requests (target: <3000 tokens)
  {
    label: '["hono", "cloudflare"] all features',
    libs: ["hono", "cloudflare"],
    features: ["error-monitoring", "tracing", "logs", "crons", "user-feedback"],
    type: "combo",
  },
  {
    label: '["hono", "bun"] error-monitoring + tracing',
    libs: ["hono", "bun"],
    features: ["error-monitoring", "tracing"],
    type: "combo",
  },
  {
    label: '["hono", "node"] all features',
    libs: ["hono", "node"],
    features: [
      "error-monitoring",
      "tracing",
      "profiling",
      "logs",
      "crons",
      "user-feedback",
    ],
    type: "combo",
  },
];

console.log("=".repeat(100));
console.log("Task 21: Token count measurement for get-docs output");
console.log("=".repeat(100));
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
console.log(
  "Label".padEnd(45) +
    "Type".padEnd(8) +
    "Chars".padEnd(8) +
    "Words".padEnd(8) +
    "~Tokens".padEnd(10) +
    "Budget".padEnd(8) +
    "Status"
);
console.log("-".repeat(100));

let allPass = true;
for (const r of results) {
  const status = r.pass ? "✓ OK" : "✗ OVER";
  if (!r.pass) {
    allPass = false;
  }
  console.log(
    r.label.padEnd(45) +
      r.type.padEnd(8) +
      String(r.chars).padEnd(8) +
      String(r.words).padEnd(8) +
      String(r.estTokens).padEnd(10) +
      String(r.budget).padEnd(8) +
      status
  );
}

console.log("-".repeat(100));
console.log("");

if (allPass) {
  console.log("All responses are within token budget.");
} else {
  console.log(
    "WARNING: Some responses exceed token budget. See details above."
  );
  // Log details of over-budget responses
  for (const r of results) {
    if (!r.pass) {
      console.log(
        `  ${r.label}: ${r.estTokens} tokens (${r.estTokens - r.budget} over budget of ${r.budget})`
      );
    }
  }
}
