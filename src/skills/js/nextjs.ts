import type { SentrySkill } from "../../types";

const nextjs: SentrySkill = {
  category: "framework",
  ecosystem: "javascript",
  features: [
    {
      code: `// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
});

// Errors are captured automatically. To manually capture:
Sentry.captureException(new Error("Something went wrong"));
Sentry.captureMessage("Something happened");

// Add a global error boundary in app/global-error.tsx:
// "use client";
// import * as Sentry from "@sentry/nextjs";
// import NextError from "next/error";
// import { useEffect } from "react";
//
// export default function GlobalError({ error }) {
//   useEffect(() => { Sentry.captureException(error); }, [error]);
//   return (<html><body><NextError statusCode={0} /></body></html>);
// }`,
      description:
        "Automatically captures unhandled exceptions, React rendering errors, and server-side errors across all Next.js runtimes.",
      name: "Error Monitoring",
      setup:
        "Error monitoring is enabled by default when you call Sentry.init() in your instrumentation files. Create app/global-error.tsx to capture React rendering errors. The onRequestError handler in instrumentation.ts captures server-side errors.",
      slug: "error-monitoring",
    },
    {
      code: `// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  // Set to 1.0 for development, lower in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});

// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});`,
      description:
        "Track page loads, navigations, and API route performance with distributed tracing across client and server.",
      name: "Tracing",
      setup:
        "Enable tracing by setting tracesSampleRate in both instrumentation-client.ts and sentry.server.config.ts. Next.js page loads, navigations, and API routes are automatically instrumented.",
      slug: "tracing",
    },
    {
      code: `// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  // Capture 10% of all sessions for replay
  replaysSessionSampleRate: 0.1,
  // Capture 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      // Privacy options:
      maskAllText: true,    // Replace text with asterisks
      blockAllMedia: true,  // Block images/videos
      maskAllInputs: true,  // Mask form inputs
    }),
  ],
});

// Recommended sampling rates by traffic level:
// High traffic (100k+/day): replaysSessionSampleRate: 0.01, replaysOnErrorSampleRate: 1.0
// Medium traffic (10k-100k/day): replaysSessionSampleRate: 0.1, replaysOnErrorSampleRate: 1.0
// Low traffic (<10k/day): replaysSessionSampleRate: 0.25, replaysOnErrorSampleRate: 1.0`,
      description:
        "Record user sessions to visualize errors in context. See exactly what the user did before, during, and after an error.",
      name: "Session Replay",
      setup:
        "Add replayIntegration() to the integrations array in instrumentation-client.ts (client-side only). Configure replaysSessionSampleRate and replaysOnErrorSampleRate. Session Replay only works in the browser, not on the server.",
      slug: "session-replay",
    },
    {
      code: `// instrumentation-client.ts - for browser profiling
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [Sentry.browserProfilingIntegration()],
});

// sentry.server.config.ts - for server profiling
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
});`,
      description:
        "Identify slow or resource-intensive functions on both client and server.",
      name: "Profiling",
      setup:
        "For browser profiling, add browserProfilingIntegration() to instrumentation-client.ts and set profilesSampleRate. For server profiling, set profileSessionSampleRate in sentry.server.config.ts. Both require tracing to be enabled.",
      slug: "profiling",
    },
    {
      code: `// Using Sentry.cron.instrumentCron with the "cron" library:
import * as Sentry from "@sentry/nextjs";
import { CronJob } from "cron";

const CronJobWithCheckIn = Sentry.cron.instrumentCron(CronJob, "my-cron-job");
const job = new CronJobWithCheckIn("* * * * *", () => {
  console.log("Task runs every minute");
});

// Using withMonitor for manual monitoring:
Sentry.withMonitor("my-monitor-slug", () => {
  // Your scheduled task logic here
});

// Using check-ins for granular control:
const checkInId = Sentry.captureCheckIn({
  monitorSlug: "my-monitor-slug",
  status: "in_progress",
});

// ... execute your task ...

Sentry.captureCheckIn({
  checkInId,
  monitorSlug: "my-monitor-slug",
  status: "ok", // or "error"
});

// Vercel Cron Jobs: set automaticVercelMonitors in next.config.ts
// (currently only works with Pages Router)`,
      description:
        "Monitor cron jobs and scheduled tasks. Get alerts when jobs fail, run too long, or don't run at all.",
      name: "Cron Monitoring",
      setup:
        "Cron monitoring is only supported in Server and Edge runtimes for Next.js. Use Sentry.cron.instrumentCron() to wrap cron libraries, Sentry.withMonitor() for manual monitoring, or captureCheckIn() for granular control. For Vercel Cron Jobs, set automaticVercelMonitors: true in next.config.ts (Pages Router only).",
      slug: "crons",
    },
    {
      code: `// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  integrations: [
    Sentry.feedbackIntegration({
      // Placement and appearance:
      colorScheme: "system", // "system" | "light" | "dark"
      // Screenshot support (enabled by default on desktop, disabled on mobile):
      enableScreenshot: true,
    }),
  ],
});

// The feedback widget appears as a button in the bottom-right corner by default.
// When paired with Session Replay (replaysOnErrorSampleRate > 0),
// it buffers up to 30 seconds of session data when users open the feedback widget.`,
      description:
        "Collect user feedback with an embedded widget. Users can report issues with optional screenshots.",
      name: "User Feedback",
      setup:
        "Add feedbackIntegration() to the integrations array in instrumentation-client.ts (client-side only). The widget appears in the bottom-right corner by default. Requires browser support for Shadow DOM and Dialog elements. Requires SDK v7.85.0+.",
      slug: "user-feedback",
    },
    {
      code: `// instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  enableLogs: true,
});

// Use structured logging anywhere in your client or server code:
Sentry.logger.info("User action completed", { userId: "123", action: "purchase" });
Sentry.logger.warn("Slow API response", { endpoint: "/api/data", duration: 5000 });
Sentry.logger.error("Payment failed", { orderId: "abc", reason: "insufficient_funds" });
Sentry.logger.debug("Cache state", { hits: 42, misses: 3 });`,
      description:
        "Centralize and analyze your application logs. Correlate them with errors and performance issues.",
      name: "Logs",
      setup:
        "Enable logs by setting enableLogs: true in your Sentry.init() call (both client and server configs). Use Sentry.logger.info(), .warn(), .error(), and .debug() to send structured logs.",
      slug: "logs",
    },
  ],
  gettingStarted: `Install the Sentry Next.js SDK using the wizard (recommended):

\`\`\`bash
npx @sentry/wizard@latest -i nextjs
\`\`\`

The wizard automatically creates all necessary configuration files. If you prefer manual setup, install the package:

\`\`\`bash
npm install @sentry/nextjs
\`\`\`

Then create the following files:

**1. instrumentation-client.ts** (browser environment):

\`\`\`typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});
\`\`\`

**2. sentry.server.config.ts** (Node.js server environment):

\`\`\`typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
\`\`\`

**3. sentry.edge.config.ts** (edge runtime):

\`\`\`typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
\`\`\`

**4. instrumentation.ts** (registers server and edge configs):

\`\`\`typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
\`\`\`

**5. next.config.ts** (wrap with withSentryConfig):

\`\`\`typescript
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // your existing config
};

export default withSentryConfig(nextConfig, {
  org: "___ORG_SLUG___",
  project: "___PROJECT_SLUG___",
  // Auth token for source map uploads
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
\`\`\`

**6. app/global-error.tsx** (catch React rendering errors):

\`\`\`tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
\`\`\`

**7. Environment variables:**

Create \`.env.sentry-build-plugin\`:
\`\`\`
SENTRY_AUTH_TOKEN=your-auth-token
\`\`\`

Or set \`SENTRY_AUTH_TOKEN\` in your CI environment for source map uploads.`,
  name: "Next.js",
  packages: ["@sentry/nextjs"],
  rank: 10,
  slug: "nextjs",
};

export default nextjs;
