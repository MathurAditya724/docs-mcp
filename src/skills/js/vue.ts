import type { SentrySkill } from "../../types";

const vue: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import { createApp } from \"vue\";\nimport { createRouter } from \"vue-router\";\nimport * as Sentry from \"@sentry/vue\";\n\nconst app = createApp({\n  // ...\n});\n\nconst router = createRouter({\n  // ...\n});\n\nSentry.init({\n  app,\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\napp.use(router);\napp.mount(\"#app\");",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Vue application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/vue and initialize Sentry in your main.js file by calling Sentry.init() with your DSN and the app instance before mounting your Vue application.",
      "slug": "error-monitoring"
    },
    {
      "code": "import { createApp } from \"vue\";\nimport { createRouter } from \"vue-router\";\nimport * as Sentry from \"@sentry/vue\";\n\nconst app = createApp({\n  // ...\n});\n\nconst router = createRouter({\n  // ...\n});\n\nSentry.init({\n  app,\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration({ router }),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^\\/api/],\n});\n\napp.use(router);\napp.mount(\"#app\");",
      "description": "Track software performance and monitor the impact of errors across multiple systems with distributed tracing integrated with Vue Router.",
      "name": "Tracing",
      "setup": "Add browserTracingIntegration to the integrations array in Sentry.init(), passing your Vue Router instance to enable automatic route-based performance tracing. Set tracesSampleRate to control the volume of traces collected.",
      "slug": "tracing"
    },
    {
      "code": "import { createApp } from \"vue\";\nimport * as Sentry from \"@sentry/vue\";\n\nconst app = createApp({\n  // ...\n});\n\nSentry.init({\n  app,\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\napp.mount(\"#app\");",
      "description": "Record video-like reproductions of user browser sessions to help diagnose and reproduce issues faster.",
      "name": "Session Replay",
      "setup": "Add replayIntegration to the integrations array in Sentry.init() and configure replaysSessionSampleRate and replaysOnErrorSampleRate to control how often sessions are recorded.",
      "slug": "session-replay"
    },
    {
      "code": "import { createApp } from \"vue\";\nimport * as Sentry from \"@sentry/vue\";\n\nconst app = createApp({\n  // ...\n});\n\nSentry.init({\n  app,\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\napp.mount(\"#app\");",
      "description": "Centralize and analyze application logs by correlating them with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable the logs feature by setting enableLogs: true in your Sentry.init() configuration in main.js.",
      "slug": "logs"
    },
    {
      "code": "import { createApp } from \"vue\";\nimport * as Sentry from \"@sentry/vue\";\n\nconst app = createApp({\n  // ...\n});\n\nSentry.init({\n  app,\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});\n\napp.mount(\"#app\");",
      "description": "Collect user feedback directly from your Vue application with a built-in feedback widget.",
      "name": "User Feedback",
      "setup": "Add feedbackIntegration to the integrations array in Sentry.init() to enable the user feedback widget in your Vue application. Customize the widget appearance with options like colorScheme.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "# Sentry for Vue.js\n\n## Step 1: Install\n\n```bash\nnpm install @sentry/vue --save\n```\n\n## Step 2: Configure\n\nAdd the following to your `main.js` file:\n\n```javascript\nimport { createApp } from \"vue\";\nimport { createRouter } from \"vue-router\";\nimport * as Sentry from \"@sentry/vue\";\n\nconst app = createApp({\n  // ...\n});\n\nconst router = createRouter({\n  // ...\n});\n\nSentry.init({\n  app,\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration({ router }),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  // Enable logs to be sent to Sentry\n  enableLogs: true,\n  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.\n  tracesSampleRate: 1.0,\n  // Set tracePropagationTargets to control for which URLs trace propagation should be enabled\n  tracePropagationTargets: [\"localhost\", /^\\/api/],\n  // Capture Replay for 10% of all sessions,\n  // plus for 100% of sessions with an error\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\napp.use(router);\napp.mount(\"#app\");\n```\n\n## Step 3: Add Source Maps (Optional)\n\nUpload source maps to Sentry to get readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n## Step 4: Verify Your Setup\n\nAdd a test button to one of your Vue components to trigger an error:\n\n```vue\n<template>\n  <button @click=\"throwError\">Throw error</button>\n</template>\n\n<script>\nexport default {\n  methods: {\n    throwError() {\n      throw new Error('Sentry Error');\n    }\n  }\n};\n</script>\n```\n\nClick the button and check your Sentry project to confirm the error was captured.",
  "name": "Vue.js",
  "packages": [
    "@sentry/vue"
  ],
  "rank": 8,
  "slug": "vue"
};

export default vue;
