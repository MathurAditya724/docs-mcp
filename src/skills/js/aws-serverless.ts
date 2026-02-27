import type { SentrySkill } from "../../types";

const awsServerless: SentrySkill = {
  "category": "runtime",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  throw new Error(\"This is a test error\");\n});",
      "description": "Automatically capture errors and exceptions from AWS Lambda functions with CloudWatch data, function details, and execution time measurements.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/aws-serverless via npm or use the Sentry AWS Lambda Layer. Initialize Sentry at the top of your Lambda handler file and wrap your handler with Sentry.wrapHandler() to automatically capture errors.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  // Your Lambda function logic here\n  return { statusCode: 200, body: \"Hello World\" };\n});",
      "description": "Monitor performance and distributed traces across AWS Lambda function invocations.",
      "name": "Tracing",
      "setup": "Install @sentry/aws-serverless and initialize Sentry with a tracesSampleRate. Wrap your handler with Sentry.wrapHandler() to automatically create transactions for each Lambda invocation.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  profilesSampleRate: 1.0,\n  tracesSampleRate: 1.0,\n});\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  // Your Lambda function logic here\n  return { statusCode: 200, body: \"Profiling enabled\" };\n});",
      "description": "Profile your AWS Lambda function code execution to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Install @sentry/aws-serverless and initialize Sentry with both tracesSampleRate and profilesSampleRate set. Wrap your handler with Sentry.wrapHandler() to enable profiling on Lambda invocations.",
      "slug": "profiling"
    },
    {
      "code": "import * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n});\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  const checkInId = Sentry.captureCheckIn({\n    monitorSlug: \"my-cron-job\",\n    status: \"in_progress\",\n  });\n\n  try {\n    // Your scheduled task logic here\n    await doWork();\n\n    Sentry.captureCheckIn({\n      checkInId,\n      monitorSlug: \"my-cron-job\",\n      status: \"ok\",\n    });\n  } catch (error) {\n    Sentry.captureCheckIn({\n      checkInId,\n      monitorSlug: \"my-cron-job\",\n      status: \"error\",\n    });\n    throw error;\n  }\n});",
      "description": "Monitor scheduled AWS Lambda functions as cron jobs to track their execution status.",
      "name": "Crons",
      "setup": "Install @sentry/aws-serverless and initialize Sentry. Use Sentry.captureCheckIn() to report the start, success, or failure of your scheduled Lambda function invocations.",
      "slug": "crons"
    },
    {
      "code": "import * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  _experiments: {\n    enableLogs: true,\n  },\n});\n\nconst logger = Sentry.logger;\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  logger.info(\"Processing Lambda event\", { eventType: event.type });\n  logger.debug(\"Event details\", { event });\n\n  try {\n    // Your function logic\n    logger.info(\"Lambda function completed successfully\");\n    return { statusCode: 200, body: \"OK\" };\n  } catch (error) {\n    logger.error(\"Lambda function failed\", { error });\n    throw error;\n  }\n});",
      "description": "Capture structured logs from AWS Lambda functions and send them to Sentry.",
      "name": "Logs",
      "setup": "Install @sentry/aws-serverless and initialize Sentry with enableLogs set to true in the _experiments option. Use the Sentry logger methods (info, debug, error, etc.) to emit structured logs from your Lambda functions.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for AWS Lambda\n\n### Installation\n\nYou can install Sentry in your Lambda functions using either the Sentry AWS Lambda Layer (recommended) or the npm package.\n\n**Option 1: NPM Package**\n\n```bash\nnpm install @sentry/aws-serverless\n```\n\n**Option 2: Lambda Layer (Recommended)**\n\nAdd the Sentry Lambda Layer to your function via the AWS Console or your infrastructure-as-code tooling. This avoids deploying Sentry dependencies with your function bundle.\n\n### Configuration\n\nCreate or update your Lambda handler file to initialize Sentry:\n\n**ESM (index.mjs)**\n\n```javascript\nimport * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n\n  // Performance Monitoring\n  tracesSampleRate: 1.0, // Capture 100% of transactions in development, reduce in production\n});\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  // Your Lambda function logic here\n  return { statusCode: 200, body: \"Hello from Lambda!\" };\n});\n```\n\n**CommonJS (index.js)**\n\n```javascript\nconst Sentry = require(\"@sentry/aws-serverless\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n\n  // Performance Monitoring\n  tracesSampleRate: 1.0,\n});\n\nexports.handler = Sentry.wrapHandler(async (event, context) => {\n  // Your Lambda function logic here\n  return { statusCode: 200, body: \"Hello from Lambda!\" };\n});\n```\n\n### Verify Setup\n\nThrow a test error to verify Sentry is capturing errors correctly:\n\n```javascript\nimport * as Sentry from \"@sentry/aws-serverless\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\nexport const handler = Sentry.wrapHandler(async (event, context) => {\n  throw new Error(\"This is a test error\");\n});\n```\n\nDeploy your function and invoke it. You should see the error appear in your Sentry project dashboard within a few seconds, including CloudWatch data, function details, and execution time measurements.",
  "name": "AWS Serverless",
  "packages": [
    "@sentry/aws-serverless"
  ],
  "rank": 3,
  "slug": "aws-serverless"
};

export default awsServerless;
