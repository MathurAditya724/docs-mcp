import type { SentrySkill } from "../types";
import bun from "./js/bun";
import cloudflare from "./js/cloudflare";
import nextjs from "./js/nextjs";
import node from "./js/node";
import django from "./python/django";
import flask from "./python/flask";

const skills: Record<string, SentrySkill> = {
  bun,
  cloudflare,
  django,
  flask,
  nextjs,
  node,
};

const categoryPriority: Record<string, number> = {
  framework: 3,
  library: 1,
  runtime: 2,
};

export function resolveSkills(libs: string[]) {
  const unmatchedLibs = libs.filter((lib) => !(lib in skills));
  const matched = libs.filter((lib) => lib in skills).map((lib) => skills[lib]);

  // Ecosystem filtering: if libs span multiple ecosystems, pick the one
  // with the most matched libs and treat the rest as ecosystem-mismatched.
  const ecosystemCounts: Record<string, number> = {};
  for (const skill of matched) {
    ecosystemCounts[skill.ecosystem] =
      (ecosystemCounts[skill.ecosystem] ?? 0) + 1;
  }

  let dominantEcosystem: string | null = null;
  let maxCount = 0;
  for (const [eco, count] of Object.entries(ecosystemCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantEcosystem = eco;
    }
  }

  const ecosystemFiltered = matched.filter(
    (s) => s.ecosystem === dominantEcosystem
  );
  const ecosystemMismatchedLibs = matched
    .filter((s) => s.ecosystem !== dominantEcosystem)
    .map((s) => s.slug);

  const sorted = ecosystemFiltered.sort((a, b) => {
    const catDiff =
      (categoryPriority[b.category] ?? 0) - (categoryPriority[a.category] ?? 0);
    if (catDiff !== 0) {
      return catDiff;
    }
    return b.rank - a.rank;
  });

  return {
    dominant: sorted[0] ?? null,
    secondary: sorted.slice(1),
    unmatchedLibs,
    ecosystemMismatchedLibs,
  };
}

export function getAvailableFeatures(libs: string[]) {
  const { dominant, secondary, unmatchedLibs, ecosystemMismatchedLibs } =
    resolveSkills(libs);

  // Combine truly unknown libs and ecosystem-mismatched libs into unmatchedLibs
  const allUnmatchedLibs = [...unmatchedLibs, ...ecosystemMismatchedLibs];

  if (!dominant) {
    return {
      dominantLib: null,
      features: [],
      matchedLibs: [] as string[],
      unmatchedLibs: allUnmatchedLibs,
      ...(ecosystemMismatchedLibs.length > 0 && {
        ecosystemNote:
          "Cross-ecosystem mixing is not supported. Libraries from different ecosystems (JavaScript/Python) were ignored.",
      }),
    };
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
    unmatchedLibs: allUnmatchedLibs,
    ...(ecosystemMismatchedLibs.length > 0 && {
      ecosystemNote:
        "Cross-ecosystem mixing is not supported. Libraries from different ecosystems (JavaScript/Python) were ignored.",
    }),
  };
}

export { skills };
