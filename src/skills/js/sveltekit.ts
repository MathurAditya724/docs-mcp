import type { SentrySkill } from "../../types";

const sveltekit: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  // Add optional integrations for additional features\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  // Capture 100% of transactions for tracing\n  tracesSampleRate: 1.0,\n  // Capture Replay for 10% of all sessions\n  replaysSessionSampleRate: 0.1,\n  // Capture Replay for 100% of sessions with errors\n  replaysOnErrorSampleRate: 1.0,\n});\n\n// Capture an example error\ntry {\n  throw new Error('This is a test error');\n} catch (error) {\n  Sentry.captureException(error);\n}",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your SvelteKit application.",
      "name": "Error Monitoring",
      "setup": "Install the Sentry SvelteKit SDK using the wizard with `npx @sentry/wizard@latest -i sveltekit`. The wizard will create or update your `hooks.client.js` and `hooks.server.js` files to initialize the SDK and instrument SvelteKit's hooks. For SvelteKit 2.31.0+, it also creates `instrumentation.server.js` and updates `svelte.config.js` to enable server-side instrumentation.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  // Set tracesSampleRate to 1.0 to capture 100% of transactions\n  // We recommend adjusting this in production\n  tracesSampleRate: 1.0,\n});",
      "description": "Track software performance and follow requests from frontend to backend with distributed tracing.",
      "name": "Tracing",
      "setup": "Enable tracing by setting `tracesSampleRate` in your `Sentry.init()` call inside `hooks.client.js` and `hooks.server.js`. For SvelteKit 2.31.0+, initialize the server SDK in `instrumentation.server.js` and enable observability in `svelte.config.js` to get accurate spans for handlers, server actions, load, and remote functions.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  // Capture Replay for 10% of all sessions\n  replaysSessionSampleRate: 0.1,\n  // Capture Replay for 100% of sessions with errors\n  replaysOnErrorSampleRate: 1.0,\n});",
      "description": "Get a video-like reproduction of what was happening in the user's browser before, during, and after an issue.",
      "name": "Session Replay",
      "setup": "Add the `replayIntegration()` to your `Sentry.init()` call in `hooks.client.js`. Configure `replaysSessionSampleRate` to control how many sessions are recorded, and `replaysOnErrorSampleRate` to capture full replays for sessions where errors occurred.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  // Enable logging\n  _experiments: {\n    enableLogs: true,\n  },\n});\n\n// Use Sentry logger\nconst { logger } = Sentry;\n\nlogger.info('User logged in', { userId: '123' });\nlogger.error('Payment failed', { orderId: 'abc' });",
      "description": "Centralize and analyze application logs to correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Enable logging in your `Sentry.init()` call in `hooks.client.js` and/or `hooks.server.js` by enabling the logs feature. You can then use Sentry's logger to emit structured log entries that appear on the Logs page in Sentry and can be filtered by service, environment, or keywords.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  integrations: [\n    Sentry.browserProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profilesSampleRate: 1.0,\n});",
      "description": "Profile your SvelteKit application's code to identify performance bottlenecks at the function level.",
      "name": "Profiling",
      "setup": "Add the `browserProfilingIntegration()` to your `Sentry.init()` call in `hooks.client.js`. Set `profilesSampleRate` to control what fraction of transactions are profiled. Profiling requires tracing to be enabled, so also configure `tracesSampleRate`.",
      "slug": "profiling"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for SvelteKit\n\n### Prerequisites\n\n- A Sentry account and project\n- SvelteKit version 2.0.0+ (2.31.0+ recommended)\n- Vite version 4.2+\n\n### Step 1: Install\n\nRun the Sentry installation wizard in your project directory:\n\n```bash\nnpx @sentry/wizard@latest -i sveltekit\n```\n\nThe wizard will guide you through setup and automatically:\n- Create or update `hooks.client.js` and `hooks.server.js`\n- Create or update `vite.config.js` with source maps upload and auto-instrumentation\n- For SvelteKit 2.31.0+: create `instrumentation.server.js` and update `svelte.config.js`\n- Create `.env.sentry-build-plugin` with an auth token\n\n### Step 2: Verify Initialization Files\n\nAfter the wizard runs, your `hooks.client.js` should look like:\n\n```javascript\n// hooks.client.js\nimport * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n});\n\nexport const handleError = Sentry.handleErrorWithSentry();\n```\n\nAnd your `hooks.server.js`:\n\n```javascript\n// hooks.server.js\nimport * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  tracesSampleRate: 1.0,\n});\n\nexport const handleError = Sentry.handleErrorWithSentry();\nexport const handle = Sentry.sentryHandle();\n```\n\nFor SvelteKit 2.31.0+, also create `instrumentation.server.js`:\n\n```javascript\n// instrumentation.server.js\nimport * as Sentry from '@sentry/sveltekit';\n\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  tracesSampleRate: 1.0,\n});\n```\n\n### Step 3: Update vite.config.js\n\n```javascript\n// vite.config.js\nimport { sveltekit } from '@sveltejs/kit/vite';\nimport { sentryVitePlugin } from '@sentry/vite-plugin';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  plugins: [\n    sveltekit(),\n    sentryVitePlugin({\n      org: 'your-org',\n      project: 'your-project',\n    }),\n  ],\n  build: {\n    sourcemap: true,\n  },\n});\n```\n\n### Step 4: Optional – Avoid Ad Blockers with Tunneling\n\n```javascript\n// hooks.client.js\nSentry.init({\n  dsn: '___PUBLIC_DSN___',\n  tunnel: '/tunnel',\n});\n```\n\n### Step 5: Verify Your Setup\n\nOpen `/sentry-example-page` in your browser and click the \"Throw Sample Error\" button to confirm errors are captured. Then check your Sentry project's **Issues**, **Traces**, **Replays**, and **Logs** pages to view the collected data.",
  "name": "SvelteKit",
  "packages": [
    "@sentry/sveltekit",
    "@sentry/vite-plugin"
  ],
  "rank": 10,
  "slug": "sveltekit"
};

export default sveltekit;
