import type { SentrySkill } from "../../types";

const node: SentrySkill = {
  category: "runtime",
  ecosystem: "javascript",
  features: [
    {
      code: 'Sentry.captureException(new Error("something broke"));',
      description:
        "Auto-captures errors, uncaught exceptions, unhandled rejections.",
      name: "Error Monitoring",
      setup: "Configured by instrument.mjs. Manual: Sentry.captureException().",
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
      code: '// Add to instrument.mjs:\nimport { nodeProfilingIntegration } from "@sentry/profiling-node";\n// Add to Sentry.init():\n//   integrations: [nodeProfilingIntegration()],\n//   profileSessionSampleRate: 1.0,',
      description: "V8 CpuProfiler profiling.",
      name: "Profiling",
      setup:
        "Install @sentry/profiling-node. Add nodeProfilingIntegration() and profileSessionSampleRate to Sentry.init(). Requires tracing.",
      slug: "profiling",
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
    '```bash\nnpm install @sentry/node\n```\n\nRequires Node >= 18.19.0. Create `instrument.mjs`:\n```javascript\nimport * as Sentry from "@sentry/node";\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\nLoad before app: `node --import ./instrument.mjs app.mjs`\nCJS: `require("./instrument")` at top of entry file.',
  name: "Node.js",
  packages: ["@sentry/node", "@sentry/profiling-node"],
  rank: 3,
  slug: "node",
};

export default node;
