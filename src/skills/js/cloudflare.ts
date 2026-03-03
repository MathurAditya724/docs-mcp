import type { SentrySkill } from "../../types";

const cloudflare: SentrySkill = {
  category: "runtime",
  ecosystem: "javascript",
  features: [
    {
      code: 'Sentry.captureException(new Error("something broke"));',
      description: "Auto-captures errors in Workers and Pages.",
      name: "Error Monitoring",
      setup:
        "Configured by withSentry()/sentryPagesPlugin(). Manual: Sentry.captureException().",
      slug: "error-monitoring",
    },
    {
      code: 'await Sentry.startSpan({ op: "db.query", name: "fetch users" }, async () => {\n  return await env.DB.prepare("SELECT * FROM users").all();\n});',
      description: "Distributed tracing. CPU-bound spans show 0ms in Workers.",
      name: "Tracing",
      setup:
        "Already configured: tracesSampleRate in gettingStarted init. Sentry.startSpan() for custom spans.",
      slug: "tracing",
    },
    {
      code: 'Sentry.logger.info("Worker received request", { url: request.url });',
      description: "Structured logs correlated with errors and traces.",
      name: "Logs",
      setup:
        "Already configured: enableLogs in gettingStarted init. Use Sentry.logger.*() to emit logs.",
      slug: "logs",
    },
    {
      code: 'Sentry.withMonitor("daily-cleanup", async () => {\n  await env.DB.prepare("DELETE FROM sessions WHERE expired_at < datetime(\'now\')").run();\n});',
      description: "Monitor scheduled tasks for missed/late/failed runs.",
      name: "Crons",
      setup: "Sentry.withMonitor() or captureCheckIn().",
      slug: "crons",
    },
    {
      code: 'Sentry.captureFeedback({ name: "Jane", email: "jane@example.com", message: "Bug report" });',
      description: "User feedback via API.",
      name: "User Feedback",
      setup:
        "Sentry.captureFeedback(). Pages frontend: add feedbackIntegration() client-side.",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '```bash\nnpm install @sentry/cloudflare\n```\n\nRequires `nodejs_compat` in wrangler.jsonc: `{ "compatibility_flags": ["nodejs_compat"] }`\n\n**Workers:**\n```typescript\nimport * as Sentry from "@sentry/cloudflare";\nexport default Sentry.withSentry(\n  (env: Env) => ({\n    dsn: "___PUBLIC_DSN___",\n    sendDefaultPii: true,\n    tracesSampleRate: 1.0,\n    enableLogs: true,\n  }),\n  {\n    async fetch(request, env, ctx) {\n      return new Response("Hello World!");\n    },\n  },\n);\n```\n\n**Pages** (`functions/_middleware.js`):\n```javascript\nimport * as Sentry from "@sentry/cloudflare";\nexport const onRequest = [\n  Sentry.sentryPagesPlugin((context) => ({\n    dsn: "___PUBLIC_DSN___",\n    sendDefaultPii: true,\n    tracesSampleRate: 1.0,\n    enableLogs: true,\n  })),\n];\n```\n\nSource maps: `"upload_source_maps": true` in wrangler.jsonc.',
  name: "Cloudflare",
  packages: ["@sentry/cloudflare"],
  rank: 3,
  slug: "cloudflare",
};

export default cloudflare;
