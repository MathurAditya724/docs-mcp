import type { SentrySkill } from "../../types";

const hono: SentrySkill = {
  category: "library",
  ecosystem: "javascript",
  features: [
    {
      code: `import { Hono } from "hono";

const app = new Hono();

app.get("/debug-sentry", () => {
  throw new Error("My first Sentry error!");
});`,
      description:
        "Sentry automatically captures unhandled exceptions from Hono's onError handler. Errors with 3xx or 4xx status codes are ignored by default.",
      name: "Error Monitoring",
      setup:
        "Initialize Sentry via the runtime SDK (e.g. @sentry/node, @sentry/bun, or @sentry/cloudflare) before creating your Hono app. Sentry's honoIntegration hooks into Hono's onError to report unhandled exceptions automatically.",
      slug: "error-monitoring",
    },
    {
      code: `import * as Sentry from "@sentry/node"; // or @sentry/bun, @sentry/cloudflare

app.get("/debug-sentry", async () => {
  await Sentry.startSpan(
    {
      op: "test",
      name: "My First Test Transaction",
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      throw new Error("My first Sentry error!");
    },
  );
});`,
      description:
        "Track request performance across your Hono routes with distributed tracing. Requests are automatically instrumented by the runtime SDK.",
      name: "Tracing",
      setup:
        "Set tracesSampleRate in the runtime SDK's Sentry.init(). Hono requests are auto-instrumented. Use Sentry.startSpan() for custom spans within route handlers.",
      slug: "tracing",
    },
    {
      code: `import * as Sentry from "@sentry/node"; // or @sentry/bun, @sentry/cloudflare

const { logger } = Sentry;

app.get("/", (c) => {
  logger.info("Request received", { path: c.req.path });
  return c.text("Hello!");
});`,
      description:
        "Send structured logs from Hono route handlers to Sentry, correlated with errors and traces.",
      name: "Logs",
      setup:
        "Set enableLogs: true in the runtime SDK's Sentry.init(). Use Sentry.logger methods (info, warn, error, etc.) within your Hono route handlers.",
      slug: "logs",
    },
    {
      code: `import * as Sentry from "@sentry/node"; // or @sentry/bun, @sentry/cloudflare

// Using Sentry.withMonitor() to wrap a scheduled task
Sentry.withMonitor("<monitor-slug>", () => {
  // Execute your scheduled task here...
});

// Or use captureCheckIn for manual check-in control
const checkInId = Sentry.captureCheckIn({
  monitorSlug: "<monitor-slug>",
  status: "in_progress",
});

// ... run task ...

Sentry.captureCheckIn({
  checkInId,
  monitorSlug: "<monitor-slug>",
  status: "ok",
});`,
      description:
        "Monitor periodic and scheduled tasks to detect missed, late, or failed executions. Uses the runtime SDK's crons API.",
      name: "Crons",
      setup:
        "Use Sentry.withMonitor() or Sentry.captureCheckIn() from the runtime SDK (@sentry/node, @sentry/bun, or @sentry/cloudflare). On Node.js, you can also use Sentry.cron.instrumentCron/instrumentNodeCron/instrumentNodeSchedule helpers to auto-instrument popular cron libraries.",
      slug: "crons",
    },
    {
      code: `import * as Sentry from "@sentry/node"; // or @sentry/bun, @sentry/cloudflare

// Collect feedback programmatically
Sentry.captureFeedback({
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Something broke when I clicked submit.",
});`,
      description:
        "Collect user feedback from your Hono application using the runtime SDK's programmatic API.",
      name: "User Feedback",
      setup:
        "Use Sentry.captureFeedback() from the runtime SDK to collect and send user feedback programmatically. You can optionally pass an associatedEventId to link feedback to a specific error event.",
      slug: "user-feedback",
    },
  ],
  gettingStarted: `## Hono + Sentry Setup

Hono does not have its own Sentry SDK. Use the Sentry SDK for your runtime (@sentry/node, @sentry/bun, or @sentry/cloudflare). The community \`@hono/sentry\` middleware is deprecated — use the official Sentry SDK directly.

### Node.js Runtime

Initialize Sentry in \`instrument.mjs\` before importing Hono:

\`\`\`typescript
// instrument.mjs
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  enableLogs: true,
});
\`\`\`

Then start your app with:

\`\`\`bash
node --import ./instrument.mjs app.mjs
\`\`\`

### Cloudflare Workers Runtime

Wrap your Hono app with \`Sentry.withSentry()\`:

\`\`\`typescript
// index.ts
import { Hono } from "hono";
import * as Sentry from "@sentry/cloudflare";

const app = new Hono();

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: "___PUBLIC_DSN___",
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  app,
);
\`\`\`

### Bun Runtime

Create \`instrument.ts\` and preload it:

\`\`\`typescript
// instrument.ts
import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  enableLogs: true,
});
\`\`\`

\`\`\`bash
bun --preload ./instrument.ts app.ts
\`\`\`

Sentry automatically captures unhandled exceptions from Hono's \`onError\` handler (3xx/4xx status codes are excluded by default).`,
  name: "Hono",
  packages: [],
  rank: 1,
  slug: "hono",
};

export default hono;
