import type { SentrySkill } from "../../types";

const cloudflare: SentrySkill = {
  "category": "runtime",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/cloudflare\";\n\nexport default Sentry.withSentry(\n  (env: Env) => ({\n    dsn: \"___PUBLIC_DSN___\",\n    sendDefaultPii: true,\n  }),\n  {\n    async fetch(request, env, ctx) {\n      const url = new URL(request.url);\n      if (url.pathname === \"/debug-sentry\") {\n        throw new Error(\"My first Sentry error!\");\n      }\n      return new Response(\"Hello World!\");\n    },\n  },\n);",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in Cloudflare Workers and Pages.",
      "name": "Error Monitoring",
      "setup": "Install the @sentry/cloudflare package, add the nodejs_compat compatibility flag in your wrangler.jsonc, then wrap your worker handler with Sentry.withSentry() (Workers) or add sentryPagesPlugin as middleware (Pages).",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/cloudflare\";\n\nexport default Sentry.withSentry(\n  (env: Env) => ({\n    dsn: \"___PUBLIC_DSN___\",\n    sendDefaultPii: true,\n    tracesSampleRate: 1.0,\n  }),\n  {\n    async fetch(request, env, ctx) {\n      const url = new URL(request.url);\n      if (url.pathname === \"/debug-sentry\") {\n        await Sentry.startSpan(\n          {\n            op: \"test\",\n            name: \"My First Test Transaction\",\n          },\n          async () => {\n            await new Promise((resolve) => setTimeout(resolve, 100));\n            throw new Error(\"My first Sentry error!\");\n          },\n        );\n      }\n      return new Response(\"Hello World!\");\n    },\n  },\n);",
      "description": "Track software performance and measure span durations across your Cloudflare Workers and Pages with distributed tracing.",
      "name": "Tracing",
      "setup": "Add tracesSampleRate to your Sentry configuration inside withSentry() or sentryPagesPlugin(), then use Sentry.startSpan() to manually instrument code. Note that CPU-bound spans will show 0ms duration due to Cloudflare Workers runtime limitations.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/cloudflare\";\n\nexport default Sentry.withSentry(\n  (env: Env) => ({\n    dsn: \"___PUBLIC_DSN___\",\n    sendDefaultPii: true,\n    enableLogs: true,\n  }),\n  {\n    async fetch(request, env, ctx) {\n      const { logger } = Sentry;\n      logger.info(\"Worker received request\", { url: request.url });\n      return new Response(\"Hello World!\");\n    },\n  },\n);",
      "description": "Centralize and analyze application logs from Cloudflare Workers and Pages, correlated with errors and performance issues.",
      "name": "Logs",
      "setup": "Add enableLogs: true to your Sentry configuration inside withSentry() or sentryPagesPlugin() to enable log forwarding to Sentry.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Cloudflare Workers & Pages Setup\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/cloudflare --save\n```\n\n### Step 2: Configure Wrangler\n\nAdd the `nodejs_compat` compatibility flag in your `wrangler.jsonc`:\n\n```json\n// wrangler.jsonc\n{\n  \"compatibility_flags\": [\"nodejs_compat\"]\n}\n```\n\n### Step 3: Initialize Sentry\n\n#### For Cloudflare Workers\n\nWrap your worker handler with `withSentry` in your `index.ts`:\n\n```typescript\n// index.ts\nimport * as Sentry from \"@sentry/cloudflare\";\n\nexport default Sentry.withSentry(\n  (env: Env) => ({\n    dsn: \"___PUBLIC_DSN___\",\n    sendDefaultPii: true,\n    enableLogs: true,\n    tracesSampleRate: 1.0,\n  }),\n  {\n    async fetch(request, env, ctx) {\n      // Your worker logic here\n      return new Response(\"Hello World!\");\n    },\n  },\n);\n```\n\n#### For Cloudflare Pages\n\nCreate a `functions/_middleware.js` file:\n\n```javascript\n// functions/_middleware.js\nimport * as Sentry from \"@sentry/cloudflare\";\n\nexport const onRequest = [\n  // Make sure Sentry is the first middleware\n  Sentry.sentryPagesPlugin((context) => ({\n    dsn: \"___PUBLIC_DSN___\",\n    sendDefaultPii: true,\n    enableLogs: true,\n    tracesSampleRate: 1.0,\n  })),\n  // Add more middlewares here\n];\n```\n\n### Step 4: Add Source Maps (Optional)\n\nEnable source map uploading in `wrangler.jsonc`:\n\n```json\n// wrangler.jsonc\n{\n  \"upload_source_maps\": true\n}\n```\n\nThen run the Sentry Wizard:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n### Step 5: Verify Your Setup\n\nAdd a debug route to your worker to test error capturing:\n\n```javascript\n// index.js\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    if (url.pathname === \"/debug-sentry\") {\n      throw new Error(\"My first Sentry error!\");\n    }\n    return new Response(\"...\");\n  },\n};\n```\n\nVisit `/debug-sentry` and check your Sentry project's Issues page to confirm the error was captured.\n\n> **Known Limitation:** Server-side spans will display 0ms durations for CPU-bound operations. This is expected behavior in the Cloudflare Workers environment due to Cloudflare's security measures against timing attacks.",
  "name": "Cloudflare",
  "packages": [
    "@sentry/cloudflare"
  ],
  "rank": 3,
  "slug": "cloudflare"
};

export default cloudflare;
