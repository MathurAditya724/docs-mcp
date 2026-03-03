/**
 * Task 22: Comprehensive MCP test script.
 * Imports registry functions directly and tests both tool handlers
 * programmatically with all specified test cases.
 */
import {
  getAvailableFeatures,
  resolveSkills,
  skills,
} from "../src/skills/registry";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.log(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

/**
 * Simulate the get-docs response assembly from src/mcp.ts
 */
function simulateGetDocs(
  libs: string[],
  features: string[]
): {
  stack: { dominant: string; secondary: string[]; ecosystem: string };
  packages: string[];
  gettingStarted: string;
  features: Array<{
    slug: string;
    name: string;
    setup: string;
    code: string;
    lib: string;
  }>;
  secondaryPatterns: Array<{
    lib: string;
    description: string;
    setup: string;
    code: string;
  }>;
} | null {
  const { dominant, secondary, unmatchedLibs, ecosystemMismatchedLibs } =
    resolveSkills(libs);

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

// =============================================================================
// get-available-features tests
// =============================================================================

// Test 1: get-available-features(["hono", "cloudflare"])
console.log('\nTest 1: get-available-features(["hono", "cloudflare"])');
{
  const result = getAvailableFeatures(["hono", "cloudflare"]);
  assert(
    result.dominantLib === "cloudflare",
    `dominant: cloudflare, got: ${result.dominantLib}`
  );
  assert(result.matchedLibs.includes("hono"), "hono in matchedLibs");
  assert(
    result.matchedLibs.includes("cloudflare"),
    "cloudflare in matchedLibs"
  );
  assert(
    result.unmatchedLibs.length === 0,
    `no unmatchedLibs, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
  assert(
    result.features.length > 0,
    `has features, got: ${result.features.length}`
  );
  // Features should be attributed to cloudflare (dominant) first
  const errorMonitoring = result.features.find((f) => f.slug === "errors");
  assert(
    errorMonitoring?.lib === "cloudflare",
    `errors from cloudflare, got: ${errorMonitoring?.lib}`
  );
}

// Test 2: get-available-features(["hono", "bun"])
console.log('\nTest 2: get-available-features(["hono", "bun"])');
{
  const result = getAvailableFeatures(["hono", "bun"]);
  assert(
    result.dominantLib === "bun",
    `dominant: bun, got: ${result.dominantLib}`
  );
  assert(result.matchedLibs.includes("hono"), "hono in matchedLibs");
  assert(result.matchedLibs.includes("bun"), "bun in matchedLibs");
  assert(
    result.unmatchedLibs.length === 0,
    `no unmatchedLibs, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
}

// Test 3: get-available-features(["hono", "node"])
console.log('\nTest 3: get-available-features(["hono", "node"])');
{
  const result = getAvailableFeatures(["hono", "node"]);
  assert(
    result.dominantLib === "node",
    `dominant: node, got: ${result.dominantLib}`
  );
  assert(result.matchedLibs.includes("hono"), "hono in matchedLibs");
  assert(result.matchedLibs.includes("node"), "node in matchedLibs");
}

// Test 4: get-available-features(["nextjs"])
console.log('\nTest 4: get-available-features(["nextjs"])');
{
  const result = getAvailableFeatures(["nextjs"]);
  assert(
    result.dominantLib === "nextjs",
    `dominant: nextjs, got: ${result.dominantLib}`
  );
  assert(
    result.matchedLibs.length === 1 && result.matchedLibs[0] === "nextjs",
    `matchedLibs: [nextjs], got: ${JSON.stringify(result.matchedLibs)}`
  );
  assert(
    result.features.length >= 5,
    `5+ features listed, got: ${result.features.length}`
  );
  // Verify key features are present
  const featureSlugs = result.features.map((f) => f.slug);
  assert(featureSlugs.includes("errors"), "has errors");
  assert(featureSlugs.includes("tracing"), "has tracing");
  assert(featureSlugs.includes("replay"), "has replay");
  assert(featureSlugs.includes("profiling"), "has profiling");
  assert(featureSlugs.includes("logs"), "has logs");
}

// Test 5: get-available-features(["bun"])
console.log('\nTest 5: get-available-features(["bun"])');
{
  const result = getAvailableFeatures(["bun"]);
  assert(
    result.dominantLib === "bun",
    `dominant: bun, got: ${result.dominantLib}`
  );
  assert(
    result.matchedLibs.length === 1 && result.matchedLibs[0] === "bun",
    `matchedLibs: [bun], got: ${JSON.stringify(result.matchedLibs)}`
  );
  assert(
    result.features.length > 0,
    `has features, got: ${result.features.length}`
  );
}

// Test 6: get-available-features(["express", "node"])
console.log('\nTest 6: get-available-features(["express", "node"])');
{
  const result = getAvailableFeatures(["express", "node"]);
  assert(
    result.dominantLib === "node",
    `dominant: node, got: ${result.dominantLib}`
  );
  assert(
    result.unmatchedLibs.includes("express"),
    `express in unmatchedLibs, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
  assert(result.matchedLibs.includes("node"), "node in matchedLibs");
  assert(!result.matchedLibs.includes("express"), "express NOT in matchedLibs");
}

// Test 7: get-available-features(["node", "django"])
console.log('\nTest 7: get-available-features(["node", "django"])');
{
  const result = getAvailableFeatures(["node", "django"]);
  // Should pick one ecosystem, ignore the other
  assert(
    result.dominantLib === "node" || result.dominantLib === "django",
    `dominant should be node or django, got: ${result.dominantLib}`
  );
  assert(
    result.unmatchedLibs.length === 1,
    `1 lib in unmatchedLibs (ecosystem mismatch), got: ${result.unmatchedLibs.length}`
  );
  if (result.dominantLib === "django") {
    assert(
      result.unmatchedLibs.includes("node"),
      "node in unmatchedLibs when django is dominant"
    );
  } else {
    assert(
      result.unmatchedLibs.includes("django"),
      "django in unmatchedLibs when node is dominant"
    );
  }
  // Should have ecosystem note
  assert(
    "ecosystemNote" in result,
    "should have ecosystemNote for cross-ecosystem mixing"
  );
  console.log(`  ℹ dominant picked: ${result.dominantLib}`);
}

// =============================================================================
// get-docs tests
// =============================================================================

// Test 8: get-docs(["hono", "cloudflare"], ["errors", "tracing", "logs"])
console.log(
  '\nTest 8: get-docs(["hono", "cloudflare"], ["errors", "tracing", "logs"])'
);
{
  const result = simulateGetDocs(
    ["hono", "cloudflare"],
    ["errors", "tracing", "logs"]
  );
  assert(result !== null, "result should not be null");

  // Stack
  assert(
    result!.stack.dominant === "cloudflare",
    `dominant: cloudflare, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.ecosystem === "javascript",
    `ecosystem: javascript, got: ${result!.stack.ecosystem}`
  );

  // No LLM call — response is structured JSON
  assert(
    typeof result!.gettingStarted === "string" &&
      result!.gettingStarted.length > 0,
    "gettingStarted is a non-empty string (deterministic, not LLM-generated)"
  );
  assert(
    result!.gettingStarted === skills["cloudflare"].gettingStarted,
    "gettingStarted comes from cloudflare skill data"
  );

  // Features
  assert(
    result!.features.length === 3,
    `3 features, got: ${result!.features.length}`
  );
  const featureSlugs = result!.features.map((f) => f.slug);
  assert(featureSlugs.includes("errors"), "has errors");
  assert(featureSlugs.includes("tracing"), "has tracing");
  assert(featureSlugs.includes("logs"), "has logs");

  // All features from cloudflare (dominant)
  for (const f of result!.features) {
    assert(
      f.lib === "cloudflare",
      `feature ${f.slug} from cloudflare, got: ${f.lib}`
    );
  }

  // secondaryPatterns for hono
  assert(
    result!.secondaryPatterns.length === 1,
    `1 secondary pattern, got: ${result!.secondaryPatterns.length}`
  );
  assert(
    result!.secondaryPatterns[0].lib === "hono",
    `secondary pattern for hono, got: ${result!.secondaryPatterns[0].lib}`
  );
  assert(
    result!.secondaryPatterns[0].code.length > 0,
    "hono secondary pattern has code"
  );
}

// Test 9: get-docs(["nextjs"], ["errors", "tracing", "replay", "logs", "profiling"])
console.log(
  '\nTest 9: get-docs(["nextjs"], ["errors", "tracing", "replay", "logs", "profiling"])'
);
{
  const result = simulateGetDocs(
    ["nextjs"],
    ["errors", "tracing", "replay", "logs", "profiling"]
  );
  assert(result !== null, "result should not be null");

  // Full nextjs guide
  assert(
    result!.stack.dominant === "nextjs",
    `dominant: nextjs, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.secondary.length === 0,
    `no secondary, got: ${JSON.stringify(result!.stack.secondary)}`
  );
  assert(
    result!.gettingStarted === skills["nextjs"].gettingStarted,
    "gettingStarted from nextjs skill"
  );

  // All 5 features
  assert(
    result!.features.length === 5,
    `5 features, got: ${result!.features.length}`
  );
  const featureSlugs = result!.features.map((f) => f.slug);
  assert(featureSlugs.includes("errors"), "has errors");
  assert(featureSlugs.includes("tracing"), "has tracing");
  assert(featureSlugs.includes("replay"), "has replay");
  assert(featureSlugs.includes("logs"), "has logs");
  assert(featureSlugs.includes("profiling"), "has profiling");

  // All from nextjs
  for (const f of result!.features) {
    assert(f.lib === "nextjs", `feature ${f.slug} from nextjs, got: ${f.lib}`);
  }

  // No secondary patterns
  assert(
    result!.secondaryPatterns.length === 0,
    `no secondary patterns, got: ${result!.secondaryPatterns.length}`
  );

  // Packages include @sentry/nextjs
  assert(
    result!.packages.includes("@sentry/nextjs"),
    `packages include @sentry/nextjs, got: ${JSON.stringify(result!.packages)}`
  );
}

// Test 10: get-docs(["hono", "bun"], ["errors", "tracing"])
console.log('\nTest 10: get-docs(["hono", "bun"], ["errors", "tracing"])');
{
  const result = simulateGetDocs(["hono", "bun"], ["errors", "tracing"]);
  assert(result !== null, "result should not be null");

  assert(
    result!.stack.dominant === "bun",
    `dominant: bun, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.secondary.includes("hono"),
    `hono in secondary, got: ${JSON.stringify(result!.stack.secondary)}`
  );

  // gettingStarted from bun
  assert(
    result!.gettingStarted === skills["bun"].gettingStarted,
    "gettingStarted from bun skill"
  );

  // Features from bun
  assert(
    result!.features.length === 2,
    `2 features, got: ${result!.features.length}`
  );
  for (const f of result!.features) {
    assert(f.lib === "bun", `feature ${f.slug} from bun, got: ${f.lib}`);
  }

  // Hono patterns
  assert(
    result!.secondaryPatterns.length === 1,
    `1 secondary pattern, got: ${result!.secondaryPatterns.length}`
  );
  assert(
    result!.secondaryPatterns[0].lib === "hono",
    "hono in secondary patterns"
  );

  // Packages
  assert(
    result!.packages.includes("@sentry/bun"),
    "packages include @sentry/bun"
  );
}

// Test 11: get-docs(["django"], ["errors", "tracing", "profiling"])
console.log(
  '\nTest 11: get-docs(["django"], ["errors", "tracing", "profiling"])'
);
{
  const result = simulateGetDocs(
    ["django"],
    ["errors", "tracing", "profiling"]
  );
  assert(result !== null, "result should not be null");

  // Python stack
  assert(
    result!.stack.dominant === "django",
    `dominant: django, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.ecosystem === "python",
    `ecosystem: python, got: ${result!.stack.ecosystem}`
  );
  assert(
    result!.stack.secondary.length === 0,
    `no secondary, got: ${JSON.stringify(result!.stack.secondary)}`
  );

  // gettingStarted from django
  assert(
    result!.gettingStarted === skills["django"].gettingStarted,
    "gettingStarted from django skill"
  );

  // 3 features
  assert(
    result!.features.length === 3,
    `3 features, got: ${result!.features.length}`
  );
  const featureSlugs = result!.features.map((f) => f.slug);
  assert(featureSlugs.includes("errors"), "has errors");
  assert(featureSlugs.includes("tracing"), "has tracing");
  assert(featureSlugs.includes("profiling"), "has profiling");

  // All from django
  for (const f of result!.features) {
    assert(f.lib === "django", `feature ${f.slug} from django, got: ${f.lib}`);
  }

  // Packages include sentry-sdk
  assert(
    result!.packages.includes("sentry-sdk"),
    `packages include sentry-sdk, got: ${JSON.stringify(result!.packages)}`
  );

  // No secondary patterns
  assert(
    result!.secondaryPatterns.length === 0,
    `no secondary patterns, got: ${result!.secondaryPatterns.length}`
  );
}

// =============================================================================
// Summary
// =============================================================================
console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
if (failed > 0) {
  process.exit(1);
}
