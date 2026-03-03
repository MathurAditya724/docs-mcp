import type { SentrySkill } from "../../types";

const nextjs: SentrySkill = {
  category: "framework",
  ecosystem: "javascript",
  features: [
    {
      code: 'Sentry.captureException(new Error("something broke"));',
      description: "Auto-captures errors in browser, server, and edge.",
      name: "Error Monitoring",
      setup:
        "Configured by wizard. Manual capture with Sentry.captureException().",
      slug: "error-monitoring",
    },
    {
      code: "tracesSampleRate: 0.1,",
      description: "Distributed tracing across all runtimes.",
      name: "Tracing",
      setup: "Add tracesSampleRate to Sentry.init().",
      slug: "tracing",
    },
    {
      code: "replaysSessionSampleRate: 0.1,\nreplaysOnErrorSampleRate: 1.0,\nintegrations: [Sentry.replayIntegration()],",
      description: "Browser session replays. Client-side only.",
      name: "Session Replay",
      setup: "Add to Sentry.init() in instrumentation-client.ts.",
      slug: "session-replay",
    },
    {
      code: 'enableLogs: true,\n\nSentry.logger.info("User action", { userId: "123" });',
      description: "Structured logs correlated with errors and traces.",
      name: "Logs",
      setup: "Set enableLogs: true in Sentry.init().",
      slug: "logs",
    },
    {
      code: 'import { nodeProfilingIntegration } from "@sentry/profiling-node";\n\nintegrations: [nodeProfilingIntegration()],\nprofileSessionSampleRate: 1.0,',
      description: "V8 CpuProfiler profiling. Server-side only.",
      name: "Profiling",
      setup:
        "Install @sentry/profiling-node. Add to sentry.server.config.ts. Requires tracing. Not available in browser/edge.",
      slug: "profiling",
    },
    {
      code: 'Sentry.withMonitor("daily-cleanup", async () => {\n  await db.deleteExpiredSessions();\n});',
      description: "Monitor scheduled tasks for missed/late/failed runs.",
      name: "Crons",
      setup:
        "Sentry.withMonitor() or captureCheckIn(). Vercel Cron: automaticVercelMonitors: true. Libraries: Sentry.cron.instrumentNodeCron/instrumentNodeSchedule.",
      slug: "crons",
    },
    {
      code: 'integrations: [Sentry.feedbackIntegration({ colorScheme: "system" })],\n\nSentry.captureFeedback({ name: "Jane", email: "jane@example.com", message: "Bug report" });',
      description: "User feedback via widget or API.",
      name: "User Feedback",
      setup:
        "Widget: feedbackIntegration() in instrumentation-client.ts. API: Sentry.captureFeedback().",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '```bash\nnpx @sentry/wizard@latest -i nextjs\n```\n\nWizard creates these files:\n\n**instrumentation-client.ts** (browser):\n```typescript\nimport * as Sentry from "@sentry/nextjs";\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: 0.1,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  enableLogs: true,\n  integrations: [Sentry.replayIntegration()],\n});\n```\n\n**sentry.server.config.ts** (same for edge):\n```typescript\nimport * as Sentry from "@sentry/nextjs";\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: 0.1,\n  enableLogs: true,\n});\n```\n\n**instrumentation.ts**:\n```typescript\nimport * as Sentry from "@sentry/nextjs";\nexport async function register() {\n  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");\n  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");\n}\nexport const onRequestError = Sentry.captureRequestError;\n```\n\n**next.config.ts**: Wrap with `withSentryConfig(nextConfig, { org, project, authToken: process.env.SENTRY_AUTH_TOKEN, tunnelRoute: "/monitoring" })`.',
  name: "Sentry Next.js SDK",
  packages: ["@sentry/nextjs"],
  rank: 10,
  slug: "nextjs",
};

export default nextjs;
