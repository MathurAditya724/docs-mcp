import type { SentrySkill } from "../../types";

const reactRouter: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/react-router\";\nimport { startTransition, StrictMode } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport { HydratedRouter } from \"react-router/dom\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <HydratedRouter />\n    </StrictMode>,\n  );\n});",
      "description": "Automatically captures errors, uncaught exceptions, and unhandled rejections in your React Router application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/react-router and initialize Sentry in your entry.client.tsx file with your DSN. The SDK automatically captures errors and exceptions throughout your React Router application.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/react-router\";\nimport { startTransition, StrictMode } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport { HydratedRouter } from \"react-router/dom\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.reactRouterTracingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [/^\\//, /^https:\\/\\/yourserver\\.io\\/api/],\n});\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <HydratedRouter />\n    </StrictMode>,\n  );\n});",
      "description": "Tracks software performance and monitors interactions between multiple services using distributed tracing with React Router routing instrumentation.",
      "name": "Tracing",
      "setup": "Add the reactRouterTracingIntegration() to your Sentry.init() call in entry.client.tsx, and set tracesSampleRate to control the percentage of transactions captured. Also configure tracesSampleRate on the server in instrument.server.mjs.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/react-router\";\nimport { startTransition, StrictMode } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport { HydratedRouter } from \"react-router/dom\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <HydratedRouter />\n    </StrictMode>,\n  );\n});",
      "description": "Records video-like reproductions of user sessions in the browser to help diagnose and reproduce issues.",
      "name": "Session Replay",
      "setup": "Add the replayIntegration() to your Sentry.init() call in entry.client.tsx and configure replaysSessionSampleRate and replaysOnErrorSampleRate to control session recording frequency.",
      "slug": "session-replay"
    },
    {
      "code": "// instrument.server.mjs\nimport * as Sentry from \"@sentry/react-router\";\nimport { nodeProfilingIntegration } from \"@sentry/profiling-node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});",
      "description": "Gains deeper insight into server-side performance by profiling slow or resource-intensive functions without custom instrumentation.",
      "name": "Profiling",
      "setup": "Install @sentry/profiling-node and add the nodeProfilingIntegration() to your server-side Sentry.init() in instrument.server.mjs. Set profileSessionSampleRate to control the percentage of sessions that are profiled.",
      "slug": "profiling"
    },
    {
      "code": "// entry.client.tsx\nimport * as Sentry from \"@sentry/react-router\";\nimport { startTransition, StrictMode } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport { HydratedRouter } from \"react-router/dom\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <HydratedRouter />\n    </StrictMode>,\n  );\n});",
      "description": "Embeds a feedback widget in your React Router application so users can report issues directly from the browser.",
      "name": "User Feedback",
      "setup": "Add the feedbackIntegration() to your Sentry.init() call in entry.client.tsx. Configure it with options like colorScheme to match your application's theme.",
      "slug": "user-feedback"
    },
    {
      "code": "// entry.client.tsx\nimport * as Sentry from \"@sentry/react-router\";\nimport { startTransition, StrictMode } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport { HydratedRouter } from \"react-router/dom\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\n// Example usage\nconst { logger } = Sentry;\nlogger.info(\"React Router app initialized\");\nlogger.error(\"Something went wrong\", { userId: \"123\" });\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <HydratedRouter />\n    </StrictMode>,\n  );\n});",
      "description": "Centralizes and correlates application logs with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in your Sentry.init() call in both entry.client.tsx and instrument.server.mjs. Logs are then correlated with errors and traces in Sentry.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for React Router\n\n### Option 1: Installation Wizard (Recommended)\n\nRun the installation wizard in your project directory:\n\n```bash\nnpx @sentry/wizard@latest -i reactRouter\n```\n\nThe wizard will:\n- Install the `@sentry/react-router` package (and optionally `@sentry/profiling-node`)\n- Reveal React Router entry point files (`entry.client.tsx` and `entry.server.tsx`)\n- Initialize Sentry in client and server entry files\n- Create `instrument.server.mjs` for server-side instrumentation\n- Update `app/root.tsx` to capture errors in the error boundary\n- Configure source map upload in `vite.config.ts` and `react-router.config.ts`\n\n### Option 2: Manual Installation\n\n#### 1. Install packages\n\n```bash\nnpm install @sentry/react-router\n# Optionally for server-side profiling:\nnpm install @sentry/profiling-node\n```\n\n#### 2. Create `instrument.server.mjs`\n\n```js\nimport * as Sentry from \"@sentry/react-router\";\nimport { nodeProfilingIntegration } from \"@sentry/profiling-node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});\n```\n\n#### 3. Configure `entry.client.tsx`\n\n```tsx\nimport * as Sentry from \"@sentry/react-router\";\nimport { startTransition, StrictMode } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport { HydratedRouter } from \"react-router/dom\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.reactRouterTracingIntegration(),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  enableLogs: true,\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [/^\\//, /^https:\\/\\/yourserver\\.io\\/api/],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <HydratedRouter />\n    </StrictMode>,\n  );\n});\n```\n\n### Verify Your Setup\n\n1. Open the example page `/sentry-example-page` in your browser (e.g., `http://localhost:5173/sentry-example-page`)\n2. Click the button to trigger a test error\n3. Visit your Sentry project to confirm the error appears in the Issues page\n4. Check the Traces page for performance data and the Replays page for session recordings\n",
  "name": "React Router",
  "packages": [
    "@sentry/react-router",
    "@sentry/profiling-node"
  ],
  "rank": 10,
  "slug": "react-router"
};

export default reactRouter;
