import type { SentrySkill } from "../../types";

const hono: SentrySkill = {
  category: "library",
  ecosystem: "javascript",
  features: [
    {
      code: 'const app = new Hono();\n\napp.get("/debug-sentry", () => {\n  throw new Error("My first Sentry error!");\n});',
      description: "Auto-captures unhandled exceptions. 3xx/4xx ignored.",
      name: "Error Monitoring",
      setup: "Init Sentry via runtime SDK before creating Hono app.",
      slug: "error-monitoring",
    },
    {
      code: 'app.get("/users/:id", async (c) => {\n  return await Sentry.startSpan(\n    { op: "db.query", name: "fetch user" },\n    async () => {\n      const user = await db.query("SELECT * FROM users WHERE id = ?", [c.req.param("id")]);\n      return c.json(user);\n    },\n  );\n});',
      description:
        "Auto-instrumented by runtime SDK. startSpan() for custom spans.",
      name: "Tracing",
      setup: "Set tracesSampleRate in runtime Sentry.init().",
      slug: "tracing",
    },
    {
      code: 'app.get("/", (c) => {\n  Sentry.logger.info("Request received", { path: c.req.path });\n  return c.text("Hello!");\n});',
      description: "Structured logs from Hono handlers.",
      name: "Logs",
      setup: "Set enableLogs: true in runtime Sentry.init().",
      slug: "logs",
    },
    {
      code: 'Sentry.withMonitor("daily-cleanup", async () => {\n  await db.deleteExpiredSessions();\n});',
      description: "Monitor scheduled tasks via runtime SDK.",
      name: "Crons",
      setup: "Sentry.withMonitor() or captureCheckIn() from runtime SDK.",
      slug: "crons",
    },
    {
      code: 'Sentry.captureFeedback({ name: "Jane", email: "jane@example.com", message: "Bug report" });',
      description: "User feedback via runtime SDK API.",
      name: "User Feedback",
      setup: "Sentry.captureFeedback() from runtime SDK.",
      slug: "user-feedback",
    },
  ],
  gettingStarted: `No dedicated Sentry SDK — use the runtime SDK (@sentry/node, @sentry/bun, or @sentry/cloudflare). \`@hono/sentry\` middleware is deprecated.

Init Sentry via the runtime SDK before creating the Hono app. For Cloudflare Workers, wrap the Hono app with Sentry.withSentry():
\`\`\`typescript
import { Hono } from "hono";
import * as Sentry from "@sentry/cloudflare";
const app = new Hono();
export default Sentry.withSentry(
  (env: Env) => ({ dsn: "___PUBLIC_DSN___", tracesSampleRate: 1.0 }),
  app,
);
\`\`\`

For Node.js/Bun, init in a separate instrument file (see runtime skill). No Hono-specific wiring needed.`,
  name: "Hono",
  packages: [],
  rank: 1,
  slug: "hono",
};

export default hono;
