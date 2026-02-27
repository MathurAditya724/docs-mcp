import type { SentrySkill } from "../../types";

const bun: SentrySkill = {
  category: "runtime",
  ecosystem: "javascript",
  features: [
    {
      code: `import * as Sentry from "@sentry/bun";

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
      code: `import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});`,
      description:
        "Track performance across your application with distributed tracing.",
      name: "Tracing",
      setup:
        "Enable tracing by setting tracesSampleRate in your Sentry.init() call. The Bun SDK automatically instruments HTTP requests and other common operations.",
      slug: "tracing",
    },
    {
      code: `import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  enableLogs: true,
});

// Use structured logging
Sentry.logger.info("User logged in", { userId: "123" });
Sentry.logger.warn("Slow query detected", { duration: 5000 });
Sentry.logger.error("Operation failed", { reason: "timeout" });`,
      description:
        "Centralize and analyze your application logs. Correlate them with errors and performance issues.",
      name: "Logs",
      setup:
        "Enable logs by setting enableLogs: true in your Sentry.init() call. Use Sentry.logger.info(), .warn(), .error(), and .debug() to send structured logs.",
      slug: "logs",
    },
  ],
  gettingStarted: `Install the Sentry Bun SDK:

\`\`\`bash
bun add @sentry/bun
\`\`\`

Create an \`instrument.js\` file in your project root:

\`\`\`javascript
import * as Sentry from "@sentry/bun";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
\`\`\`

Run your application with the preload flag to ensure instrumentation loads first:

\`\`\`bash
bun --preload ./instrument.js app.js
\`\`\`

IMPORTANT: Auto-instrumentation does not work with bundled code, including Bun's single-file executables. For bundled applications, you will need to manually instrument your code.`,
  name: "Bun",
  packages: ["@sentry/bun"],
  rank: 3,
  slug: "bun",
};

export default bun;
