import type { SentrySkill } from "../../types";

const remix: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/remix\";\nimport { useLocation, useMatches } from \"@remix-run/react\";\nimport { useEffect } from \"react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({\n      useEffect,\n      useLocation,\n      useMatches,\n    }),\n  ],\n  tracesSampleRate: 1.0,\n});",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Remix application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/remix and run the wizard with `npx @sentry/wizard@latest -i remix`. The wizard creates or updates entry.client.tsx and entry.server.tsx to initialize the SDK with error monitoring enabled by default.",
      "slug": "error-monitoring"
    },
    {
      "code": "import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from \"@remix-run/react\";\nimport { withSentry } from \"@sentry/remix\";\nimport * as Sentry from \"@sentry/remix\";\nimport { useLocation, useMatches } from \"@remix-run/react\";\nimport { useEffect } from \"react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({\n      useEffect,\n      useLocation,\n      useMatches,\n    }),\n  ],\n  tracesSampleRate: 1.0,\n});\n\nfunction App() {\n  return (\n    <html>\n      <head>\n        <Meta />\n        <Links />\n      </head>\n      <body>\n        <Outlet />\n        <ScrollRestoration />\n        <Scripts />\n        <LiveReload />\n      </body>\n    </html>\n  );\n}\n\nexport default withSentry(App);",
      "description": "Track software performance across the frontend and backend with distributed tracing, including server-side performance monitoring via the withSentry wrapper.",
      "name": "Tracing",
      "setup": "Enable tracing by adding the browserTracingIntegration in entry.client.tsx and wrapping your Remix root component with withSentry in root.tsx. Set tracesSampleRate to control the volume of performance data collected.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/remix\";\nimport { useLocation, useMatches } from \"@remix-run/react\";\nimport { useEffect } from \"react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({\n      useEffect,\n      useLocation,\n      useMatches,\n    }),\n    Sentry.replayIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});",
      "description": "Record video-like reproductions of user sessions in the browser to help diagnose and reproduce issues.",
      "name": "Session Replay",
      "setup": "Add the replayIntegration to your Sentry.init call in entry.client.tsx. Configure replaysSessionSampleRate for general session recording and replaysOnErrorSampleRate to capture sessions where errors occurred.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from \"@sentry/remix\";\nimport { useLocation, useMatches } from \"@remix-run/react\";\nimport { useEffect } from \"react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({\n      useEffect,\n      useLocation,\n      useMatches,\n    }),\n  ],\n  tracesSampleRate: 1.0,\n  _experiments: {\n    enableLogs: true,\n  },\n});\n\n// Use Sentry logger to emit logs\nconst { logger } = Sentry;\n\nlogger.info(\"User loaded the page\");\nlogger.warn(\"Something looks off\", { userId: \"123\" });\nlogger.error(\"Something went wrong\", { errorCode: 500 });",
      "description": "Centralize and analyze application logs, correlating them with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable logs by adding _experiments: { enableLogs: true } to your Sentry.init call. Use the Sentry logger API to emit structured log entries that appear in the Sentry Logs page.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/remix\";\nimport { useLocation, useMatches } from \"@remix-run/react\";\nimport { useEffect } from \"react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({\n      useEffect,\n      useLocation,\n      useMatches,\n    }),\n    Sentry.browserProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profilesSampleRate: 1.0,\n});",
      "description": "Collect detailed code-level profiling data to identify performance bottlenecks in your Remix application.",
      "name": "Profiling",
      "setup": "Add the browserProfilingIntegration to your Sentry.init call in entry.client.tsx and set profilesSampleRate to control the volume of profiling data collected. Profiling requires tracing to be enabled.",
      "slug": "profiling"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Remix\n\n### Step 1: Install\n\nRun the Sentry installation wizard in your Remix project directory:\n\n```bash\nnpx @sentry/wizard@latest -i remix\n```\n\nThe wizard guides you through setup, creates or updates `entry.client.tsx` and `entry.server.tsx`, configures source maps, and optionally adds an example page.\n\nAlternatively, install the package manually:\n\n```bash\nnpm install @sentry/remix\n```\n\n### Step 2: Initialize Sentry on the Client\n\nCreate or update `app/entry.client.tsx`:\n\n```tsx\nimport { RemixBrowser } from \"@remix-run/react\";\nimport { startTransition, StrictMode, useEffect } from \"react\";\nimport { hydrateRoot } from \"react-dom/client\";\nimport * as Sentry from \"@sentry/remix\";\nimport { useLocation, useMatches } from \"@remix-run/react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({\n      useEffect,\n      useLocation,\n      useMatches,\n    }),\n    Sentry.replayIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nstartTransition(() => {\n  hydrateRoot(\n    document,\n    <StrictMode>\n      <RemixBrowser />\n    </StrictMode>\n  );\n});\n```\n\n### Step 3: Initialize Sentry on the Server\n\nCreate or update `app/entry.server.tsx`:\n\n```tsx\nimport * as Sentry from \"@sentry/remix\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\n// ... rest of your server entry\n```\n\n### Step 4: Wrap Root Component for Server-Side Performance Monitoring\n\nUpdate `app/root.tsx`:\n\n```tsx\nimport { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from \"@remix-run/react\";\nimport { withSentry } from \"@sentry/remix\";\n\nfunction App() {\n  return (\n    <html>\n      <head>\n        <Meta />\n        <Links />\n      </head>\n      <body>\n        <Outlet />\n        <ScrollRestoration />\n        <Scripts />\n        <LiveReload />\n      </body>\n    </html>\n  );\n}\n\nexport default withSentry(App);\n```\n\n### Step 5: Verify Your Setup\n\nOpen `/sentry-example-page` in your browser and click \"Throw Sample Error\" to trigger a test error. Then visit your Sentry project to confirm data is being received.\n",
  "name": "Remix",
  "packages": [
    "@sentry/remix"
  ],
  "rank": 10,
  "slug": "remix"
};

export default remix;
