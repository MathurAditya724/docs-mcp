import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function createMcpServer() {
  const mcp = new McpServer({
    name: "sentry-docs",
    version: "0.0.1",
    description: "A MCP server for Sentry docs",
  });

  mcp.registerTool(
    "get-features",
    {
      title: "Get Features",
    },
    () => {
      return {
        content: [
          {
            type: "text",
            text: "Features",
          },
        ],
      };
    }
  );

  return mcp;
}
