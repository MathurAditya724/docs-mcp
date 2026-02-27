import type { SentrySkill } from "../../types";

const angular: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    Sentry.replayIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Angular application.",
      "name": "Error Monitoring",
      "setup": "Install the Sentry Angular SDK using the wizard with `npx @sentry/wizard@latest -i angular`. The wizard adds a Sentry.init() call in your main.ts, registers the Sentry ErrorHandler and TraceService in your app.config.ts, and configures source maps upload. You can also set up error monitoring manually by calling Sentry.init() at the top of your main.ts file before bootstrapping your application.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^https:\\/\\/yourserver\\.io\\/api/],\n});\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);",
      "description": "Track software performance and follow requests across frontend and backend with distributed tracing.",
      "name": "Tracing",
      "setup": "Enable tracing by adding the browserTracingIntegration() to the integrations array in your Sentry.init() call and setting a tracesSampleRate. The Sentry wizard automatically registers the TraceService in your app.config.ts to enable Angular router instrumentation. Set tracePropagationTargets to control which outgoing requests receive tracing headers.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.replayIntegration({\n      maskAllText: true,\n      blockAllMedia: true,\n    }),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);",
      "description": "Record video-like reproductions of user browser sessions to help diagnose and debug issues.",
      "name": "Session Replay",
      "setup": "Enable Session Replay by adding the replayIntegration() to the integrations array in your Sentry.init() call. Set replaysSessionSampleRate to control the percentage of all sessions recorded, and replaysOnErrorSampleRate to control the percentage of sessions recorded when an error occurs. You can view replays in the Sentry Replays page.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profilesSampleRate: 1.0,\n});\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);",
      "description": "Profile your Angular application's code execution to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Enable profiling by adding the browserProfilingIntegration() to the integrations array in your Sentry.init() call along with setting a profilesSampleRate. Profiling requires tracing to be enabled, so ensure you also include browserTracingIntegration() and set a tracesSampleRate.",
      "slug": "profiling"
    },
    {
      "code": "import * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserLoggingIntegration(),\n  ],\n});\n\n// Use Sentry logger to emit structured logs\nconst logger = Sentry.logger;\nlogger.info(\"User navigated to page\", { page: \"/home\" });\nlogger.error(\"Failed to load data\", { component: \"AppComponent\" });\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);",
      "description": "Centralize and correlate application logs with errors and performance issues in Sentry.",
      "name": "Logs",
      "setup": "Enable structured logging by adding the browserLoggingIntegration() to the integrations array in your Sentry.init() call. Use the Sentry logger API to emit structured log entries that can be searched and filtered in the Sentry Logs page alongside your errors and traces.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);",
      "description": "Collect user feedback directly from your Angular application when errors occur.",
      "name": "User Feedback",
      "setup": "Enable the User Feedback widget by adding the feedbackIntegration() to the integrations array in your Sentry.init() call. This adds a feedback button to your app that allows users to report issues. You can customize the widget appearance and behavior through the integration options.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "# Getting Started with Sentry for Angular\n\n## Prerequisites\n\n- A Sentry account and project\n- Angular version 14.0.0 or above (wizard requires Angular 17+)\n\n## Step 1: Install\n\nRun the Sentry wizard to automatically set up the SDK:\n\n```bash\nnpx @sentry/wizard@latest -i angular\n```\n\nThe wizard will:\n- Add a `Sentry.init()` call to your `main.ts` file\n- Register the Sentry `ErrorHandler` and `TraceService` in your `app.config.ts`\n- Create `.sentryclirc` with an auth token for source maps upload\n- Configure source maps upload for production builds\n- Add an example component to verify your setup\n\nAlternatively, install the package manually:\n\n```bash\nnpm install @sentry/angular\n```\n\n## Step 2: Initialize Sentry\n\nUpdate your `main.ts` to initialize Sentry before bootstrapping your app:\n\n```typescript\nimport * as Sentry from \"@sentry/angular\";\nimport { bootstrapApplication } from \"@angular/platform-browser\";\nimport { AppComponent } from \"./app/app.component\";\nimport { appConfig } from \"./app/app.config\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    Sentry.replayIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^https:\\/\\/yourserver\\.io\\/api/],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nbootstrapApplication(AppComponent, appConfig).catch((err) =>\n  console.error(err)\n);\n```\n\n## Step 3: Register ErrorHandler and TraceService\n\nUpdate your `app.config.ts` to register Sentry's Angular-specific providers:\n\n```typescript\nimport { ApplicationConfig, ErrorHandler } from \"@angular/core\";\nimport { provideRouter, Router } from \"@angular/router\";\nimport * as Sentry from \"@sentry/angular\";\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    {\n      provide: ErrorHandler,\n      useValue: Sentry.createErrorHandler(),\n    },\n    {\n      provide: Sentry.TraceService,\n      deps: [Router],\n    },\n  ],\n};\n```\n\n## Step 4: Verify Your Setup\n\nTrigger a test error to confirm Sentry is working:\n\n```typescript\nimport { Component } from \"@angular/core\";\n\n@Component({\n  selector: 'app-test',\n  template: `<button (click)=\"throwError()\">Throw Test Error</button>`,\n})\nexport class TestComponent {\n  throwError() {\n    throw new Error(\"Sentry Test Error\");\n  }\n}\n```\n\nAfter clicking the button, check your Sentry project's Issues page to confirm the error was captured.\n\n## Optional: Avoid Ad Blockers with Tunneling\n\n```typescript\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tunnel: \"/tunnel\",\n});\n```\n",
  "name": "Angular",
  "packages": [
    "@sentry/angular"
  ],
  "rank": 8,
  "slug": "angular"
};

export default angular;
