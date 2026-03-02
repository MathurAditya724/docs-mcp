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
  const unmatchedLibs = libs.filter((lib) => !(lib in skills));

  if (!dominant) {
    return {
      dominantLib: null,
      features: [],
      matchedLibs: [] as string[],
      unmatchedLibs,
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
    unmatchedLibs,
  };
}

export { skills };
