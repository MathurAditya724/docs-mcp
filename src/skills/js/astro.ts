import type { SentrySkill } from "../../types";

const astro: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});",
      "description": "Automatically captures errors, uncaught exceptions, and unhandled rejections in your Astro app.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/astro via the Astro CLI with `npx astro add @sentry/astro`. Register the Sentry integration in astro.config.mjs, then create sentry.client.config.js and sentry.server.config.js files in the root of your project with Sentry.init() calls including your DSN.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n});\n\n// Example: create a custom span\nawait Sentry.startSpan(\n  {\n    name: \"Example Frontend Span\",\n    op: \"test\",\n  },\n  async () => {\n    await fetch(\"/api/some-endpoint\");\n  },\n);",
      "description": "Tracks software performance and distributed traces across frontend and backend in your Astro app.",
      "name": "Tracing",
      "setup": "Add browserTracingIntegration() to the integrations array in your sentry.client.config.js file and set tracesSampleRate. For server-side tracing, set tracesSampleRate in your sentry.server.config.js file as well.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});",
      "description": "Records video-like reproductions of user sessions in the browser to help debug issues.",
      "name": "Session Replay",
      "setup": "Add replayIntegration() to the integrations array in your sentry.client.config.js file, then configure replaysSessionSampleRate and replaysOnErrorSampleRate to control how often sessions are recorded.",
      "slug": "session-replay"
    },
    {
      "code": "// sentry.server.config.js\nimport * as Sentry from \"@sentry/astro\";\nimport { nodeProfilingIntegration } from \"@sentry/profiling-node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});",
      "description": "Provides code-level profiling to identify slow or resource-intensive functions on the server side.",
      "name": "Profiling",
      "setup": "Install @sentry/profiling-node with `npm install @sentry/profiling-node`. Then import nodeProfilingIntegration and add it to the integrations array in your sentry.server.config.js file, and set profileSessionSampleRate.",
      "slug": "profiling"
    },
    {
      "code": "// sentry.client.config.js\nimport * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\n// sentry.server.config.js\nimport * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});",
      "description": "Centralizes and correlates application logs with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in both your sentry.client.config.js and sentry.server.config.js Sentry.init() calls.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});",
      "description": "Adds a user feedback widget to your Astro app so users can report issues directly.",
      "name": "User Feedback",
      "setup": "Add feedbackIntegration() to the integrations array in your sentry.client.config.js file. Configure the widget options such as colorScheme as needed.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Astro\n\n### Prerequisites\n- A Sentry account and project\n- Astro 3.0.0 or above\n- Node runtime (Node adapter or Vercel with Lambda functions)\n\n### Step 1: Install\n\nInstall the Sentry Astro integration using the Astro CLI:\n\n```bash\nnpx astro add @sentry/astro\n```\n\nIf you need profiling, also install:\n\n```bash\nnpm install @sentry/profiling-node\n```\n\n### Step 2: Register the Integration\n\nThe CLI will update your `astro.config.mjs` automatically, or you can do it manually:\n\n```javascript\n// astro.config.mjs\nimport { defineConfig } from \"astro/config\";\nimport sentry from \"@sentry/astro\";\n\nexport default defineConfig({\n  integrations: [\n    sentry({\n      org: \"___ORG_SLUG___\",\n      project: \"___PROJECT_SLUG___\",\n      authToken: process.env.SENTRY_AUTH_TOKEN,\n    }),\n  ],\n});\n```\n\n### Step 3: Configure Client-side Sentry\n\nCreate `sentry.client.config.js` in the root of your project:\n\n```javascript\n// sentry.client.config.js\nimport * as Sentry from \"@sentry/astro\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\n### Step 4: Configure Server-side Sentry\n\nCreate `sentry.server.config.js` in the root of your project:\n\n```javascript\n// sentry.server.config.js\nimport * as Sentry from \"@sentry/astro\";\nimport { nodeProfilingIntegration } from \"@sentry/profiling-node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\n### Step 5: Set Auth Token for Source Maps\n\nAdd your Sentry auth token to your build environment:\n\n```bash\n# .env.sentry-build-plugin\nSENTRY_AUTH_TOKEN=___ORG_AUTH_TOKEN___\n```\n\n### Step 6: Verify Your Setup\n\nCreate a test page at `src/pages/test.astro`:\n\n```html\n<!-- src/pages/test.astro -->\n<script>\n  const button = document.getElementById(\"test\");\n  button.addEventListener(\"click\", () => {\n    throw new Error(\"Sentry Example Frontend Error\");\n  });\n</script>\n<button id=\"test\" type=\"button\">Throw a test error</button>\n```\n\nOpen the page in your browser and click the button. Check your Sentry project's Issues page to confirm the error was captured.\n",
  "name": "Astro",
  "packages": [
    "@sentry/astro",
    "@sentry/profiling-node"
  ],
  "rank": 5,
  "slug": "astro"
};

export default astro;
