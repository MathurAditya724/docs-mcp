import type { SentrySkill } from "../../types";

const solid: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/solid\";\nimport { ErrorBoundary } from \"solid-js\";\n\n// Wrap Solid's ErrorBoundary to automatically capture exceptions\nconst SentryErrorBoundary = Sentry.withSentryErrorBoundary(ErrorBoundary);\n\nexport default function SomeComponent() {\n  return (\n    <SentryErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>\n      <div>Some Component</div>\n    </SentryErrorBoundary>\n  );\n}",
      "description": "Automatically capture exceptions from inside Solid component trees using a wrapped ErrorBoundary.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/solid and initialize Sentry in your index.(jsx|tsx) file before rendering your app. Wrap component trees with Sentry.withSentryErrorBoundary(ErrorBoundary) to capture errors automatically.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/solid\";\nimport { solidRouterBrowserTracingIntegration } from \"@sentry/solid/solidrouter\";\nimport { render } from \"solid-js/web\";\nimport { DEV } from \"solid-js\";\nimport App from \"./app\";\n\nif (!DEV) {\n  Sentry.init({\n    dsn: \"___PUBLIC_DSN___\",\n    integrations: [\n      solidRouterBrowserTracingIntegration(),\n    ],\n    tracesSampleRate: 1.0,\n    tracePropagationTargets: [\"localhost\", /^\\/api/],\n  });\n}\n\nconst app = document.getElementById(\"app\");\nif (!app) throw new Error(\"No #app element found in the DOM.\");\nrender(() => <App />, app);\n\n// Test tracing with a span\n<button\n  type=\"button\"\n  onClick={() => {\n    Sentry.startSpan(\n      { op: \"test\", name: \"Example Frontend Span\" },\n      () => {\n        setTimeout(() => {\n          throw new Error(\"Sentry Test Error\");\n        }, 99);\n      }\n    );\n  }}\n>\n  Break the world\n</button>",
      "description": "Track software performance and distributed tracing using the Solid Router browser tracing integration.",
      "name": "Tracing",
      "setup": "Add solidRouterBrowserTracingIntegration from @sentry/solid/solidrouter to the integrations array in Sentry.init and set tracesSampleRate to control the volume of traces collected.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/solid\";\nimport { render } from \"solid-js/web\";\nimport { DEV } from \"solid-js\";\nimport App from \"./app\";\n\nif (!DEV) {\n  Sentry.init({\n    dsn: \"___PUBLIC_DSN___\",\n    integrations: [\n      Sentry.replayIntegration(),\n    ],\n    replaysSessionSampleRate: 0.1,\n    replaysOnErrorSampleRate: 1.0,\n  });\n}\n\nconst app = document.getElementById(\"app\");\nif (!app) throw new Error(\"No #app element found in the DOM.\");\nrender(() => <App />, app);",
      "description": "Record video-like reproductions of user sessions in the browser to help debug issues.",
      "name": "Session Replay",
      "setup": "Add Sentry.replayIntegration() to the integrations array and configure replaysSessionSampleRate and replaysOnErrorSampleRate in Sentry.init to control session capture volume.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from \"@sentry/solid\";\nimport { render } from \"solid-js/web\";\nimport { DEV } from \"solid-js\";\nimport App from \"./app\";\n\nif (!DEV) {\n  Sentry.init({\n    dsn: \"___PUBLIC_DSN___\",\n    enableLogs: true,\n  });\n}\n\nconst app = document.getElementById(\"app\");\nif (!app) throw new Error(\"No #app element found in the DOM.\");\nrender(() => <App />, app);",
      "description": "Send structured application logs to Sentry and correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in Sentry.init. Logs will be forwarded to Sentry and can be searched, filtered, and visualized in the Logs page.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/solid\";\nimport { render } from \"solid-js/web\";\nimport { DEV } from \"solid-js\";\nimport App from \"./app\";\n\nif (!DEV) {\n  Sentry.init({\n    dsn: \"___PUBLIC_DSN___\",\n    integrations: [\n      Sentry.feedbackIntegration({\n        colorScheme: \"system\",\n      }),\n    ],\n  });\n}\n\nconst app = document.getElementById(\"app\");\nif (!app) throw new Error(\"No #app element found in the DOM.\");\nrender(() => <App />, app);",
      "description": "Collect user feedback directly from your Solid application via a built-in feedback widget.",
      "name": "User Feedback",
      "setup": "Add Sentry.feedbackIntegration() to the integrations array in Sentry.init. Configure the widget appearance and behavior using integration options such as colorScheme.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Solid\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/solid --save\n```\n\n### Step 2: Initialize Sentry\n\nAdd Sentry initialization as early as possible in your application, for example in `index.jsx` or `index.tsx`:\n\n```jsx\n// index.jsx\nimport * as Sentry from \"@sentry/solid\";\nimport { solidRouterBrowserTracingIntegration } from \"@sentry/solid/solidrouter\";\nimport { render } from \"solid-js/web\";\nimport { DEV } from \"solid-js\";\nimport App from \"./app\";\n\n// Only initialize Sentry in production builds\nif (!DEV) {\n  Sentry.init({\n    dsn: \"___PUBLIC_DSN___\",\n    sendDefaultPii: true,\n    integrations: [\n      solidRouterBrowserTracingIntegration(),\n      Sentry.replayIntegration(),\n      Sentry.feedbackIntegration({\n        colorScheme: \"system\",\n      }),\n    ],\n    enableLogs: true,\n    tracesSampleRate: 1.0,\n    tracePropagationTargets: [\"localhost\", /^\\/api/],\n    replaysSessionSampleRate: 0.1,\n    replaysOnErrorSampleRate: 1.0,\n  });\n}\n\nconst app = document.getElementById(\"app\");\nif (!app) throw new Error(\"No #app element found in the DOM.\");\nrender(() => <App />, app);\n```\n\n### Step 3: Capture Solid Errors\n\nWrap Solid's `ErrorBoundary` with Sentry's helper to automatically capture component errors:\n\n```jsx\nimport * as Sentry from \"@sentry/solid\";\nimport { ErrorBoundary } from \"solid-js\";\n\nconst SentryErrorBoundary = Sentry.withSentryErrorBoundary(ErrorBoundary);\n\nexport default function SomeComponent() {\n  return (\n    <SentryErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>\n      <div>Some Component</div>\n    </SentryErrorBoundary>\n  );\n}\n```\n\n### Step 4: Add Source Maps (Optional)\n\nUpload source maps for readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n### Step 5: Verify Your Setup\n\nAdd a test button to trigger an error:\n\n```jsx\n<button\n  type=\"button\"\n  onClick={() => {\n    throw new Error(\"Sentry Test Error\");\n  }}\n>\n  Break the world\n</button>\n```\n\nClick the button and check your [Sentry Issues page](https://sentry.io) to confirm events are being captured.",
  "name": "Sentry Solid SDK",
  "packages": [
    "@sentry/solid"
  ],
  "rank": 5,
  "slug": "solid"
};

export default solid;
