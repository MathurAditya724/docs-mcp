import type { SentrySkill } from "../../types";

const node: SentrySkill = {
  "category": "runtime",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\n// Capture an error manually\ntry {\n  foo();\n} catch (e) {\n  Sentry.captureException(e);\n}",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Node.js application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/node with your package manager. Create an instrument.js file in the root of your project and call Sentry.init() with your DSN before requiring any other modules. For CommonJS, require('./instrument') at the top of your main file. For ESM, use the --import ./instrument.mjs flag when starting Node.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\n// Create a performance trace\nSentry.startSpan(\n  {\n    op: \"test\",\n    name: \"My First Test Transaction\",\n  },\n  () => {\n    setTimeout(() => {\n      try {\n        foo();\n      } catch (e) {\n        Sentry.captureException(e);\n      }\n    }, 99);\n  },\n);",
      "description": "Track software performance and measure the time taken for code execution using distributed tracing.",
      "name": "Tracing",
      "setup": "Install @sentry/node and set tracesSampleRate in your Sentry.init() call. Create an instrument.js file with the init configuration and load it before all other modules. Use Sentry.startSpan() to create custom spans in your application code.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/node\";\nimport { nodeProfilingIntegration } from \"@sentry/profiling-node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});",
      "description": "Gain deeper insight into slow or resource-intensive functions in your Node.js app without custom instrumentation.",
      "name": "Profiling",
      "setup": "Install both @sentry/node and @sentry/profiling-node packages. Import nodeProfilingIntegration from @sentry/profiling-node and add it to the integrations array in Sentry.init(). Set profileSessionSampleRate to control what percentage of sessions are profiled.",
      "slug": "profiling"
    },
    {
      "code": "import * as Sentry from \"@sentry/node\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\n// Use Sentry logger\nconst { logger } = Sentry;\nlogger.info(\"User logged in\", { userId: 123 });\nlogger.error(\"Something went wrong\", { error: \"details\" });",
      "description": "Send structured application logs to Sentry to correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Install @sentry/node and set enableLogs: true in your Sentry.init() call. Create an instrument.js file with the init configuration and load it before all other modules. Use Sentry.logger to emit structured log entries at various severity levels.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Node.js\n\n### Prerequisites\n\n- A Sentry account and project\n- Node.js version 18.0.0 or above (>= 19.9.0 or 18.19.0 recommended)\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/node\n```\n\n### Step 2: Configure\n\nCreate a file named `instrument.js` (or `instrument.mjs` for ESM) in the root directory of your project:\n\n**CommonJS (`instrument.js`)**\n```js\nconst Sentry = require(\"@sentry/node\");\n\n// Ensure to call this before requiring any other modules!\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\n**ESM (`instrument.mjs`)**\n```js\nimport * as Sentry from \"@sentry/node\";\n\n// Ensure to call this before importing any other modules!\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n  enableLogs: true,\n});\n```\n\n### Step 3: Apply Instrumentation\n\n**CommonJS** — Require `instrument.js` before any other modules in your main file:\n\n```js\n// app.js\n// Require this first!\nrequire(\"./instrument\");\n\n// Now require other modules\nconst http = require(\"http\");\n\n// Your application code goes here\n```\n\n**ESM** — Use the `--import` flag when starting your application:\n\n```bash\n# Note: This is only available for Node v18.19.0 onwards.\nnode --import ./instrument.mjs app.mjs\n```\n\n### Step 4: Add Source Maps (Optional)\n\nUpload source maps so stack traces map back to your original code:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n### Step 5: Verify Your Setup\n\nAdd the following snippet to your main application file to trigger a test error:\n\n```js\nsetTimeout(() => {\n  try {\n    foo();\n  } catch (e) {\n    Sentry.captureException(e);\n  }\n}, 99);\n```\n\nRun your application and check your Sentry project's **Issues** page to confirm the error was captured.",
  "name": "Node.js",
  "packages": [
    "@sentry/node",
    "@sentry/profiling-node"
  ],
  "rank": 3,
  "slug": "node"
};

export default node;
