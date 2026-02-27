import type { SentrySkill } from "../../types";

const svelte: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import { mount } from \"svelte\";\nimport \"./app.css\";\nimport App from \"./App.svelte\";\nimport * as Sentry from \"@sentry/svelte\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nconst app = mount(App, {\n  target: document.getElementById(\"app\"),\n});\n\nexport default app;",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Svelte application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/svelte and initialize Sentry in your main.js or main.ts file before bootstrapping your Svelte app. Call Sentry.init() with your DSN to enable automatic error capturing.",
      "slug": "error-monitoring"
    },
    {
      "code": "import { mount } from \"svelte\";\nimport \"./app.css\";\nimport App from \"./App.svelte\";\nimport * as Sentry from \"@sentry/svelte\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^\\/https:\\/\\/yourserver\\.io\\/api/],\n});\n\nconst app = mount(App, {\n  target: document.getElementById(\"app\"),\n});\n\nexport default app;",
      "description": "Track software performance and monitor distributed traces across your Svelte frontend and backend services.",
      "name": "Tracing",
      "setup": "Add browserTracingIntegration to the integrations array in your Sentry.init() call and set a tracesSampleRate to control what percentage of transactions are captured.",
      "slug": "tracing"
    },
    {
      "code": "import { mount } from \"svelte\";\nimport \"./app.css\";\nimport App from \"./App.svelte\";\nimport * as Sentry from \"@sentry/svelte\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nconst app = mount(App, {\n  target: document.getElementById(\"app\"),\n});\n\nexport default app;",
      "description": "Record video-like reproductions of user sessions in the browser to help debug issues faster.",
      "name": "Session Replay",
      "setup": "Add replayIntegration to the integrations array in your Sentry.init() call and configure replaysSessionSampleRate and replaysOnErrorSampleRate to control session sampling.",
      "slug": "session-replay"
    },
    {
      "code": "import { mount } from \"svelte\";\nimport \"./app.css\";\nimport App from \"./App.svelte\";\nimport * as Sentry from \"@sentry/svelte\";\nimport { logger } from \"@sentry/svelte\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\n// Example usage of Sentry logger\nlogger.info(\"App mounted successfully\");\nlogger.error(\"Something went wrong\", { context: \"main\" });\n\nconst app = mount(App, {\n  target: document.getElementById(\"app\"),\n});\n\nexport default app;",
      "description": "Centralize and analyze application logs by sending them to Sentry to correlate with errors and performance issues.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in your Sentry.init() call, then use the Sentry logger API to emit structured log messages from your Svelte application.",
      "slug": "logs"
    },
    {
      "code": "import { mount } from \"svelte\";\nimport \"./app.css\";\nimport App from \"./App.svelte\";\nimport * as Sentry from \"@sentry/svelte\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});\n\nconst app = mount(App, {\n  target: document.getElementById(\"app\"),\n});\n\nexport default app;",
      "description": "Collect user feedback directly from your Svelte application via a built-in feedback widget.",
      "name": "User Feedback",
      "setup": "Add feedbackIntegration to the integrations array in your Sentry.init() call to enable a feedback widget that allows users to submit reports directly from your app.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "# Sentry Svelte SDK - Getting Started\n\n## 1. Install the SDK\n\n```bash\nnpm install @sentry/svelte --save\n```\n\n## 2. Initialize Sentry\n\nIn your Svelte entry point (`main.js` or `main.ts`), initialize Sentry before bootstrapping your app:\n\n```js\n// main.js\nimport { mount } from \"svelte\";\nimport \"./app.css\";\nimport App from \"./App.svelte\";\nimport * as Sentry from \"@sentry/svelte\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  // Enable logs\n  enableLogs: true,\n  // Tracing\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^\\/https:\\/\\/yourserver\\.io\\/api/],\n  // Session Replay\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nconst app = mount(App, {\n  target: document.getElementById(\"app\"),\n});\n\nexport default app;\n```\n\n## 3. Verify Your Setup\n\nAdd a test button to one of your Svelte components to trigger an error:\n\n```svelte\n<!-- SomeComponent.svelte -->\n<button\n  type=\"button\"\n  onclick={() => {\n    throw new Error(\"Sentry Frontend Error\");\n  }}\n>\n  Throw error\n</button>\n```\n\nOpen the page in a browser and click the button. The error should appear in your Sentry project under **Issues**.\n\n## 4. Add Source Maps (Optional)\n\nUpload source maps to Sentry so stack traces map back to your original code:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n## 5. Enable Tunneling to Avoid Ad Blockers (Optional)\n\n```js\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tunnel: \"/tunnel\",\n});\n```\n\nYou will also need to configure a server-side endpoint to forward events to Sentry. See the [Troubleshooting docs](https://docs.sentry.io/platforms/javascript/guides/svelte/) for details.\n",
  "name": "Sentry Svelte SDK",
  "packages": [
    "@sentry/svelte"
  ],
  "rank": 5,
  "slug": "svelte"
};

export default svelte;
