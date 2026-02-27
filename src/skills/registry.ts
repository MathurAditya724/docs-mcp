import type { SentrySkill } from "../types";
import angular from "./js/angular";
import astro from "./js/astro";
import awsServerless from "./js/aws-serverless";
import bun from "./js/bun";
import cloudflare from "./js/cloudflare";
import deno from "./js/deno";
import electron from "./js/electron";
import ember from "./js/ember";
import googleCloudServerless from "./js/google-cloud-serverless";
import nestjs from "./js/nestjs";
import nextjs from "./js/nextjs";
import node from "./js/node";
import nuxt from "./js/nuxt";
import react from "./js/react";
import reactNative from "./js/react-native";
import reactRouter from "./js/react-router";
import remix from "./js/remix";
import solid from "./js/solid";
import solidstart from "./js/solidstart";
import svelte from "./js/svelte";
import sveltekit from "./js/sveltekit";
import tanstackstartReact from "./js/tanstackstart-react";
import vue from "./js/vue";
import wasm from "./js/wasm";
import aiohttp from "./python/aiohttp";
import awsLambda from "./python/aws-lambda";
import bottle from "./python/bottle";
import celery from "./python/celery";
import django from "./python/django";
import falcon from "./python/falcon";
import fastapi from "./python/fastapi";
import flask from "./python/flask";
import gcpFunctions from "./python/gcp-functions";
import litestar from "./python/litestar";
import pyramid from "./python/pyramid";
import quart from "./python/quart";
import sanic from "./python/sanic";
import starlette from "./python/starlette";
import tornado from "./python/tornado";

const skills: Record<string, SentrySkill> = {
  aiohttp,
  angular,
  astro,
  awsLambda,
  awsServerless,
  bottle,
  bun,
  celery,
  cloudflare,
  deno,
  django,
  electron,
  ember,
  falcon,
  fastapi,
  flask,
  gcpFunctions,
  googleCloudServerless,
  litestar,
  nestjs,
  nextjs,
  node,
  nuxt,
  pyramid,
  quart,
  react,
  reactNative,
  reactRouter,
  remix,
  sanic,
  solid,
  solidstart,
  starlette,
  svelte,
  sveltekit,
  tanstackstartReact,
  tornado,
  vue,
  wasm,
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
