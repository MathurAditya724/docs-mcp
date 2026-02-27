import type { SentrySkill } from "../../types";

const reactNative: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/react-native\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\nexport default Sentry.wrap(App);",
      "description": "Automatically capture errors and exceptions in your React Native application.",
      "name": "Error Monitoring",
      "setup": "Initialize the Sentry React Native SDK as early as possible in your app entry point (App.js or App.tsx). Call Sentry.init() with your DSN and wrap your root App component with Sentry.wrap() to enable touch event tracking and automatic instrumentation.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/react-native\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\nexport default Sentry.wrap(App);",
      "description": "Monitor performance and distributed traces across your React Native app and backend services.",
      "name": "Tracing",
      "setup": "Add tracesSampleRate to your Sentry.init() call to enable performance monitoring. Set it to 1.0 to capture 100% of transactions in development; adjust to a lower value in production. Wrap your App component with Sentry.wrap() to enable automatic tracing.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/react-native\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n  profilesSampleRate: 1.0,\n});\n\nexport default Sentry.wrap(App);",
      "description": "Collect and analyze performance profiles from real users in your React Native app.",
      "name": "Profiling",
      "setup": "Add profilesSampleRate to your Sentry.init() call alongside tracesSampleRate. The profilesSampleRate is relative to tracesSampleRate, so setting it to 1.0 will capture profiles for 100% of sampled transactions.",
      "slug": "profiling"
    },
    {
      "code": "import * as Sentry from \"@sentry/react-native\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\nexport default Sentry.wrap(App);",
      "description": "Send structured logs from your React Native app to Sentry for centralized log management.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in your Sentry.init() call. This allows log data from your React Native application to be sent to and viewed in Sentry.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/react-native\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  replaysOnErrorSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  integrations: [Sentry.mobileReplayIntegration()],\n});\n\nexport default Sentry.wrap(App);",
      "description": "Record and replay user sessions to help debug issues in your React Native app.",
      "name": "Session Replay",
      "setup": "Add the mobileReplayIntegration() to your integrations array and configure replaysOnErrorSampleRate and replaysSessionSampleRate in your Sentry.init() call. Set replaysOnErrorSampleRate to 1.0 to capture replays for all errors, and replaysSessionSampleRate to control the percentage of regular sessions recorded.",
      "slug": "session-replay"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry React Native\n\n### 1. Install using Sentry Wizard (Recommended)\n\nRun the Sentry Wizard to automatically configure your project:\n\n```bash\nnpx @sentry/wizard@latest -i reactNative\n```\n\nThe wizard will:\n- Install the `@sentry/react-native` package\n- Configure Metro (`metro.config.js`)\n- Configure Expo (`app.json`) if applicable\n- Set up Android Gradle for source map and debug symbol uploads\n- Set up Xcode build phases for iOS source map uploads\n- Run `pod install`\n- Store build credentials in `ios/sentry.properties`, `android/sentry.properties`, and `env.local`\n- Configure Sentry with your DSN in `App.tsx`\n\n### 2. Configure Sentry\n\nInitialize the SDK in your `App.js` or `App.tsx` as early as possible:\n\n```javascript\nimport * as Sentry from \"@sentry/react-native\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Adds more context data to events (IP address, cookies, user, etc.)\n  sendDefaultPii: true,\n  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.\n  // Adjust this value in production.\n  tracesSampleRate: 1.0,\n  // Enable logs to be sent to Sentry\n  enableLogs: true,\n  // profilesSampleRate is relative to tracesSampleRate.\n  // Here, we'll capture profiles for 100% of transactions.\n  profilesSampleRate: 1.0,\n  // Record session replays for 100% of errors and 10% of sessions\n  replaysOnErrorSampleRate: 1.0,\n  replaysSessionSampleRate: 0.1,\n  integrations: [Sentry.mobileReplayIntegration()],\n});\n\nconst App = () => {\n  return (\n    // your app components\n  );\n};\n\nexport default Sentry.wrap(App);\n```\n\n### 3. Verify Installation\n\nAdd the following snippet to verify Sentry is capturing errors correctly:\n\n```javascript\nthrow new Error(\"My first Sentry error!\");\n```\n\nYou should see the error reported in Sentry within a few minutes.\n",
  "name": "Sentry React Native",
  "packages": [
    "@sentry/react-native"
  ],
  "rank": 8,
  "slug": "react-native"
};

export default reactNative;
