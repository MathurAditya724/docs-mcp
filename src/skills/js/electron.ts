import type { SentrySkill } from "../../types";

const electron: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/electron/main\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n  integrations: [Sentry.startupTracingIntegration()],\n});\n\n// Test error in main process\nimport { app } from \"electron\";\n\napp.on(\"ready\", () => {\n  throw new Error(\"Sentry test error in main process\");\n});",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in both Electron main and renderer processes.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/electron and initialize the SDK in both the main process and every renderer process. In the main process, import from @sentry/electron/main and call Sentry.init() with your DSN as early as possible. In renderer processes, import from @sentry/electron/renderer and call Sentry.init() with your configuration.",
      "slug": "error-monitoring"
    },
    {
      "code": "// Main process (main.js)\nimport * as Sentry from \"@sentry/electron/main\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n  integrations: [Sentry.startupTracingIntegration()],\n});\n\n// Renderer process (renderer.js)\nimport * as Sentry from \"@sentry/electron/renderer\";\n\nSentry.init({\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n  integrations: [Sentry.browserTracingIntegration()],\n});\n\n// Example: measure a span in the renderer\ndocument.getElementById(\"testButton\").addEventListener(\"click\", () => {\n  Sentry.startSpan(\n    { op: \"test\", name: \"Renderer test span\" },\n    () => {\n      // your code here\n    }\n  );\n});",
      "description": "Track software performance and measure operation durations across both the Electron main and renderer processes with distributed tracing.",
      "name": "Tracing",
      "setup": "Enable tracing by setting tracesSampleRate in both the main and renderer process Sentry.init() calls. In the main process, add the startupTracingIntegration() to track startup performance. In the renderer process, add the browserTracingIntegration(). Use Sentry.startSpan() to manually measure code sections.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/electron/renderer\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});",
      "description": "Record video-like reproductions of user sessions in the renderer process to help debug issues by seeing exactly what happened before, during, and after an error.",
      "name": "Session Replay",
      "setup": "Add the replayIntegration() to the integrations array in your renderer process Sentry.init() call. Configure replaysSessionSampleRate to control the percentage of sessions recorded and replaysOnErrorSampleRate to capture sessions where errors occur.",
      "slug": "session-replay"
    },
    {
      "code": "// Main process (main.js)\nimport * as Sentry from \"@sentry/electron/main\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\n// Renderer process (renderer.js)\nimport * as Sentry from \"@sentry/electron/renderer\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\n// Utility process (utility.js)\nimport * as Sentry from \"@sentry/electron/utility\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});",
      "description": "Send application logs from the main, renderer, and utility processes to Sentry to correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in the Sentry.init() configuration for each process type (main, renderer, and utility). This allows you to centralize and analyze your application logs in Sentry alongside errors and performance data.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/electron/renderer\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});",
      "description": "Embed a user feedback widget in Electron renderer windows to collect reports directly from users when they encounter issues.",
      "name": "User Feedback",
      "setup": "Add the feedbackIntegration() to the integrations array in your renderer process Sentry.init() call. Customize the widget appearance and behavior using the integration's configuration options such as colorScheme.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Electron\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/electron --save\n```\n\n### Step 2: Configure the Main Process\n\nInitialize the SDK in your Electron main process as early as possible:\n\n```javascript\n// main.js\nimport * as Sentry from \"@sentry/electron/main\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n  integrations: [Sentry.startupTracingIntegration()],\n  enableLogs: true,\n});\n```\n\n### Step 3: Configure the Renderer Process\n\nInitialize the SDK in every renderer process you spawn:\n\n```javascript\n// renderer.js\nimport * as Sentry from \"@sentry/electron/renderer\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\n### Step 4: Configure Utility Processes (Optional)\n\n```javascript\n// utility.js\nimport * as Sentry from \"@sentry/electron/utility\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n```\n\n### Step 5: Preload Script (Optional)\n\nIf your app uses a preload script with `contextIsolation: true`, initialize Sentry there too:\n\n```javascript\n// preload.js\nimport * as Sentry from \"@sentry/electron/renderer\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n});\n```\n\n### Step 6: Using with Framework-Specific SDKs (Optional)\n\nIf you use a framework like React in your renderers:\n\n```javascript\nimport { init } from \"@sentry/electron/renderer\";\nimport { init as reactInit } from \"@sentry/react\";\n\ninit(\n  {\n    dsn: \"___PUBLIC_DSN___\",\n    integrations: [/* integrations */],\n  },\n  reactInit,\n);\n```\n\n### Step 7: Add Source Maps (Optional)\n\nUpload source maps for readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n### Step 8: Verify Your Setup\n\nTest the main process:\n\n```javascript\nimport { app } from \"electron\";\nimport * as Sentry from \"@sentry/electron/main\";\n\napp.on(\"ready\", () => {\n  throw new Error(\"Sentry test error in main process\");\n});\n```\n\nTest the renderer process:\n\n```html\n<!-- index.html -->\n<button id=\"testError\">Break the world</button>\n<script src=\"renderer.js\"></script>\n```\n\n```javascript\n// renderer.js\ndocument.getElementById(\"testError\").addEventListener(\"click\", () => {\n  Sentry.startSpan(\n    { op: \"test\", name: \"Renderer test span\" },\n    () => {\n      throw new Error(\"Sentry test error in renderer process\");\n    }\n  );\n});\n```\n\nCheck your [Sentry dashboard](https://sentry.io) to verify errors, traces, replays, and logs are being captured.",
  "name": "Electron",
  "packages": [
    "@sentry/electron"
  ],
  "rank": 5,
  "slug": "electron"
};

export default electron;
