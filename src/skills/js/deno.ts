import type { SentrySkill } from "../../types";

const deno: SentrySkill = {
  "category": "runtime",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"npm:@sentry/deno\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nsetTimeout(() => {\n  try {\n    foo();\n  } catch (e) {\n    Sentry.captureException(e);\n  }\n}, 99);",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Deno application.",
      "name": "Error Monitoring",
      "setup": "Import the Sentry Deno SDK at the top of your main file before any other imports, then call Sentry.init() with your DSN and sendDefaultPii set to true. Run your app with --allow-net=<your-ingest-domain> to allow the SDK to send events and --allow-read=./src to include source code in stack traces.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"npm:@sentry/deno\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\nSentry.startSpan(\n  {\n    op: \"test\",\n    name: \"My First Test Transaction\",\n  },\n  () => {\n    setTimeout(() => {\n      try {\n        foo();\n      } catch (e) {\n        Sentry.captureException(e);\n      }\n    }, 99);\n  },\n);",
      "description": "Track software performance and measure the duration of operations using distributed tracing spans.",
      "name": "Tracing",
      "setup": "Add tracesSampleRate to your Sentry.init() call to enable performance monitoring. Set it to 1.0 to capture 100% of transactions during development, and adjust it to a lower value in production. Use Sentry.startSpan() to manually instrument code you want to measure.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"npm:@sentry/deno\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  enableLogs: true,\n});\n\nconst { logger } = Sentry;\n\nlogger.info(\"Application started\");\nlogger.error(\"Something went wrong\", { detail: \"extra context\" });",
      "description": "Send structured application logs to Sentry and correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in your Sentry.init() call. Once enabled, use the Sentry logger API to emit log entries that will be visible on the Sentry Logs page where you can search, filter, and visualize them.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"npm:@sentry/deno\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nconst checkInId = Sentry.captureCheckIn({\n  monitorSlug: \"my-cron-job\",\n  status: \"in_progress\",\n});\n\ntry {\n  // your cron job logic here\n  Sentry.captureCheckIn({\n    checkInId,\n    monitorSlug: \"my-cron-job\",\n    status: \"ok\",\n  });\n} catch (e) {\n  Sentry.captureCheckIn({\n    checkInId,\n    monitorSlug: \"my-cron-job\",\n    status: \"error\",\n  });\n  throw e;\n}",
      "description": "Monitor scheduled tasks and cron jobs by capturing check-ins to track their execution status.",
      "name": "Crons",
      "setup": "Use Sentry.captureCheckIn() to instrument your cron jobs. Call it with status 'in_progress' at the start, then 'ok' on success or 'error' on failure, passing the returned checkInId to subsequent calls.",
      "slug": "crons"
    }
  ],
  "gettingStarted": "# Sentry for Deno\n\n## Prerequisites\n\n- Deno version >= 2.0.0\n- A Sentry account and project\n\n## Step 1: Install\n\nImport the Sentry Deno SDK directly from the npm registry at the top of your main file, before any other imports:\n\n```typescript\nimport * as Sentry from \"npm:@sentry/deno\";\n```\n\n## Step 2: Configure\n\nInitialize Sentry as early as possible in your application:\n\n```typescript\n// main.ts\nimport * as Sentry from \"npm:@sentry/deno\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Adds request headers and IP for users\n  sendDefaultPii: true,\n  // Set tracesSampleRate to 1.0 to capture 100% of transactions\n  tracesSampleRate: 1.0,\n  // Enable logs to be sent to Sentry\n  enableLogs: true,\n});\n```\n\n## Step 3: Enable Network Access\n\nTo allow the SDK to send events, grant network access to your Sentry ingestion domain:\n\n```bash\ndeno run --allow-net=<your-ingest-domain> main.ts\n```\n\nAlso grant read access to your source files for better stack traces:\n\n```bash\ndeno run --allow-net=<your-ingest-domain> --allow-read=./src main.ts\n```\n\n## Step 4: Add Source Maps (Optional)\n\nUpload source maps to Sentry for readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n## Step 5: Verify Your Setup\n\nTest that Sentry is capturing errors correctly:\n\n```typescript\nimport * as Sentry from \"npm:@sentry/deno\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\n// Test error capture\nsetTimeout(() => {\n  try {\n    foo();\n  } catch (e) {\n    Sentry.captureException(e);\n  }\n}, 99);\n\n// Test tracing\nSentry.startSpan(\n  {\n    op: \"test\",\n    name: \"My First Test Transaction\",\n  },\n  () => {\n    console.log(\"Transaction started\");\n  },\n);\n```\n\nRun your app and check your Sentry project dashboard to confirm events are being received.",
  "name": "Deno",
  "packages": [
    "@sentry/deno"
  ],
  "rank": 3,
  "slug": "deno"
};

export default deno;
