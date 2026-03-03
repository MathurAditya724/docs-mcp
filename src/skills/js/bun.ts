import type { SentrySkill } from "../../types";

const bun: SentrySkill = {
  category: "runtime",
  ecosystem: "javascript",
  features: [
    {
      code: 'Sentry.captureException(new Error("something broke"));',
      description:
        "Auto-captures errors, uncaught exceptions, unhandled rejections.",
      name: "Error Monitoring",
      setup: "Configured by instrument.js. Manual: Sentry.captureException().",
      slug: "errors",
    },
    {
      code: 'Sentry.startSpan({ op: "task", name: "my-task" }, async () => {\n  await fetch("https://example.com/api");\n});',
      description: "Distributed tracing and performance monitoring.",
      name: "Tracing",
      setup:
        "Already configured: tracesSampleRate in gettingStarted init. Sentry.startSpan() for custom spans.",
      slug: "tracing",
    },
    {
      code: 'Sentry.logger.info("User logged in", { userId: 123 });',
      description: "Structured logs correlated with errors and traces.",
      name: "Logs",
      setup:
        "Already configured: enableLogs in gettingStarted init. Use Sentry.logger.*() to emit logs.",
      slug: "logs",
    },
    {
      code: 'Sentry.withMonitor("daily-cleanup", async () => {\n  await db.deleteExpiredSessions();\n});',
      description: "Monitor scheduled tasks for missed/late/failed runs.",
      name: "Crons",
      setup:
        "Sentry.withMonitor() or captureCheckIn(). Auto-instrument: Sentry.cron.instrumentNodeCron/instrumentNodeSchedule.",
      slug: "crons",
    },
    {
      code: 'Sentry.captureFeedback({ name: "Jane", email: "jane@example.com", message: "Bug report" });',
      description: "User feedback via API.",
      name: "User Feedback",
      setup:
        "Sentry.captureFeedback(). Frontend: add feedbackIntegration() client-side.",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '```bash\nbun add @sentry/bun\n```\n\nCreate `instrument.js`:\n```javascript\nimport * as Sentry from "@sentry/bun";\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\nRun: `bun --preload ./instrument.js app.js`\n\nNote: Auto-instrumentation does not work with bundled code or single-file executables.',
  name: "Bun",
  packages: ["@sentry/bun"],
  rank: 3,
  slug: "bun",
};

export default bun;
