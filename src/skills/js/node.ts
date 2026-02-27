import type { SentrySkill } from "../../types";

const node: SentrySkill = {
  category: "runtime",
  ecosystem: "javascript",
  features: [
    {
      code: `const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
});

// Manually capture an error
Sentry.captureException(new Error("Something went wrong"));

// Manually capture a message
Sentry.captureMessage("Something happened");`,
      description:
        "Automatically captures unhandled exceptions and unhandled promise rejections.",
      name: "Error Monitoring",
      setup:
        "Error monitoring is enabled by default when you call Sentry.init(). No additional configuration is needed. Unhandled exceptions and promise rejections are captured automatically.",
      slug: "error-monitoring",
    },
    {
      code: `const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});`,
      description:
        "Track performance across your application with distributed tracing. Follow requests from frontend to backend.",
      name: "Tracing",
      setup:
        "Enable tracing by setting tracesSampleRate in your Sentry.init() call. The Node.js SDK automatically instruments HTTP requests, database queries, and other common operations.",
      slug: "tracing",
    },
    {
      code: `const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  // Enable profiling
  profileSessionSampleRate: 1.0,
  integrations: [nodeProfilingIntegration()],
});`,
      description:
        "Identify slow or resource-intensive functions without custom instrumentation.",
      name: "Profiling",
      setup:
        "Install @sentry/profiling-node alongside @sentry/node. Add the nodeProfilingIntegration() to your integrations and set profileSessionSampleRate. Profiling requires tracing to be enabled.",
      slug: "profiling",
    },
    {
      code: `const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  enableLogs: true,
});

// Use structured logging
Sentry.logger.info("User logged in", { userId: "123" });
Sentry.logger.warn("Slow query detected", { duration: 5000 });
Sentry.logger.error("Operation failed", { reason: "timeout" });
Sentry.logger.debug("Cache miss", { key: "user:123" });`,
      description:
        "Centralize and analyze your application logs. Correlate them with errors and performance issues.",
      name: "Logs",
      setup:
        "Enable logs by setting enableLogs: true in your Sentry.init() call. Use Sentry.logger.info(), .warn(), .error(), and .debug() to send structured logs.",
      slug: "logs",
    },
  ],
  gettingStarted: `Install the Sentry Node.js SDK:

\`\`\`bash
npm install @sentry/node
\`\`\`

Create an \`instrument.js\` file in your project root. This file MUST be loaded before any other modules:

\`\`\`javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
\`\`\`

Import this file at the very top of your application entry point:

\`\`\`javascript
require("./instrument");
// ... rest of your application
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

And run your application with:

\`\`\`bash
node --import ./instrument.mjs app.mjs
\`\`\`

Requires Node.js 18.0.0 or higher (18.19.0+ or 19.9.0+ recommended).`,
  name: "Node.js",
  packages: ["@sentry/node", "@sentry/profiling-node"],
  rank: 3,
  slug: "node",
};

export default node;
