/**
 * Task 18: Test edge cases for skill resolution and tool handlers.
 * Verifies: empty libs, all unknown libs, single known + multiple unknown.
 * Each should return sensible responses, not crash.
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

// ─── Edge Case 1: Empty libs array ─────────────────────────────────────

console.log("\nEdge Case 1: resolveSkills([])");
{
  const result = resolveSkills([]);
  assert(
    result.dominant === null,
    `dominant should be null, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 0,
    `secondary should be empty, got: ${result.secondary.length}`
  );
  assert(
    result.unmatchedLibs.length === 0,
    `unmatchedLibs should be empty, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
  assert(
    result.ecosystemMismatchedLibs.length === 0,
    `ecosystemMismatchedLibs should be empty, got: ${JSON.stringify(result.ecosystemMismatchedLibs)}`
  );
}

console.log("\nEdge Case 1b: getAvailableFeatures([])");
{
  const result = getAvailableFeatures([]);
  assert(
    result.dominantLib === null,
    `dominantLib should be null, got: ${result.dominantLib}`
  );
  assert(
    result.features.length === 0,
    `features should be empty, got: ${result.features.length}`
  );
  assert(Array.isArray(result.matchedLibs), "matchedLibs should be an array");
  assert(
    result.matchedLibs.length === 0,
    `matchedLibs should be empty, got: ${result.matchedLibs.length}`
  );
  assert(
    result.unmatchedLibs.length === 0,
    `unmatchedLibs should be empty, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
  assert(
    !("ecosystemNote" in result),
    "should not have ecosystemNote for empty libs"
  );
}

// Simulate get-docs handler for empty libs
console.log("\nEdge Case 1c: get-docs with empty libs []");
{
  const { dominant, unmatchedLibs, ecosystemMismatchedLibs } = resolveSkills(
    []
  );
  assert(
    dominant === null,
    "dominant should be null — get-docs returns error response"
  );
  assert(unmatchedLibs.length === 0, "unmatchedLibs empty for empty input");
  assert(
    ecosystemMismatchedLibs.length === 0,
    "ecosystemMismatchedLibs empty for empty input"
  );
}

// ─── Edge Case 2: All unknown libs ─────────────────────────────────────

console.log('\nEdge Case 2: resolveSkills(["express", "angular", "vue"])');
{
  const result = resolveSkills(["express", "angular", "vue"]);
  assert(
    result.dominant === null,
    `dominant should be null, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 0,
    `secondary should be empty, got: ${result.secondary.length}`
  );
  assert(
    result.unmatchedLibs.length === 3,
    `unmatchedLibs should have 3 entries, got: ${result.unmatchedLibs.length}`
  );
  assert(
    JSON.stringify(result.unmatchedLibs.sort()) ===
      JSON.stringify(["angular", "express", "vue"]),
    `unmatchedLibs should be ["angular", "express", "vue"], got: ${JSON.stringify(result.unmatchedLibs.sort())}`
  );
  assert(
    result.ecosystemMismatchedLibs.length === 0,
    "ecosystemMismatchedLibs should be empty"
  );
}

console.log(
  '\nEdge Case 2b: getAvailableFeatures(["express", "angular", "vue"])'
);
{
  const result = getAvailableFeatures(["express", "angular", "vue"]);
  assert(
    result.dominantLib === null,
    `dominantLib should be null, got: ${result.dominantLib}`
  );
  assert(
    result.features.length === 0,
    `features should be empty, got: ${result.features.length}`
  );
  assert(
    result.matchedLibs.length === 0,
    `matchedLibs should be empty, got: ${result.matchedLibs.length}`
  );
  assert(
    result.unmatchedLibs.length === 3,
    `unmatchedLibs should have 3 entries, got: ${result.unmatchedLibs.length}`
  );
  assert(
    !("ecosystemNote" in result),
    "should not have ecosystemNote (no ecosystem mismatch, just unknown libs)"
  );
}

// Simulate get-docs handler for all unknown libs
console.log(
  '\nEdge Case 2c: get-docs with all unknown libs ["express", "angular"]'
);
{
  const { dominant, unmatchedLibs } = resolveSkills(["express", "angular"]);
  assert(
    dominant === null,
    "dominant should be null — get-docs returns error response"
  );
  assert(
    unmatchedLibs.length === 2,
    `unmatchedLibs should have 2 entries, got: ${unmatchedLibs.length}`
  );
}

// ─── Edge Case 3: Single known lib + multiple unknown libs ─────────────

console.log('\nEdge Case 3: resolveSkills(["node", "express", "koa"])');
{
  const result = resolveSkills(["node", "express", "koa"]);
  assert(
    result.dominant?.slug === "node",
    `dominant should be node, got: ${result.dominant?.slug}`
  );
  assert(
    result.secondary.length === 0,
    `secondary should be empty, got: ${result.secondary.length}`
  );
  assert(
    result.unmatchedLibs.length === 2,
    `unmatchedLibs should have 2, got: ${result.unmatchedLibs.length}`
  );
  assert(
    JSON.stringify(result.unmatchedLibs.sort()) ===
      JSON.stringify(["express", "koa"]),
    `unmatchedLibs should be ["express", "koa"], got: ${JSON.stringify(result.unmatchedLibs.sort())}`
  );
  assert(
    result.ecosystemMismatchedLibs.length === 0,
    "ecosystemMismatchedLibs should be empty"
  );
}

console.log('\nEdge Case 3b: getAvailableFeatures(["node", "express", "koa"])');
{
  const result = getAvailableFeatures(["node", "express", "koa"]);
  assert(
    result.dominantLib === "node",
    `dominantLib should be node, got: ${result.dominantLib}`
  );
  assert(
    result.features.length > 0,
    `features should be non-empty, got: ${result.features.length}`
  );
  assert(
    result.matchedLibs.length === 1,
    `matchedLibs should have 1, got: ${result.matchedLibs.length}`
  );
  assert(
    result.matchedLibs[0] === "node",
    `matchedLibs[0] should be node, got: ${result.matchedLibs[0]}`
  );
  assert(
    result.unmatchedLibs.length === 2,
    `unmatchedLibs should have 2, got: ${result.unmatchedLibs.length}`
  );
}

// Simulate get-docs handler for single known + multiple unknown
console.log(
  '\nEdge Case 3c: get-docs with ["node", "express", "koa"], features: ["errors", "tracing"]'
);
{
  const requestedFeatures = ["errors", "tracing"];
  const { dominant, secondary, unmatchedLibs } = resolveSkills([
    "node",
    "express",
    "koa",
  ]);
  assert(dominant !== null, "dominant should not be null");
  assert(
    dominant!.slug === "node",
    `dominant should be node, got: ${dominant?.slug}`
  );
  assert(
    secondary.length === 0,
    `secondary should be empty, got: ${secondary.length}`
  );
  assert(
    unmatchedLibs.length === 2,
    `unmatchedLibs should have 2, got: ${unmatchedLibs.length}`
  );

  // Verify features from dominant match requested
  const matchedFeatures = dominant!.features.filter((f) =>
    requestedFeatures.includes(f.slug)
  );
  assert(
    matchedFeatures.length === 2,
    `should match 2 features, got: ${matchedFeatures.length}`
  );
  for (const f of matchedFeatures) {
    assert(
      typeof f.setup === "string" && f.setup.length > 0,
      `feature ${f.slug} should have non-empty setup`
    );
    assert(
      typeof f.code === "string" && f.code.length > 0,
      `feature ${f.slug} should have non-empty code`
    );
  }
}

// ─── Edge Case 4: Single unknown lib ───────────────────────────────────

console.log('\nEdge Case 4: resolveSkills(["express"])');
{
  const result = resolveSkills(["express"]);
  assert(
    result.dominant === null,
    `dominant should be null, got: ${result.dominant?.slug}`
  );
  assert(
    result.unmatchedLibs.length === 1,
    `unmatchedLibs should have 1, got: ${result.unmatchedLibs.length}`
  );
  assert(
    result.unmatchedLibs[0] === "express",
    `unmatchedLibs[0] should be express, got: ${result.unmatchedLibs[0]}`
  );
}

// ─── Edge Case 5: Duplicate libs ───────────────────────────────────────

console.log('\nEdge Case 5: resolveSkills(["node", "node"])');
{
  const result = resolveSkills(["node", "node"]);
  assert(
    result.dominant?.slug === "node",
    `dominant should be node, got: ${result.dominant?.slug}`
  );
  // Duplicates mean node appears twice in matched — should still work
  assert(
    result.unmatchedLibs.length === 0,
    `unmatchedLibs should be empty, got: ${JSON.stringify(result.unmatchedLibs)}`
  );
}

// ─── Edge Case 6: Features requested that don't exist in skill ─────────

console.log("\nEdge Case 6: get-docs with non-existent features");
{
  const { dominant } = resolveSkills(["bun"]);
  assert(dominant !== null, "dominant should not be null");
  const requestedFeatures = ["non-existent-feature", "also-fake"];
  const matchedFeatures = dominant!.features.filter((f) =>
    requestedFeatures.includes(f.slug)
  );
  assert(
    matchedFeatures.length === 0,
    `should match 0 features for non-existent slugs, got: ${matchedFeatures.length}`
  );
}

// ─── Edge Case 7: Mixed known/unknown with ecosystem mismatch ──────────

console.log('\nEdge Case 7: resolveSkills(["node", "django", "express"])');
{
  const result = resolveSkills(["node", "django", "express"]);
  assert(result.dominant !== null, "dominant should not be null");
  // node and django both have count=1, express is unknown
  // Should pick one ecosystem, the other goes to ecosystemMismatchedLibs
  const totalAccountedFor =
    (result.dominant ? 1 : 0) +
    result.secondary.length +
    result.unmatchedLibs.length +
    result.ecosystemMismatchedLibs.length;
  assert(
    totalAccountedFor === 3,
    `all 3 libs should be accounted for, got: ${totalAccountedFor}`
  );
  assert(
    result.unmatchedLibs.includes("express"),
    "express should be in unmatchedLibs"
  );
  assert(
    result.ecosystemMismatchedLibs.length === 1,
    `one lib should be ecosystem-mismatched, got: ${result.ecosystemMismatchedLibs.length}`
  );
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
if (failed > 0) {
  process.exit(1);
}
