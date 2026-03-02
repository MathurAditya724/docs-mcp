/**
 * Task 16: Test skill resolution logic with specified combos.
 * Verifies dominant/secondary assignments make sense.
 */
import { getAvailableFeatures, resolveSkills } from "../src/skills/registry";

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

// Test 1: ["hono", "cloudflare"] → dominant: cloudflare, secondary: [hono]
console.log('\nTest 1: ["hono", "cloudflare"]');
{
  const result = resolveSkills(["hono", "cloudflare"]);
  assert(
    result.dominant?.slug === "cloudflare",
    `dominant should be cloudflare, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 1,
    `secondary length should be 1, got: ${result.secondary.length}`
  );
  assert(
    result.secondary[0]?.slug === "hono",
    `secondary[0] should be hono, got: ${result.secondary[0]?.slug}`
  );
  assert(
    result.unmatchedLibs.length === 0,
    `unmatchedLibs should be empty, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
  assert(
    result.ecosystemMismatchedLibs.length === 0,
    "ecosystemMismatchedLibs should be empty"
  );
}

// Test 2: ["hono", "bun"] → dominant: bun, secondary: [hono]
console.log('\nTest 2: ["hono", "bun"]');
{
  const result = resolveSkills(["hono", "bun"]);
  assert(
    result.dominant?.slug === "bun",
    `dominant should be bun, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 1,
    `secondary length should be 1, got: ${result.secondary.length}`
  );
  assert(
    result.secondary[0]?.slug === "hono",
    `secondary[0] should be hono, got: ${result.secondary[0]?.slug}`
  );
}

// Test 3: ["hono", "node"] → dominant: node, secondary: [hono]
console.log('\nTest 3: ["hono", "node"]');
{
  const result = resolveSkills(["hono", "node"]);
  assert(
    result.dominant?.slug === "node",
    `dominant should be node, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 1,
    `secondary length should be 1, got: ${result.secondary.length}`
  );
  assert(
    result.secondary[0]?.slug === "hono",
    `secondary[0] should be hono, got: ${result.secondary[0]?.slug}`
  );
}

// Test 4: ["nextjs"] → dominant: nextjs, secondary: []
console.log('\nTest 4: ["nextjs"]');
{
  const result = resolveSkills(["nextjs"]);
  assert(
    result.dominant?.slug === "nextjs",
    `dominant should be nextjs, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 0,
    `secondary should be empty, got: ${result.secondary.length}`
  );
}

// Test 5: ["bun"] → dominant: bun, secondary: []
console.log('\nTest 5: ["bun"]');
{
  const result = resolveSkills(["bun"]);
  assert(
    result.dominant?.slug === "bun",
    `dominant should be bun, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 0,
    `secondary should be empty, got: ${result.secondary.length}`
  );
}

// Test 6: ["node", "flask"] → should pick one ecosystem, not mix
console.log('\nTest 6: ["node", "flask"] — cross-ecosystem');
{
  const result = resolveSkills(["node", "flask"]);
  assert(result.dominant !== null, "dominant should not be null");
  // Both have count=1, so tie-break by rankSum.
  // node: categoryPriority[runtime]=2 * rank=3 = 6
  // flask: categoryPriority[framework]=3 * rank=7 = 21
  // flask wins tie-break
  const dominantSlug = result.dominant?.slug;
  assert(
    dominantSlug === "node" || dominantSlug === "flask",
    `dominant should be node or flask, got: ${dominantSlug}`
  );
  assert(
    result.secondary.length === 0,
    `secondary should be empty (other ecosystem filtered out), got: ${result.secondary.length}`
  );
  assert(
    result.ecosystemMismatchedLibs.length === 1,
    `ecosystemMismatchedLibs should have 1 entry, got: ${result.ecosystemMismatchedLibs.length}`
  );
  console.log(
    `  ℹ dominant picked: ${dominantSlug}, ecosystemMismatchedLibs: ${JSON.stringify(result.ecosystemMismatchedLibs)}`
  );
}

// Also verify getAvailableFeatures for cross-ecosystem
console.log(
  '\nTest 6b: getAvailableFeatures(["node", "flask"]) — ecosystemNote present'
);
{
  const result = getAvailableFeatures(["node", "flask"]);
  assert(result.dominantLib !== null, "dominantLib should not be null");
  assert(
    result.unmatchedLibs.length === 1,
    `unmatchedLibs should have 1 ecosystem-mismatched entry, got: ${result.unmatchedLibs.length}`
  );
  assert("ecosystemNote" in result, "result should have ecosystemNote");
  console.log(
    `  ℹ dominantLib: ${result.dominantLib}, unmatchedLibs: ${JSON.stringify(result.unmatchedLibs)}`
  );
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
if (failed > 0) {
  process.exit(1);
}
