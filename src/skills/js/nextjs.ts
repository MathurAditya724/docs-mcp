import type { SentrySkill } from "../../types";

const nextjs: SentrySkill = {
  category: "framework",
  ecosystem: "javascript",
  features: [
    {
      code: 'import * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n});',
      description:
        "Automatically capture errors and exceptions across all Next.js runtime environments (browser, Node.js, and edge).",
      name: "Error Monitoring",
      setup:
        "Run the Sentry wizard with `npx @sentry/wizard@latest -i nextjs` to automatically configure error monitoring. The wizard creates separate initialization files for each runtime: `instrumentation-client.ts` for the browser, `sentry.server.config.ts` for Node.js, and `sentry.edge.config.ts` for edge runtimes. It also creates `app/global-error.tsx` to capture React rendering errors and wraps your `next.config.ts` with `withSentryConfig`.",
      slug: "error-monitoring",
    },
    {
      code: 'import * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,\n});',
      description:
        "Monitor performance and trace requests across all Next.js runtime environments with distributed tracing.",
      name: "Tracing",
      setup:
        "Enable tracing by adding `tracesSampleRate` to your Sentry initialization in `instrumentation-client.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. The wizard automatically configures this when you select Tracing during setup. Use a sample rate of 1.0 for development and a lower value like 0.1 for production to manage event volume.",
      slug: "tracing",
    },
    {
      code: 'import * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n});',
      description:
        "Record video-like session replays in the browser to watch exactly what users experienced when errors occurred.",
      name: "Session Replay",
      setup:
        "Enable Session Replay by adding the `replayIntegration()` to your client-side Sentry initialization in `instrumentation-client.ts`. Set `replaysSessionSampleRate` to control what percentage of all sessions are recorded, and `replaysOnErrorSampleRate` to control the rate of sessions recorded when an error occurs. The wizard automatically configures this when you select Session Replay during setup.",
      slug: "session-replay",
    },
    {
      code: 'import * as Sentry from "@sentry/nextjs";\n\n// Initialize Sentry with logs enabled\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\n// Send structured logs from anywhere in your app\nSentry.logger.info("User action", { userId: "123" });\nSentry.logger.warn("Slow response", { duration: 5000 });\nSentry.logger.error("Operation failed", { reason: "timeout" });',
      description:
        "Send structured log entries from your Next.js application to Sentry for centralized log management.",
      name: "Logs",
      setup:
        "Enable structured logging by setting `enableLogs: true` in your Sentry initialization. The wizard automatically configures this when you select Logs during setup. Once enabled, use `Sentry.logger.info()`, `Sentry.logger.warn()`, and `Sentry.logger.error()` to send structured log entries with additional context from anywhere in your application.",
      slug: "logs",
    },
    {
      code: 'import * as Sentry from "@sentry/nextjs";\nimport { nodeProfilingIntegration } from "@sentry/profiling-node";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});',
      description:
        "Profile your Next.js server-side code at the function level to identify performance bottlenecks using V8's CpuProfiler.",
      name: "Profiling",
      setup:
        "Install `@sentry/profiling-node` alongside `@sentry/nextjs`. Add `nodeProfilingIntegration()` to the integrations array and set `profileSessionSampleRate` in your `sentry.server.config.ts`. Profiling requires tracing to be enabled (`tracesSampleRate` must be set). Note: profiling only works on the Node.js server side, not in the browser or edge runtime.",
      slug: "profiling",
    },
    {
      code: 'import * as Sentry from "@sentry/nextjs";\n\n// Using Sentry.withMonitor() to wrap a scheduled task\nSentry.withMonitor("<monitor-slug>", () => {\n  // Execute your scheduled task here...\n});\n\n// Or use captureCheckIn for manual check-in control\nconst checkInId = Sentry.captureCheckIn({\n  monitorSlug: "<monitor-slug>",\n  status: "in_progress",\n});\n\n// ... run task ...\n\nSentry.captureCheckIn({\n  checkInId,\n  monitorSlug: "<monitor-slug>",\n  status: "ok",\n});',
      description:
        "Monitor periodic and scheduled tasks in your Next.js server to detect missed, late, or failed executions. Supports Vercel Cron Jobs, node-cron, node-schedule, and manual check-ins.",
      name: "Crons",
      setup:
        "Use Sentry.withMonitor() to wrap your scheduled task callbacks, or use Sentry.captureCheckIn() for manual check-in control. For Vercel Cron Jobs, set automaticVercelMonitors: true in your Sentry config in next.config.js. For cron/node-cron/node-schedule libraries, use the corresponding Sentry.cron.instrument* helper. Crons monitoring is only supported in Server and Edge runtimes.",
      slug: "crons",
    },
    {
      code: 'import * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: "system",\n    }),\n  ],\n});\n\n// Or collect feedback programmatically:\nSentry.captureFeedback({\n  name: "Jane Doe",\n  email: "jane@example.com",\n  message: "Something broke when I clicked submit.",\n});',
      description:
        "Collect user feedback from anywhere in your Next.js application via an embeddable widget or programmatic API.",
      name: "User Feedback",
      setup:
        "Add Sentry.feedbackIntegration() to the integrations array in your client-side Sentry init (instrumentation-client.ts). The widget renders in the bottom-right corner by default and supports screenshots. For programmatic feedback, use Sentry.captureFeedback() with an optional associatedEventId to link feedback to a specific error.",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '# Sentry Next.js SDK — Getting Started\n\n## Installation\n\nRun the Sentry wizard to automatically configure Sentry in your Next.js application:\n\n```bash\nnpx @sentry/wizard@latest -i nextjs\n```\n\nThe wizard will prompt you to select features (Error Monitoring, Logs, Session Replay, Tracing) and will automatically create and modify all required files.\n\n## Files Created by the Wizard\n\n### `instrumentation-client.ts` (Browser)\n\n```typescript\nimport * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  enableLogs: true,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n});\n```\n\n### `sentry.server.config.ts` (Node.js)\n\n```typescript\nimport * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,\n  enableLogs: true,\n});\n```\n\n### `sentry.edge.config.ts` (Edge Runtime)\n\n```typescript\nimport * as Sentry from "@sentry/nextjs";\n\nSentry.init({\n  dsn: "___PUBLIC_DSN___",\n  sendDefaultPii: true,\n  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,\n  enableLogs: true,\n});\n```\n\n### `instrumentation.ts` (Server-Side Registration)\n\n```typescript\nimport * as Sentry from "@sentry/nextjs";\n\nexport async function register() {\n  if (process.env.NEXT_RUNTIME === "nodejs") {\n    await import("./sentry.server.config");\n  }\n\n  if (process.env.NEXT_RUNTIME === "edge") {\n    await import("./sentry.edge.config");\n  }\n}\n\nexport const onRequestError = Sentry.captureRequestError;\n```\n\n### `next.config.ts`\n\n```typescript\nimport { withSentryConfig } from "@sentry/nextjs";\n\nexport default withSentryConfig(nextConfig, {\n  org: "___ORG_SLUG___",\n  project: "___PROJECT_SLUG___",\n  authToken: process.env.SENTRY_AUTH_TOKEN,\n  tunnelRoute: "/monitoring",\n  silent: !process.env.CI,\n});\n```\n\n### `app/global-error.tsx` (React Error Boundary)\n\n```tsx\n"use client";\n\nimport * as Sentry from "@sentry/nextjs";\nimport { useEffect } from "react";\n\nexport default function GlobalError({\n  error,\n}: {\n  error: Error & { digest?: string };\n}) {\n  useEffect(() => {\n    Sentry.captureException(error);\n  }, [error]);\n\n  return (\n    <html>\n      <body>\n        <h1>Something went wrong!</h1>\n      </body>\n    </html>\n  );\n}\n```\n\n## Source Maps\n\nAdd your auth token to `.env.sentry-build-plugin` for local development:\n\n```bash\nSENTRY_AUTH_TOKEN=sntrys_eyJ...\n```\n\nFor CI/CD, set `SENTRY_AUTH_TOKEN` as an environment variable in your build system.\n\n## Verify Your Setup\n\nStart your dev server and visit the test page:\n\n```bash\nnpm run dev\n```\n\nNavigate to `http://localhost:3000/sentry-example-page` and click "Throw Sample Error" to verify errors, traces, replays, and logs are flowing into Sentry.\n\n## Sending Logs\n\n```typescript\nimport * as Sentry from "@sentry/nextjs";\n\nSentry.logger.info("User action", { userId: "123" });\nSentry.logger.warn("Slow response", { duration: 5000 });\nSentry.logger.error("Operation failed", { reason: "timeout" });\n```\n',
  name: "Sentry Next.js SDK",
  packages: ["@sentry/nextjs"],
  rank: 10,
  slug: "nextjs",
};

export default nextjs;
