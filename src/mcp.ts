import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAvailableFeatures, resolveSkills, skills } from "./skills/registry";

export function createMcpServer() {
  const mcp = new McpServer({
    description: "Generates tailored Sentry integration docs for your codebase",
    name: "sentry-docs",
    version: "0.0.1",
  });

  mcp.registerTool(
    "get-available-features",
    {
      description:
        "Given the libraries/frameworks in your codebase, returns all Sentry features you can enable. Pass library slugs like 'nextjs', 'hono', 'bun', 'node', 'flask'.",
      inputSchema: {
        libs: z
          .array(z.string())
          .describe("Library/framework slugs from the user's codebase"),
      },
      title: "Get Available Features",
    },
    ({ libs }) => {
      const result = getAvailableFeatures(libs);

      if (!result.dominantLib) {
        return {
          content: [
            {
              text: JSON.stringify(
                {
                  error:
                    "No matching Sentry skills found for the provided libraries.",
                  knownLibs: Object.keys(skills),
                  unmatchedLibs: result.unmatchedLibs,
                },
                null,
                2
              ),
              type: "text" as const,
            },
          ],
        };
      }

      return {
        content: [
          {
            text: JSON.stringify(result, null, 2),
            type: "text" as const,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "get-docs",
    {
      description:
        "Returns a structured Sentry implementation guide tailored to your stack. Pass your library slugs and the feature slugs you want to enable.",
      inputSchema: {
        features: z
          .array(z.string())
          .describe("Feature slugs to include (from get-available-features)"),
        libs: z
          .array(z.string())
          .describe("Library/framework slugs from the user's codebase"),
      },
      title: "Get Sentry Integration Docs",
    },
    ({ features, libs }) => {
      const { dominant, secondary, unmatchedLibs, ecosystemMismatchedLibs } =
        resolveSkills(libs);

      if (!dominant) {
        return {
          content: [
            {
              text: JSON.stringify(
                {
                  error:
                    "No matching Sentry skills found. Use get-available-features first to see supported libraries.",
                  knownLibs: Object.keys(skills),
                  unmatchedLibs,
                  ...(ecosystemMismatchedLibs.length > 0 && {
                    ecosystemNote:
                      "Cross-ecosystem mixing is not supported. Libraries from different ecosystems (JavaScript/Python) were ignored.",
                  }),
                },
                null,
                2
              ),
              type: "text" as const,
            },
          ],
        };
      }

      const featureSet = new Set(features);

      // Collect packages from all matched skills (deduplicated)
      const packageSet = new Set<string>();
      for (const pkg of dominant.packages) {
        packageSet.add(pkg);
      }
      for (const skill of secondary) {
        for (const pkg of skill.packages) {
          packageSet.add(pkg);
        }
      }

      // Deduplicate features: dominant skill takes priority
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

      // Add features from secondary skills that weren't already covered
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

      // Build secondary patterns from library-type skills
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
            description: `${skill.name} wiring — how to integrate ${skill.name} with the ${dominant.name} Sentry SDK`,
            setup: skill.gettingStarted,
            code: skill.features
              .filter((f) => featureSet.has(f.slug))
              .map((f) => f.code)
              .join("\n\n"),
          });
        }
      }

      const response = {
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

      return {
        content: [
          {
            text: JSON.stringify(response, null, 2),
            type: "text" as const,
          },
        ],
      };
    }
  );

  return mcp;
}
