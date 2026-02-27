import type { SentrySkill } from "../../types";

const tanstackstartReact: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/tanstackstart-react\";\nimport { createRouter } from '@tanstack/react-router';\n\nexport const getRouter = () => {\n  const router = createRouter();\n\n  if (!router.isServer) {\n    Sentry.init({\n      dsn: \"___PUBLIC_DSN___\",\n      sendDefaultPii: true,\n    });\n  }\n\n  return router;\n};",
      "description": "Automatically capture unhandled errors and exceptions in your TanStack Start React application on both client and server.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/tanstackstart-react, initialize Sentry in src/router.tsx for client-side and create instrument.server.mjs for server-side, then add sentryGlobalRequestMiddleware and sentryGlobalFunctionMiddleware in src/start.ts to capture server-side errors.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/tanstackstart-react\";\nimport { createRouter } from '@tanstack/react-router';\n\nexport const getRouter = () => {\n  const router = createRouter();\n\n  if (!router.isServer) {\n    Sentry.init({\n      dsn: \"___PUBLIC_DSN___\",\n      sendDefaultPii: true,\n      integrations: [\n        Sentry.tanstackRouterBrowserTracingIntegration(router),\n      ],\n      tracesSampleRate: 1.0,\n    });\n  }\n\n  return router;\n};",
      "description": "Track software performance and distributed traces across frontend and backend requests in TanStack Start React.",
      "name": "Tracing",
      "setup": "Add tanstackRouterBrowserTracingIntegration(router) to the integrations array in Sentry.init in src/router.tsx, set tracesSampleRate, and add tracesSampleRate to instrument.server.mjs. Wrap your server entry with wrapFetchWithSentry in src/server.ts.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/tanstackstart-react\";\nimport { createRouter } from '@tanstack/react-router';\n\nexport const getRouter = () => {\n  const router = createRouter();\n\n  if (!router.isServer) {\n    Sentry.init({\n      dsn: \"___PUBLIC_DSN___\",\n      sendDefaultPii: true,\n      integrations: [\n        Sentry.replayIntegration(),\n      ],\n      replaysSessionSampleRate: 0.1,\n      replaysOnErrorSampleRate: 1.0,\n    });\n  }\n\n  return router;\n};",
      "description": "Record video-like reproductions of user sessions to help debug issues in TanStack Start React applications.",
      "name": "Session Replay",
      "setup": "Add replayIntegration() to the integrations array in Sentry.init in src/router.tsx, and configure replaysSessionSampleRate and replaysOnErrorSampleRate to control how many sessions are recorded.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from \"@sentry/tanstackstart-react\";\nimport { createRouter } from '@tanstack/react-router';\n\nexport const getRouter = () => {\n  const router = createRouter();\n\n  if (!router.isServer) {\n    Sentry.init({\n      dsn: \"___PUBLIC_DSN___\",\n      sendDefaultPii: true,\n      enableLogs: true,\n    });\n  }\n\n  return router;\n};",
      "description": "Send application logs to Sentry to correlate them with errors and performance issues in TanStack Start React.",
      "name": "Logs",
      "setup": "Set enableLogs: true in Sentry.init in both src/router.tsx (client-side) and instrument.server.mjs (server-side) to enable log forwarding to Sentry.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/tanstackstart-react\";\nimport { createRouter } from '@tanstack/react-router';\n\nexport const getRouter = () => {\n  const router = createRouter();\n\n  if (!router.isServer) {\n    Sentry.init({\n      dsn: \"___PUBLIC_DSN___\",\n      sendDefaultPii: true,\n      integrations: [\n        Sentry.feedbackIntegration({\n          colorScheme: \"system\",\n        }),\n      ],\n    });\n  }\n\n  return router;\n};",
      "description": "Collect user feedback directly from your TanStack Start React application via a built-in feedback widget.",
      "name": "User Feedback",
      "setup": "Add feedbackIntegration() to the integrations array in Sentry.init in src/router.tsx to display a feedback widget in your application, configuring options like colorScheme as needed.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for TanStack Start React\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/tanstackstart-react --save\n```\n\n### Step 2: Configure Client-Side Sentry\n\nInitialize Sentry in your `src/router.tsx` file:\n\n```tsx\n// src/router.tsx\nimport * as Sentry from \"@sentry/tanstackstart-react\";\nimport { createRouter } from '@tanstack/react-router';\n\nexport const getRouter = () => {\n  const router = createRouter();\n\n  if (!router.isServer) {\n    Sentry.init({\n      dsn: \"___PUBLIC_DSN___\",\n      sendDefaultPii: true,\n      integrations: [\n        Sentry.tanstackRouterBrowserTracingIntegration(router),\n        Sentry.replayIntegration(),\n        Sentry.feedbackIntegration({\n          colorScheme: \"system\",\n        }),\n      ],\n      enableLogs: true,\n      tracesSampleRate: 1.0,\n      replaysSessionSampleRate: 0.1,\n      replaysOnErrorSampleRate: 1.0,\n    });\n  }\n\n  return router;\n};\n```\n\n### Step 3: Configure Server-Side Sentry\n\nCreate `instrument.server.mjs` in the root of your project:\n\n```js\n// instrument.server.mjs\nimport * as Sentry from \"@sentry/tanstackstart-react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n  tracesSampleRate: 1.0,\n});\n```\n\n### Step 4: Instrument the Server Entry Point\n\nCreate `src/server.ts`:\n\n```ts\n// src/server.ts\nimport { wrapFetchWithSentry } from \"@sentry/tanstackstart-react\";\nimport handler, { createServerEntry } from \"@tanstack/react-start/server-entry\";\n\nexport default createServerEntry(\n  wrapFetchWithSentry({\n    fetch(request: Request) {\n      return handler.fetch(request);\n    },\n  }),\n);\n```\n\n### Step 5: Add Sentry Vite Plugin\n\nAdd your auth token to `.env`:\n\n```bash\nSENTRY_AUTH_TOKEN=___ORG_AUTH_TOKEN___\n```\n\nUpdate `vite.config.ts`:\n\n```ts\n// vite.config.ts\nimport { defineConfig } from \"vite\";\nimport { sentryTanstackStart } from \"@sentry/tanstackstart-react/vite\";\nimport { tanstackStart } from \"@tanstack/react-start/plugin/vite\";\n\nexport default defineConfig({\n  plugins: [\n    tanstackStart(),\n    // sentryTanstackStart should be last\n    sentryTanstackStart({\n      org: \"___ORG_SLUG___\",\n      project: \"___PROJECT_SLUG___\",\n      authToken: process.env.SENTRY_AUTH_TOKEN,\n    }),\n  ],\n});\n```\n\n### Step 6: Capture Server-Side Errors\n\nAdd Sentry middlewares in `src/start.ts`:\n\n```tsx\n// src/start.ts\nimport {\n  sentryGlobalFunctionMiddleware,\n  sentryGlobalRequestMiddleware,\n} from \"@sentry/tanstackstart-react\";\nimport { createStart } from \"@tanstack/react-start\";\n\nexport const startInstance = createStart(() => {\n  return {\n    requestMiddleware: [sentryGlobalRequestMiddleware],\n    functionMiddleware: [sentryGlobalFunctionMiddleware],\n  };\n});\n```\n\n### Step 7: Load Instrumentation on Startup\n\nUpdate your `package.json` scripts:\n\n```json\n{\n  \"scripts\": {\n    \"build\": \"vite build && cp instrument.server.mjs .output/server\",\n    \"dev\": \"NODE_OPTIONS='--import ./instrument.server.mjs' vite dev --port 3000\",\n    \"start\": \"node --import ./.output/server/instrument.server.mjs .output/server/index.mjs\"\n  }\n}\n```\n\n### Step 8: Verify\n\nAdd a test button to trigger an error:\n\n```tsx\n<button\n  type=\"button\"\n  onClick={() => {\n    throw new Error(\"Sentry Test Error\");\n  }}\n>\n  Break the world\n</button>\n```\n\nClick the button and check your Sentry project for the captured error.",
  "name": "Sentry TanStack Start React SDK",
  "packages": [
    "@sentry/tanstackstart-react"
  ],
  "rank": 5,
  "slug": "tanstackstart-react"
};

export default tanstackstartReact;
