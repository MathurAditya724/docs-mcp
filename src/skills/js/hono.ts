import type { SentrySkill } from "../../types";

const hono: SentrySkill = {
  category: "framework",
  ecosystem: "javascript",
  features: [
    {
      code: `// instrument.js - must be loaded before any other modules
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
});

// In your Hono app:
// Errors thrown in route handlers are automatically captured.
// To manually capture errors:
Sentry.captureException(new Error("Something went wrong"));
Sentry.captureMessage("Something happened");`,
      description:
        "Automatically captures unhandled exceptions and unhandled promise rejections in your Hono application.",
      name: "Error Monitoring",
      setup:
        "Error monitoring is enabled by default when you call Sentry.init(). The Sentry Node.js SDK automatically captures errors thrown in Hono route handlers. Make sure instrument.js is loaded before importing Hono.",
      slug: "error-monitoring",
    },
    {
      code: `// instrument.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

// Hono routes are automatically instrumented as transactions.
// Each incoming HTTP request creates a trace.`,
      description:
        "Track performance across your Hono application with distributed tracing.",
      name: "Tracing",
      setup:
        "Enable tracing by setting tracesSampleRate in your Sentry.init() call. The Node.js SDK automatically instruments incoming HTTP requests to your Hono server as transactions.",
      slug: "tracing",
    },
    {
      code: `// instrument.js
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  integrations: [nodeProfilingIntegration()],
});`,
      description:
        "Identify slow or resource-intensive functions in your Hono application.",
      name: "Profiling",
      setup:
        "Install @sentry/profiling-node alongside @sentry/node. Add nodeProfilingIntegration() to your integrations and set profileSessionSampleRate. Requires tracing to be enabled.",
      slug: "profiling",
    },
    {
      code: `// instrument.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  enableLogs: true,
});

// Use structured logging in your Hono handlers
Sentry.logger.info("Request received", { path: "/api/users" });
Sentry.logger.warn("Slow query detected", { duration: 5000 });
Sentry.logger.error("Operation failed", { reason: "timeout" });`,
      description:
        "Centralize and analyze your application logs. Correlate them with errors and performance issues.",
      name: "Logs",
      setup:
        "Enable logs by setting enableLogs: true in your Sentry.init() call. Use Sentry.logger methods to send structured logs from your Hono handlers.",
      slug: "logs",
    },
  ],
  gettingStarted: `Hono uses the Sentry Node.js SDK (@sentry/node).

Install the SDK:

\`\`\`bash
npm install @sentry/node
\`\`\`

Create an \`instrument.js\` file in your project root. This file MUST be loaded before importing Hono or any other modules:

\`\`\`javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
\`\`\`

In your application entry point, import instrument.js FIRST:

\`\`\`javascript
require("./instrument");
const { serve } = require("@hono/node-server");
const { Hono } = require("hono");

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

serve(app);
\`\`\`

For ESM projects, create \`instrument.mjs\`:

\`\`\`javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
\`\`\`

And run with:

\`\`\`bash
node --import ./instrument.mjs app.mjs
\`\`\`

Requires Node.js 18.0.0 or higher (18.19.0+ or 19.9.0+ recommended).

Note: For Hono running on Cloudflare Workers or other edge runtimes, the setup differs. This guide covers the Node.js server runtime.`,
  name: "Hono",
  packages: ["@sentry/node", "@sentry/profiling-node"],
  rank: 5,
  slug: "hono",
};

export default hono;
