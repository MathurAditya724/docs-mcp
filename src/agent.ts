import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { Feature, SentrySkill } from "./types";

function buildSystemPrompt(
  dominant: SentrySkill,
  secondary: SentrySkill[],
  features: string[]
): string {
  const featureSet = new Set(features);

  let prompt = `You are a Sentry integration expert. Generate a complete, self-contained implementation guide.
The user's primary framework/runtime is ${dominant.name}.

## Getting Started with ${dominant.name}

${dominant.gettingStarted}

## Available Features for ${dominant.name}
`;

  const relevantFeatures: Feature[] = [];
  for (const feature of dominant.features) {
    if (featureSet.has(feature.slug)) {
      relevantFeatures.push(feature);
    }
  }

  for (const feature of relevantFeatures) {
    prompt += `
### ${feature.name}

${feature.setup}

\`\`\`
${feature.code}
\`\`\`
`;
  }

  for (const skill of secondary) {
    const extraFeatures = skill.features.filter(
      (f) =>
        featureSet.has(f.slug) &&
        !dominant.features.some((df) => df.slug === f.slug)
    );
    if (extraFeatures.length > 0) {
      prompt += `\n## Additional Features from ${skill.name}\n`;
      for (const feature of extraFeatures) {
        prompt += `\n### ${feature.name}\n\n${feature.setup}\n\n\`\`\`\n${feature.code}\n\`\`\`\n`;
      }
    }
  }

  prompt += `
## Instructions

Generate a complete implementation guide that:
1. Lists all packages to install with exact install commands
2. Shows every file that needs to be created or modified, with full file paths
3. Provides complete, copy-pasteable code for each file
4. Lists any environment variables needed (DSN, auth tokens, etc.)
5. Includes verification steps to confirm the setup works
6. Is written for another AI agent to follow — be explicit, no ambiguity
`;

  return prompt;
}

export async function generateDocs(
  dominant: SentrySkill,
  secondary: SentrySkill[],
  features: string[]
): Promise<string> {
  const systemPrompt = buildSystemPrompt(dominant, secondary, features);

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    prompt: `Generate a complete Sentry implementation guide for ${dominant.name} covering these features: ${features.join(", ")}. Include all code, file paths, install commands, and environment variables needed.`,
    system: systemPrompt,
  });

  return text;
}
