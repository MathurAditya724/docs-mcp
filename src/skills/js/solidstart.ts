import type { SentrySkill } from "../../types";

const solidstart: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/solidstart\";\nimport { ErrorBoundary } from \"solid-js\";\nimport { mount, StartClient } from \"@solidjs/start/client\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\n// Wrap Solid's ErrorBoundary to automatically capture exceptions\nconst SentryErrorBoundary = Sentry.withSentryErrorBoundary(ErrorBoundary);\n\nexport default function SomeComponent() {\n  return (\n    <SentryErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>\n      <div>Some Component</div>\n    </SentryErrorBoundary>\n  );\n}\n\nmount(() => <StartClient />, document.getElementById(\"app\"));",
      "description": "Automatically capture errors and exceptions from your SolidStart application including component tree errors via ErrorBoundary.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/solidstart, then initialize Sentry in src/entry-client.tsx with your DSN. Wrap Solid's ErrorBoundary with Sentry.withSentryErrorBoundary to automatically report exceptions from inside your component tree. Also create src/instrument.server.ts to initialize Sentry on the server side, and wrap your SolidStart config with withSentry in app.config.ts.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/solidstart\";\nimport { solidRouterBrowserTracingIntegration } from \"@sentry/solidstart/solidrouter\";\nimport { mount, StartClient } from \"@solidjs/start/client\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    solidRouterBrowserTracingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n});\n\nmount(() => <StartClient />, document.getElementById(\"app\"));\n\n// src/instrument.server.ts\nimport * as Sentry from \"@sentry/solidstart\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\n// app.tsx - Wrap Router with withSentryRouterRouting\nimport { Router } from \"@solidjs/router\";\nimport { FileRoutes } from \"@solidjs/start/router\";\nimport { withSentryRouterRouting } from \"@sentry/solidstart/solidrouter\";\n\nconst SentryRouter = withSentryRouterRouting(Router);\n\nexport default function App() {\n  return (\n    <SentryRouter>\n      <FileRoutes />\n    </SentryRouter>\n  );\n}\n\n// Usage: create a traced span\nSentry.startSpan(\n  { op: \"test\", name: \"My First Test Transaction\" },\n  async () => {\n    const res = await fetch(\"/sentry-test\");\n    if (!res.ok) {\n      throw new Error(\"Sentry Test Error\");\n    }\n  },\n);",
      "description": "Track software performance and distributed tracing from the client to the server with Solid Router navigation spans.",
      "name": "Tracing",
      "setup": "Add solidRouterBrowserTracingIntegration to your Sentry.init integrations array in src/entry-client.tsx and set tracesSampleRate. Also set tracesSampleRate in your server-side instrument.server.ts. Wrap your Solid Router with withSentryRouterRouting to enable navigation span collection. Add sentryBeforeResponseMiddleware in src/middleware.ts to enable distributed tracing between client and server.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/solidstart\";\nimport { mount, StartClient } from \"@solidjs/start/client\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nmount(() => <StartClient />, document.getElementById(\"app\"));",
      "description": "Record video-like reproductions of user sessions to help debug issues in your SolidStart application.",
      "name": "Session Replay",
      "setup": "Add Sentry.replayIntegration() to the integrations array in your client-side Sentry.init call in src/entry-client.tsx. Set replaysSessionSampleRate (e.g., 0.1 for 10% of sessions) and replaysOnErrorSampleRate (e.g., 1.0 for 100% of error sessions). Session Replay is only available on the client side.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from \"@sentry/solidstart\";\nimport { mount, StartClient } from \"@solidjs/start/client\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\nconst { logger } = Sentry;\n\n// Use structured logging\nlogger.info(\"User logged in\", { userId: \"123\" });\nlogger.error(\"Payment failed\", { orderId: \"456\" });\n\nmount(() => <StartClient />, document.getElementById(\"app\"));",
      "description": "Centralize and analyze application logs by correlating them with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in your Sentry.init configuration on both the client side (src/entry-client.tsx) and server side (src/instrument.server.ts). Then use Sentry's logger to emit structured log entries that will appear in the Sentry Logs page.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/solidstart\";\nimport { mount, StartClient } from \"@solidjs/start/client\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});\n\nmount(() => <StartClient />, document.getElementById(\"app\"));",
      "description": "Add a user feedback widget to your SolidStart application to collect feedback directly from users.",
      "name": "User Feedback",
      "setup": "Add Sentry.feedbackIntegration() to the integrations array in your client-side Sentry.init in src/entry-client.tsx. Configure the widget with options like colorScheme. The widget will automatically appear in your application allowing users to submit feedback.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for SolidStart\n\n> **Note:** This SDK is currently in beta. Beta features are still in progress and may have bugs.\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/solidstart --save\n```\n\n### Step 2: Configure Client-side Sentry\n\nCreate or update `src/entry-client.tsx`:\n\n```tsx\nimport * as Sentry from \"@sentry/solidstart\";\nimport { solidRouterBrowserTracingIntegration } from \"@sentry/solidstart/solidrouter\";\nimport { mount, StartClient } from \"@solidjs/start/client\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    solidRouterBrowserTracingIntegration(),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  enableLogs: true,\n});\n\nmount(() => <StartClient />, document.getElementById(\"app\"));\n```\n\n### Step 3: Configure Server-side Sentry\n\nCreate `src/instrument.server.ts`:\n\n```ts\nimport * as Sentry from \"@sentry/solidstart\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\n### Step 4: Add Server Middleware\n\nCreate or update `src/middleware.ts`:\n\n```ts\nimport { sentryBeforeResponseMiddleware } from \"@sentry/solidstart\";\nimport { createMiddleware } from \"@solidjs/start/middleware\";\n\nexport default createMiddleware({\n  onBeforeResponse: [\n    sentryBeforeResponseMiddleware(),\n    // Add your other middleware handlers after `sentryBeforeResponseMiddleware`\n  ],\n});\n```\n\n### Step 5: Update app.config.ts\n\n```ts\nimport { withSentry } from \"@sentry/solidstart\";\nimport { defineConfig } from \"@solidjs/start/config\";\n\nexport default defineConfig(\n  withSentry(\n    {\n      // other SolidStart config options...\n      middleware: \"./src/middleware.ts\",\n    },\n    {\n      org: \"___ORG_SLUG___\",\n      project: \"___PROJECT_SLUG___\",\n      authToken: process.env.SENTRY_AUTH_TOKEN,\n    },\n  ),\n);\n```\n\n### Step 6: Configure Solid Router (if using Solid Router)\n\nUpdate `app.tsx`:\n\n```tsx\nimport { Router } from \"@solidjs/router\";\nimport { FileRoutes } from \"@solidjs/start/router\";\nimport { withSentryRouterRouting } from \"@sentry/solidstart/solidrouter\";\n\nconst SentryRouter = withSentryRouterRouting(Router);\n\nexport default function App() {\n  return (\n    <SentryRouter>\n      <FileRoutes />\n    </SentryRouter>\n  );\n}\n```\n\n### Step 7: Wrap ErrorBoundary\n\n```tsx\nimport * as Sentry from \"@sentry/solidstart\";\nimport { ErrorBoundary } from \"solid-js\";\n\nconst SentryErrorBoundary = Sentry.withSentryErrorBoundary(ErrorBoundary);\n\nexport default function SomeComponent() {\n  return (\n    <SentryErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>\n      <div>Some Component</div>\n    </SentryErrorBoundary>\n  );\n}\n```\n\n### Step 8: Run Your Application\n\nBuild your application first, then run with the `--import` flag:\n\n```json\n{\n  \"scripts\": {\n    \"start:node\": \"node --import ./.output/server/instrument.server.mjs .output/server/index.mjs\"\n  }\n}\n```\n\n### Step 9: Store Auth Token Securely\n\nCreate a `.env` file:\n\n```bash\nSENTRY_AUTH_TOKEN=your-auth-token\n```\n\n### Step 10: Verify Your Setup\n\nAdd a test button to trigger an error:\n\n```jsx\n<button\n  type=\"button\"\n  onClick={() => {\n    throw new Error(\"Sentry Test Error\");\n  }}\n>\n  Break the world\n</button>\n```\n\nClick the button and check your [Sentry dashboard](https://sentry.io) to see the captured error.",
  "name": "SolidStart",
  "packages": [
    "@sentry/solidstart"
  ],
  "rank": 5,
  "slug": "solidstart"
};

export default solidstart;
