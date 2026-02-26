import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMcpServer } from "./mcp";

const app = new Hono().use(cors());

app.all("/mcp", async (c) => {
  const transport = new StreamableHTTPTransport();
  const mcp = createMcpServer();

  await mcp.connect(transport);

  return transport.handleRequest(c);
});

export default app;
