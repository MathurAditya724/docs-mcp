import type { SentrySkill } from "../../types";

const ember: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import Application from \"@ember/application\";\nimport Resolver from \"ember-resolver\";\nimport loadInitializers from \"ember-load-initializers\";\nimport config from \"./config/environment\";\nimport * as Sentry from \"@sentry/ember\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nexport default class App extends Application {\n  modulePrefix = config.modulePrefix;\n  podModulePrefix = config.podModulePrefix;\n  Resolver = Resolver;\n}",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in your Ember application.",
      "name": "Error Monitoring",
      "setup": "Install the Sentry Ember SDK using `ember install @sentry/ember`, then initialize Sentry in your `app/app.js` file before your Application class definition. Sentry will automatically capture errors across your Ember application.",
      "slug": "error-monitoring"
    },
    {
      "code": "import Application from \"@ember/application\";\nimport Resolver from \"ember-resolver\";\nimport loadInitializers from \"ember-load-initializers\";\nimport config from \"./config/environment\";\nimport * as Sentry from \"@sentry/ember\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\nexport default class App extends Application {\n  modulePrefix = config.modulePrefix;\n  podModulePrefix = config.podModulePrefix;\n  Resolver = Resolver;\n}\n\n// Example usage in a controller\nimport Controller from \"@ember/controller\";\nimport { action } from \"@ember/object\";\nimport * as Sentry from \"@sentry/ember\";\n\nexport default class ApplicationController extends Controller {\n  @action\n  exampleAction() {\n    Sentry.startSpan({ op: \"test\", name: \"Example Span\" }, () => {\n      // your code here\n    });\n  }\n}",
      "description": "Track software performance and measure the time spent across operations using distributed tracing.",
      "name": "Tracing",
      "setup": "Add `tracesSampleRate` to your `Sentry.init()` call in `app/app.js` to enable tracing. Set the value between 0.0 and 1.0 to control the percentage of transactions captured. Use `Sentry.startSpan()` to manually instrument code blocks.",
      "slug": "tracing"
    },
    {
      "code": "import Application from \"@ember/application\";\nimport Resolver from \"ember-resolver\";\nimport loadInitializers from \"ember-load-initializers\";\nimport config from \"./config/environment\";\nimport * as Sentry from \"@sentry/ember\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n\nexport default class App extends Application {\n  modulePrefix = config.modulePrefix;\n  podModulePrefix = config.podModulePrefix;\n  Resolver = Resolver;\n}",
      "description": "Record video-like reproductions of user sessions to help debug issues in your Ember application.",
      "name": "Session Replay",
      "setup": "Add `replayIntegration()` to the `integrations` array in your `Sentry.init()` call, and configure `replaysSessionSampleRate` and `replaysOnErrorSampleRate` to control how many sessions are recorded. A rate of 0.1 captures 10% of all sessions, while 1.0 captures 100% of sessions with errors.",
      "slug": "session-replay"
    },
    {
      "code": "import Application from \"@ember/application\";\nimport Resolver from \"ember-resolver\";\nimport loadInitializers from \"ember-load-initializers\";\nimport config from \"./config/environment\";\nimport * as Sentry from \"@sentry/ember\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\nexport default class App extends Application {\n  modulePrefix = config.modulePrefix;\n  podModulePrefix = config.podModulePrefix;\n  Resolver = Resolver;\n}",
      "description": "Send and centralize application logs in Sentry to correlate them with errors and performance issues.",
      "name": "Logs",
      "setup": "Add `enableLogs: true` to your `Sentry.init()` call in `app/app.js` to enable log collection. Once enabled, logs from your Ember application will be forwarded to Sentry where you can search, filter, and visualize them.",
      "slug": "logs"
    },
    {
      "code": "import Application from \"@ember/application\";\nimport Resolver from \"ember-resolver\";\nimport loadInitializers from \"ember-load-initializers\";\nimport config from \"./config/environment\";\nimport * as Sentry from \"@sentry/ember\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});\n\nexport default class App extends Application {\n  modulePrefix = config.modulePrefix;\n  podModulePrefix = config.podModulePrefix;\n  Resolver = Resolver;\n}",
      "description": "Embed a user feedback widget in your Ember application to collect feedback directly from users.",
      "name": "User Feedback",
      "setup": "Add `feedbackIntegration()` to the `integrations` array in your `Sentry.init()` call in `app/app.js`. Configure options such as `colorScheme` to customize the widget's appearance. The widget will appear automatically in your application.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Ember.js\n\n### Step 1: Install\n\nInstall the Sentry Ember SDK using the ember-cli command:\n\n```bash\nember install @sentry/ember\n```\n\n### Step 2: Configure\n\nInitialize Sentry as early as possible in your application's lifecycle by adding the following to your `app/app.js` file:\n\n```javascript\n// app/app.js\nimport Application from \"@ember/application\";\nimport Resolver from \"ember-resolver\";\nimport loadInitializers from \"ember-load-initializers\";\nimport config from \"./config/environment\";\nimport * as Sentry from \"@sentry/ember\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n\n  // Enable tracing\n  tracesSampleRate: 1.0,\n\n  // Enable Session Replay\n  integrations: [\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n\n  // Enable logs\n  enableLogs: true,\n});\n\nexport default class App extends Application {\n  modulePrefix = config.modulePrefix;\n  podModulePrefix = config.podModulePrefix;\n  Resolver = Resolver;\n}\n```\n\n### Step 3: Add Source Maps (Optional)\n\nUpload your source maps to Sentry for readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n### Step 4: Verify Your Setup\n\nAdd a test button to one of your Handlebars templates:\n\n```handlebars\n{{! app/templates/application.hbs }}\n<button type=\"button\" {{on \"click\" this.throwTestError}}>Test Sentry Error</button>\n```\n\nAdd the corresponding action to your controller:\n\n```javascript\n// app/controllers/application.js\nimport Controller from \"@ember/controller\";\nimport { action } from \"@ember/object\";\n\nexport default class ApplicationController extends Controller {\n  @action\n  throwTestError() {\n    throw new Error(\"Sentry Test Error\");\n  }\n}\n```\n\nOpen the page in your browser and click the button. Visit your Sentry project to confirm the error was captured.",
  "name": "Ember.js",
  "packages": [
    "@sentry/ember"
  ],
  "rank": 5,
  "slug": "ember"
};

export default ember;
