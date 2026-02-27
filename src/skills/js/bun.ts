import type { SentrySkill } from "../../types";

const bun: SentrySkill = {
  "category": "runtime",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/bun\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\n// Capture an error manually\ntry {\n  foo();\n} catch (e) {\n  Sentry.captureException(e);\n}",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Bun application.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/bun using the Bun package manager. Create an instrument.js file in the root of your project and initialize Sentry with your DSN. Preload the instrumentation file using the --preload flag when starting your app: `bun --preload ./instrument.js app.js`.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/bun\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\n// Wrap your code in a span to measure performance\nSentry.startSpan(\n  {\n    op: \"test\",\n    name: \"My First Test Transaction\",\n  },\n  () => {\n    setTimeout(() => {\n      try {\n        foo();\n      } catch (e) {\n        Sentry.captureException(e);\n      }\n    }, 99);\n  },\n);",
      "description": "Track software performance and distributed tracing to follow requests across multiple systems in your Bun application.",
      "name": "Tracing",
      "setup": "Install @sentry/bun using the Bun package manager. Create an instrument.js file and initialize Sentry with tracesSampleRate set between 0 and 1.0. Preload the instrumentation file using the --preload flag: `bun --preload ./instrument.js app.js`. View traces on the Traces page in your Sentry project.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/bun\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\n// Use Sentry logger to send structured logs\nconst { logger } = Sentry;\n\nlogger.info(\"User logged in\", { userId: 123 });\nlogger.error(\"Something went wrong\", { error: \"details\" });",
      "description": "Centralize and analyze application logs in Sentry, correlating them with errors and performance issues.",
      "name": "Logs",
      "setup": "Install @sentry/bun using the Bun package manager. Create an instrument.js file and initialize Sentry with enableLogs set to true. Preload the instrumentation file using the --preload flag: `bun --preload ./instrument.js app.js`. View logs on the Logs page in your Sentry project.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "# Sentry for Bun - Getting Started\n\n## Step 1: Install\n\n```bash\nbun add @sentry/bun\n```\n\n## Step 2: Configure\n\nCreate a file named `instrument.js` in the root directory of your project:\n\n```javascript\n// instrument.js\nimport * as Sentry from \"@sentry/bun\";\n\n// Ensure to call this before importing any other modules!\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Adds request headers and IP for users\n  sendDefaultPii: true,\n  // Performance Monitoring\n  tracesSampleRate: 1.0, // Capture 100% of transactions; adjust in production\n  // Enable logs to be sent to Sentry\n  enableLogs: true,\n});\n```\n\n## Step 3: Apply Instrumentation\n\nPreload your instrumentation file using the `--preload` flag when starting your app:\n\n```bash\nbun --preload ./instrument.js app.js\n```\n\n> **Note:** Sentry's auto-instrumentation does not work with bundled code, including Bun's single-file executables. If you need to bundle your application, you'll need to manually instrument your code.\n\n## Step 4: Add Source Maps (Optional)\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n## Step 5: Verify Your Setup\n\nAdd the following to your main application file to test error capture:\n\n```javascript\nimport * as Sentry from \"@sentry/bun\";\n\n// Test error monitoring\nsetTimeout(() => {\n  try {\n    foo();\n  } catch (e) {\n    Sentry.captureException(e);\n  }\n}, 99);\n\n// Test tracing\nSentry.startSpan(\n  {\n    op: \"test\",\n    name: \"My First Test Transaction\",\n  },\n  () => {\n    setTimeout(() => {\n      try {\n        foo();\n      } catch (e) {\n        Sentry.captureException(e);\n      }\n    }, 99);\n  },\n);\n```\n\nHead over to your Sentry project to view the captured data on the Issues, Traces, and Logs pages.",
  "name": "Bun",
  "packages": [
    "@sentry/bun"
  ],
  "rank": 3,
  "slug": "bun"
};

export default bun;
