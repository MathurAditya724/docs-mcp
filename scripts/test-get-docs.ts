/**
 * Task 17: Test get-docs output for combo stacks.
 * Verifies: gettingStarted from dominant, features deduplicated,
 * secondaryPatterns shows library wiring.
 */
import { resolveSkills, skills } from "../src/skills/registry";

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

// =============================================================================
// Test 1: ["hono", "cloudflare"] with errors, tracing, logs
// =============================================================================
console.log(
  '\nTest 1: get-docs(["hono", "cloudflare"], ["errors", "tracing", "logs"])'
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
    `dominant should be cloudflare, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.secondary.length === 1 &&
      result!.stack.secondary[0] === "hono",
    `secondary should be [hono], got: ${JSON.stringify(result!.stack.secondary)}`
  );
  assert(
    result!.stack.ecosystem === "javascript",
    `ecosystem should be javascript, got: ${result!.stack.ecosystem}`
  );

  // gettingStarted from dominant (cloudflare), not hono
  assert(
    result!.gettingStarted === skills["cloudflare"].gettingStarted,
    "gettingStarted should come from cloudflare skill"
  );
  assert(
    result!.gettingStarted !== skills["hono"].gettingStarted,
    "gettingStarted should NOT come from hono skill"
  );

  // Packages — only @sentry/cloudflare (hono has empty packages)
  assert(
    result!.packages.includes("@sentry/cloudflare"),
    "packages should include @sentry/cloudflare"
  );
  assert(
    result!.packages.length === 1,
    `packages should have 1 entry, got: ${result!.packages.length}`
  );

  // Features — deduplicated, all from cloudflare (dominant takes priority)
  assert(
    result!.features.length === 3,
    `should have 3 features, got: ${result!.features.length}`
  );
  const featureSlugs = result!.features.map((f) => f.slug);
  assert(featureSlugs.includes("errors"), "features should include errors");
  assert(featureSlugs.includes("tracing"), "features should include tracing");
  assert(featureSlugs.includes("logs"), "features should include logs");

  // All features should be attributed to cloudflare (dominant takes priority since both have them)
  for (const f of result!.features) {
    assert(
      f.lib === "cloudflare",
      `feature ${f.slug} should be from cloudflare (dominant), got: ${f.lib}`
    );
  }

  // secondaryPatterns — hono wiring present
  assert(
    result!.secondaryPatterns.length === 1,
    `should have 1 secondary pattern, got: ${result!.secondaryPatterns.length}`
  );
  assert(
    result!.secondaryPatterns[0].lib === "hono",
    `secondary pattern should be for hono, got: ${result!.secondaryPatterns[0].lib}`
  );
  assert(
    result!.secondaryPatterns[0].setup.includes("Hono"),
    "hono secondary pattern setup should mention Hono"
  );
  assert(
    result!.secondaryPatterns[0].code.length > 0,
    "hono secondary pattern code should not be empty"
  );
}

// =============================================================================
// Test 2: ["hono", "bun"] with errors, tracing
// =============================================================================
console.log('\nTest 2: get-docs(["hono", "bun"], ["errors", "tracing"])');
{
  const result = simulateGetDocs(["hono", "bun"], ["errors", "tracing"]);
  assert(result !== null, "result should not be null");

  assert(
    result!.stack.dominant === "bun",
    `dominant should be bun, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.secondary[0] === "hono",
    `secondary should include hono, got: ${JSON.stringify(result!.stack.secondary)}`
  );

  // gettingStarted from bun
  assert(
    result!.gettingStarted === skills["bun"].gettingStarted,
    "gettingStarted should come from bun skill"
  );

  // Packages — only @sentry/bun
  assert(
    result!.packages.includes("@sentry/bun"),
    "packages should include @sentry/bun"
  );
  assert(
    result!.packages.length === 1,
    `packages should have 1 entry, got: ${result!.packages.length}`
  );

  // Features from bun (dominant)
  assert(
    result!.features.length === 2,
    `should have 2 features, got: ${result!.features.length}`
  );
  for (const f of result!.features) {
    assert(
      f.lib === "bun",
      `feature ${f.slug} should be from bun (dominant), got: ${f.lib}`
    );
  }

  // secondaryPatterns for hono
  assert(
    result!.secondaryPatterns.length === 1,
    `should have 1 secondary pattern, got: ${result!.secondaryPatterns.length}`
  );
  assert(
    result!.secondaryPatterns[0].lib === "hono",
    "secondary pattern should be for hono"
  );
}

// =============================================================================
// Test 3: ["hono", "node"] with errors, tracing, logs
// =============================================================================
console.log(
  '\nTest 3: get-docs(["hono", "node"], ["errors", "tracing", "logs"])'
);
{
  const result = simulateGetDocs(
    ["hono", "node"],
    ["errors", "tracing", "logs"]
  );
  assert(result !== null, "result should not be null");

  assert(
    result!.stack.dominant === "node",
    `dominant should be node, got: ${result!.stack.dominant}`
  );

  // gettingStarted from node
  assert(
    result!.gettingStarted === skills["node"].gettingStarted,
    "gettingStarted should come from node skill"
  );

  // Features all from node
  for (const f of result!.features) {
    assert(
      f.lib === "node",
      `feature ${f.slug} should be from node (dominant), got: ${f.lib}`
    );
  }

  // secondaryPatterns for hono with code for the requested features
  assert(
    result!.secondaryPatterns.length === 1,
    "should have 1 secondary pattern for hono"
  );
  assert(
    result!.secondaryPatterns[0].code.includes("Hono"),
    "hono secondary pattern code should include Hono-specific examples"
  );
}

// =============================================================================
// Test 4: ["nextjs"] with all features — single runtime, no secondary
// =============================================================================
console.log(
  '\nTest 4: get-docs(["nextjs"], ["errors", "tracing", "replay", "profiling", "logs"])'
);
{
  const result = simulateGetDocs(
    ["nextjs"],
    ["errors", "tracing", "replay", "profiling", "logs"]
  );
  assert(result !== null, "result should not be null");

  assert(
    result!.stack.dominant === "nextjs",
    `dominant should be nextjs, got: ${result!.stack.dominant}`
  );
  assert(
    result!.stack.secondary.length === 0,
    `secondary should be empty, got: ${JSON.stringify(result!.stack.secondary)}`
  );

  // gettingStarted from nextjs
  assert(
    result!.gettingStarted === skills["nextjs"].gettingStarted,
    "gettingStarted should come from nextjs skill"
  );

  // 5 features requested, all from nextjs
  assert(
    result!.features.length === 5,
    `should have 5 features, got: ${result!.features.length}`
  );
  for (const f of result!.features) {
    assert(
      f.lib === "nextjs",
      `feature ${f.slug} should be from nextjs, got: ${f.lib}`
    );
  }

  // No secondary patterns
  assert(
    result!.secondaryPatterns.length === 0,
    `should have 0 secondary patterns, got: ${result!.secondaryPatterns.length}`
  );
}

// =============================================================================
// Test 5: ["bun"] — single runtime, no secondary
// =============================================================================
console.log('\nTest 5: get-docs(["bun"], ["errors", "tracing"])');
{
  const result = simulateGetDocs(["bun"], ["errors", "tracing"]);
  assert(result !== null, "result should not be null");

  assert(
    result!.stack.dominant === "bun",
    `dominant should be bun, got: ${result!.stack.dominant}`
  );
  assert(result!.stack.secondary.length === 0, "secondary should be empty");
  assert(
    result!.secondaryPatterns.length === 0,
    "should have 0 secondary patterns"
  );
  assert(
    result!.features.length === 2,
    `should have 2 features, got: ${result!.features.length}`
  );
}

// =============================================================================
// Test 6: ["node", "flask"] — cross-ecosystem, pick one
// =============================================================================
console.log('\nTest 6: get-docs(["node", "flask"], ["errors", "tracing"])');
{
  const result = simulateGetDocs(["node", "flask"], ["errors", "tracing"]);
  assert(result !== null, "result should not be null");

  // Should pick one ecosystem only — no mix
  const dominant = result!.stack.dominant;
  assert(
    dominant === "node" || dominant === "flask",
    `dominant should be node or flask, got: ${dominant}`
  );
  assert(
    result!.stack.secondary.length === 0,
    `secondary should be empty (other ecosystem filtered), got: ${JSON.stringify(result!.stack.secondary)}`
  );
  assert(
    result!.secondaryPatterns.length === 0,
    "should have 0 secondary patterns (no cross-ecosystem mixing)"
  );
  console.log(`  ℹ dominant picked: ${dominant}`);
}

// =============================================================================
// Test 7: Feature deduplication — dominant features take priority
// =============================================================================
console.log(
  '\nTest 7: Feature deduplication — ["hono", "cloudflare"] with overlapping features'
);
{
  // Both hono and cloudflare have errors, tracing, logs
  // Only cloudflare (dominant) versions should appear
  const result = simulateGetDocs(
    ["hono", "cloudflare"],
    ["errors", "tracing", "logs", "crons", "user-feedback"]
  );
  assert(result !== null, "result should not be null");

  // Count features by lib — all should be from cloudflare since it's dominant
  // and has all the same features as hono
  const cloudflareFeatures = result!.features.filter(
    (f) => f.lib === "cloudflare"
  );
  const honoFeatures = result!.features.filter((f) => f.lib === "hono");

  assert(
    cloudflareFeatures.length === 5,
    `all 5 features should come from cloudflare (dominant), got: ${cloudflareFeatures.length}`
  );
  assert(
    honoFeatures.length === 0,
    `no features should come from hono (secondary), got: ${honoFeatures.length}`
  );

  // But hono should still have a secondary pattern
  assert(
    result!.secondaryPatterns.length === 1,
    "should still have 1 secondary pattern for hono"
  );
}

// =============================================================================
// Test 8: secondaryPatterns code contains only requested features
// =============================================================================
console.log("\nTest 8: secondaryPatterns code filters by requested features");
{
  // Request only errors — hono secondary code should only include
  // errors code, not tracing or logs
  const result = simulateGetDocs(["hono", "cloudflare"], ["errors"]);
  assert(result !== null, "result should not be null");

  assert(
    result!.secondaryPatterns.length === 1,
    "should have 1 secondary pattern"
  );

  const honoPattern = result!.secondaryPatterns[0];
  // The code should only contain errors code from hono
  // (hono's errors code has "debug-sentry" in it)
  assert(
    honoPattern.code.includes("debug-sentry"),
    "hono secondary code should include errors example"
  );

  // Should NOT include tracing code (Sentry.startSpan)
  assert(
    !honoPattern.code.includes("startSpan"),
    "hono secondary code should NOT include tracing code when tracing not requested"
  );
}

// =============================================================================
// Summary
// =============================================================================
console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
if (failed > 0) {
  process.exit(1);
}
