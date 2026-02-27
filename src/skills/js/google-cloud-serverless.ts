import type { SentrySkill } from "../../types";

const googleCloudServerless: SentrySkill = {
  "category": "runtime",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "const Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nexports.helloHttp = Sentry.wrapHttpFunction((req, res) => {\n  throw new Error(\"oh, hello there!\");\n});",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in Google Cloud Functions.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/google-cloud-serverless and call Sentry.init() at the top of your function file. Wrap each function with the appropriate helper (wrapHttpFunction, wrapEventFunction, or wrapCloudEventFunction) to ensure errors are captured and reported to Sentry.",
      "slug": "error-monitoring"
    },
    {
      "code": "const Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\nexports.helloHttp = Sentry.wrapHttpFunction(async (req, res) => {\n  await Sentry.startSpan(\n    { op: \"test\", name: \"My First Test Transaction\" },\n    async () => {\n      await new Promise((resolve) => setTimeout(resolve, 100));\n    },\n  );\n  res.status(200).send(\"Success!\");\n});",
      "description": "Track software performance and distributed traces across Google Cloud Functions.",
      "name": "Tracing",
      "setup": "Add tracesSampleRate to your Sentry.init() call to enable performance monitoring. Use Sentry.startSpan() to create custom spans within your functions and wrap functions with the appropriate Sentry helper.",
      "slug": "tracing"
    },
    {
      "code": "const Sentry = require(\"@sentry/google-cloud-serverless\");\nconst { nodeProfilingIntegration } = require(\"@sentry/profiling-node\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [nodeProfilingIntegration()],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});\n\nexports.helloHttp = Sentry.wrapHttpFunction((req, res) => {\n  res.status(200).send(\"Hello!\");\n});",
      "description": "Gain deeper insight into slow or resource-intensive functions with code-level profiling in Google Cloud Functions.",
      "name": "Profiling",
      "setup": "Install @sentry/profiling-node in addition to @sentry/google-cloud-serverless. Add nodeProfilingIntegration() to the integrations array and set profileSessionSampleRate in your Sentry.init() call.",
      "slug": "profiling"
    },
    {
      "code": "const Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nexports.helloHttp = Sentry.wrapHttpFunction((req, res) => {\n  Sentry.logger.info(\"Processing HTTP request\", { path: req.path });\n  res.status(200).send(\"Hello!\");\n});",
      "description": "Centralize and correlate application logs with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable logging by initializing Sentry with your DSN. Use Sentry.logger methods to emit structured log entries that can be searched, filtered, and correlated with errors in the Sentry Logs page.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Google Cloud Functions\n\n### Step 1: Install the SDK\n\n```bash\nnpm install @sentry/google-cloud-serverless --save\n```\n\nIf you want profiling support, also install:\n\n```bash\nnpm install @sentry/google-cloud-serverless @sentry/profiling-node --save\n```\n\n### Step 2: Configure Sentry\n\nInitialize Sentry at the top of your function file and wrap your function with the appropriate helper.\n\n**HTTP Functions:**\n\n```javascript\nconst Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\nexports.helloHttp = Sentry.wrapHttpFunction((req, res) => {\n  res.status(200).send(\"Hello from GCP!\");\n});\n```\n\n**Background Functions:**\n\n```javascript\nconst Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\nexports.helloBackground = Sentry.wrapEventFunction((data, context, callback) => {\n  callback();\n});\n```\n\n**CloudEvent Functions:**\n\n```javascript\nconst Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\nexports.helloCloudEvent = Sentry.wrapCloudEventFunction((cloudEvent) => {\n  console.log(cloudEvent);\n});\n```\n\n### Step 3: Add Source Maps (Optional)\n\nUpload source maps to Sentry for readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n### Step 4: Verify Your Setup\n\nAdd an intentional error to test that Sentry is capturing issues:\n\n```javascript\nconst Sentry = require(\"@sentry/google-cloud-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  tracesSampleRate: 1.0,\n});\n\nexports.helloHttp = Sentry.wrapHttpFunction((req, res) => {\n  throw new Error(\"Sentry Test Error - This is intentional!\");\n});\n```\n\nDeploy and invoke your function, then check your Sentry project's **Issues** page to confirm the error was captured.",
  "name": "Google Cloud Functions",
  "packages": [
    "@sentry/google-cloud-serverless",
    "@sentry/profiling-node"
  ],
  "rank": 3,
  "slug": "google-cloud-serverless"
};

export default googleCloudServerless;
