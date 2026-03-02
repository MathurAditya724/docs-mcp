import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDocs } from "./agent";
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
        "Generates a complete Sentry implementation guide tailored to your stack. Pass your library slugs and the feature slugs you want to enable.",
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
    async ({ features, libs }) => {
      const { dominant, secondary } = resolveSkills(libs);

      if (!dominant) {
        return {
          content: [
            {
              text: "No matching Sentry skills found. Use get-available-features first to see supported libraries.",
              type: "text" as const,
            },
          ],
        };
      }

      const docs = await generateDocs(dominant, secondary, features);

      return {
        content: [
          {
            text: docs,
            type: "text" as const,
          },
        ],
      };
    }
  );

  return mcp;
}
