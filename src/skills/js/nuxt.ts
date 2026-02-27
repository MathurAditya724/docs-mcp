import type { SentrySkill } from "../../types";

const nuxt: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "// sentry.client.config.ts\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Tracing\n  tracesSampleRate: 1.0,\n  // Session Replay\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n});",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Nuxt application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/nuxt and run the wizard with `npx @sentry/wizard@latest -i nuxt`. This creates sentry.client.config.ts and sentry.server.config.ts files that initialize the SDK on both client and server sides. The wizard also updates nuxt.config.ts with the necessary build options.",
      "slug": "error-monitoring"
    },
    {
      "code": "// sentry.client.config.ts\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Enable tracing\n  tracesSampleRate: 1.0,\n  // Optionally trace only a sample of requests\n  // tracesSampleRate: 0.1,\n});",
      "description": "Track software performance and follow requests from the frontend to the backend with distributed tracing.",
      "name": "Tracing",
      "setup": "Enable tracing by setting tracesSampleRate in your Sentry.init() call in sentry.client.config.ts and sentry.server.config.ts. The installation wizard can configure this automatically when you opt in during setup.",
      "slug": "tracing"
    },
    {
      "code": "// sentry.client.config.ts\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  // Session Replay sample rates\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});",
      "description": "Get video-like reproductions of user sessions to understand what was happening before, during, and after an issue.",
      "name": "Session Replay",
      "setup": "Add the replayIntegration() to your Sentry.init() call in sentry.client.config.ts and configure replaysSessionSampleRate and replaysOnErrorSampleRate. The installation wizard can enable this automatically during setup.",
      "slug": "session-replay"
    },
    {
      "code": "// sentry.client.config.ts\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Enable logs\n  _experiments: {\n    enableLogs: true,\n  },\n});\n\n// Use Sentry logger in your application\nconst { logger } = Sentry;\n\nlogger.info(\"User signed in\", { userId: \"123\" });\nlogger.error(\"Payment failed\", { orderId: \"456\" });",
      "description": "Centralize and analyze application logs to correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Enable logs in your Sentry.init() call by setting the enableLogs experiment flag. Once enabled, use the Sentry logger to emit structured log entries that appear in the Sentry Logs page.",
      "slug": "logs"
    },
    {
      "code": "// sentry.client.config.ts\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profilesSampleRate: 1.0,\n});",
      "description": "Profile your Nuxt application's JavaScript code to identify performance bottlenecks at the function level.",
      "name": "Profiling",
      "setup": "Add the browserProfilingIntegration() to your Sentry.init() call in sentry.client.config.ts and set profilesSampleRate alongside tracesSampleRate. Profiling requires tracing to be enabled.",
      "slug": "profiling"
    },
    {
      "code": "// In a Nuxt page or component\nimport * as Sentry from \"@sentry/nuxt\";\n\n// Show the user feedback dialog\nSentry.showReportDialog({\n  eventId: Sentry.lastEventId(),\n});\n\n// Or use the feedback integration\n// sentry.client.config.ts\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});",
      "description": "Collect user feedback when errors occur to better understand the impact and context of issues.",
      "name": "User Feedback",
      "setup": "Add the feedbackIntegration() to your Sentry.init() call in sentry.client.config.ts. This adds a feedback widget to your application that users can interact with to submit reports when they encounter issues.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "# Sentry Nuxt SDK - Getting Started\n\n## Prerequisites\n\n- A Sentry account and project\n- Nuxt version 3.7.0 or above (3.14.0+ recommended)\n\n## Step 1: Install\n\nRun the Sentry installation wizard in your project directory:\n\n```bash\nnpx @sentry/wizard@latest -i nuxt\n```\n\nThe wizard guides you through setup and can enable:\n- **Error Monitoring** (always enabled)\n- **Tracing** (performance monitoring)\n- **Session Replay** (video-like session recordings)\n- **Logs** (structured log ingestion)\n\nThe wizard will:\n- Create `sentry.client.config.ts` and `sentry.server.config.ts`\n- Update `nuxt.config.ts` with build options, source maps, and auto-instrumentation\n- Create `.env.sentry-build-plugin` with an auth token\n- Add an example page at `/sentry-example-page`\n\n## Step 2: Review Generated Config Files\n\n### `sentry.client.config.ts`\n\n```typescript\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n\n  // Tracing\n  tracesSampleRate: 1.0,\n\n  // Session Replay\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n});\n```\n\n### `sentry.server.config.ts`\n\n```typescript\nimport * as Sentry from \"@sentry/nuxt\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n\n  // Tracing\n  tracesSampleRate: 1.0,\n});\n```\n\n## Step 3: Nuxt Config\n\nThe wizard updates your `nuxt.config.ts` to add the Sentry module:\n\n```typescript\n// nuxt.config.ts\nexport default defineNuxtConfig({\n  modules: [\"@sentry/nuxt/module\"],\n  sentry: {\n    sourceMapsUploadOptions: {\n      org: \"your-org\",\n      project: \"your-project\",\n    },\n  },\n});\n```\n\n## Step 4: Run Your Application\n\n### Production Mode (Recommended)\n\n```bash\n# Build your project\nnuxi build\n\n# Start with Sentry server instrumentation\nnode --import ./.output/server/sentry.server.config.mjs .output/server/index.mjs\n```\n\n### Development Mode\n\n```bash\n# Run once without the flag to generate the server config\nnuxt dev\n\n# Then run with the --import flag\nNODE_OPTIONS='--import ./.nuxt/dev/sentry.server.config.mjs' nuxt dev\n```\n\n## Step 5: Verify\n\n1. Open `/sentry-example-page` in your browser (e.g., `http://localhost:3000/sentry-example-page`)\n2. Click **\"Throw sample error\"** to trigger a frontend error and API error\n3. Visit your [Sentry project](https://sentry.io) to view the captured errors in the Issues page\n\n> **Note:** Errors triggered from browser developer tools are sandboxed and will not appear in Sentry.\n\n## Optional: Tunneling (Ad Blocker Bypass)\n\nTo prevent ad blockers from blocking Sentry events, add a tunnel:\n\n```typescript\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tunnel: \"/tunnel\",\n});\n```\n\nThen configure a server route to forward events to Sentry. See the [Troubleshooting docs](https://docs.sentry.io/platforms/javascript/guides/nuxt/troubleshooting/) for details.\n",
  "name": "Sentry Nuxt SDK",
  "packages": [
    "@sentry/nuxt"
  ],
  "rank": 10,
  "slug": "nuxt"
};

export default nuxt;
