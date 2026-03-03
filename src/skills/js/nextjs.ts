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
      slug: "errors",
    },
    {
      code: 'await Sentry.startSpan({ op: "db.query", name: "fetch-user" }, async () => {\n  return await prisma.user.findUnique({ where: { id } });\n});',
      description: "Distributed tracing across all runtimes.",
      name: "Tracing",
      setup:
        "Already configured: tracesSampleRate in gettingStarted init. Sentry.startSpan() for custom spans.",
      slug: "tracing",
    },
    {
      code: "// No additional code — configured in instrumentation-client.ts init above.",
      description: "Browser session replays. Client-side only.",
      name: "Session Replay",
      setup:
        "Already configured: replaysSessionSampleRate, replaysOnErrorSampleRate, replayIntegration() in gettingStarted client init. Adjust sample rates to control volume.",
      slug: "replay",
    },
    {
      code: 'Sentry.logger.info("User action", { userId: "123" });',
      description: "Structured logs correlated with errors and traces.",
      name: "Logs",
      setup:
        "Already configured: enableLogs in gettingStarted init. Use Sentry.logger.*() to emit logs.",
      slug: "logs",
    },
    {
      code: '// sentry.server.config.ts\nimport { nodeProfilingIntegration } from "@sentry/profiling-node";\n// Add to Sentry.init():\n//   integrations: [nodeProfilingIntegration()],\n//   profileSessionSampleRate: 1.0,',
      description: "V8 CpuProfiler profiling. Server-side only.",
      name: "Profiling",
      setup:
        "Install @sentry/profiling-node. Add nodeProfilingIntegration() and profileSessionSampleRate to sentry.server.config.ts Sentry.init(). Requires tracing. Not available in browser/edge.",
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
      code: 'Sentry.captureFeedback({ name: "Jane", email: "jane@example.com", message: "Bug report" });',
      description: "User feedback via widget or API.",
      name: "User Feedback",
      setup:
        'Widget: add feedbackIntegration({ colorScheme: "system" }) to instrumentation-client.ts Sentry.init(). API: Sentry.captureFeedback().',
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
