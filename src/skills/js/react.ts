import type { SentrySkill } from "../../types";

const react: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/react\";\nimport { useEffect } from \"react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n});\n\n// React 19+ error handlers\nimport { createRoot } from \"react-dom/client\";\n\nconst container = document.getElementById(\"app\");\nconst root = createRoot(container, {\n  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {\n    console.warn(\"Uncaught error\", error, errorInfo.componentStack);\n  }),\n  onCaughtError: Sentry.reactErrorHandler(),\n  onRecoverableError: Sentry.reactErrorHandler(),\n});\nroot.render(<App />);\n\n// React 18 and below: Use ErrorBoundary\nimport React from \"react\";\n\nfunction App() {\n  return (\n    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>\n      <YourAppContent />\n    </Sentry.ErrorBoundary>\n  );\n}",
      "description": "Automatically capture errors, uncaught exceptions, and unhandled rejections in React applications using error hooks (React 19+) or ErrorBoundary (React 18 and below).",
      "name": "Error Monitoring",
      "setup": "Install @sentry/react and create an instrument.js file with Sentry.init(). Import this file as the first import in your application entry point. For React 19+, pass reactErrorHandler to createRoot's onUncaughtError, onCaughtError, and onRecoverableError callbacks. For React 18 and below, wrap your app with the Sentry.ErrorBoundary component.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/react\";\nimport React from \"react\";\nimport {\n  useLocation,\n  useNavigationType,\n  createRoutesFromChildren,\n  matchRoutes,\n} from \"react-router\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.reactRouterV7BrowserTracingIntegration({\n      useEffect: React.useEffect,\n      useLocation,\n      useNavigationType,\n      createRoutesFromChildren,\n      matchRoutes,\n    }),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [/^\\//, /^https:\\/\\/yourserver\\.io\\/api/],\n});\n\n// Test a traced span\nSentry.startSpan(\n  { op: \"test\", name: \"Example Frontend Span\" },\n  () => {\n    setTimeout(() => {\n      throw new Error(\"Sentry Test Error\");\n    }, 99);\n  }\n);",
      "description": "Track software performance and capture navigation events using browser tracing integration with optional React Router support.",
      "name": "Tracing",
      "setup": "Add browserTracingIntegration (or reactRouterV7BrowserTracingIntegration for React Router) to the integrations array in Sentry.init(). Set tracesSampleRate to control the percentage of transactions captured and configure tracePropagationTargets to specify which URLs should have trace propagation enabled.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.replayIntegration(),\n  ],\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});",
      "description": "Record video-like reproductions of user sessions to see exactly what happened before, during, and after an error.",
      "name": "Session Replay",
      "setup": "Add replayIntegration() to the integrations array in Sentry.init(). Set replaysSessionSampleRate to control the percentage of all sessions recorded and replaysOnErrorSampleRate to control the percentage of sessions with errors that are recorded.",
      "slug": "session-replay"
    },
    {
      "code": "import * as Sentry from \"@sentry/react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\n// Send structured logs from anywhere in your app\nSentry.logger.info(\"User action\", { userId: \"123\" });\nSentry.logger.warn(\"Slow response\", { duration: 5000 });\nSentry.logger.error(\"Operation failed\", { reason: \"timeout\" });",
      "description": "Send structured logs correlated with errors and traces to Sentry for centralized analysis and filtering.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in Sentry.init(). Then use Sentry.logger.info(), Sentry.logger.warn(), and Sentry.logger.error() to send structured log entries from anywhere in your application.",
      "slug": "logs"
    },
    {
      "code": "import * as Sentry from \"@sentry/react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n});",
      "description": "Embed a user feedback widget in your React application so users can report issues directly from the UI.",
      "name": "User Feedback",
      "setup": "Add feedbackIntegration() to the integrations array in Sentry.init(). Configure options such as colorScheme to match your application's appearance. The widget will appear automatically in your app for users to submit feedback.",
      "slug": "user-feedback"
    }
  ],
  "gettingStarted": "# Getting Started with Sentry for React\n\n## 1. Install the SDK\n\n```bash\nnpm install @sentry/react --save\n```\n\n## 2. Create instrument.js\n\nCreate a file called `instrument.js` in your project's root directory:\n\n```javascript\n// instrument.js\nimport * as Sentry from \"@sentry/react\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    Sentry.replayIntegration(),\n    Sentry.feedbackIntegration({\n      colorScheme: \"system\",\n    }),\n  ],\n  // Enable logs\n  enableLogs: true,\n  // Tracing\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [/\\//, /^https:\\/\\/yourserver\\.io\\/api/],\n  // Session Replay\n  replaysSessionSampleRate: 0.1,\n  replaysOnErrorSampleRate: 1.0,\n});\n```\n\n## 3. Import Sentry First in Your Entry Point\n\n### React 19+\n\n```javascript\n// main.jsx\n// Sentry initialization should be imported first!\nimport \"./instrument\";\nimport App from \"./App\";\nimport { createRoot } from \"react-dom/client\";\nimport * as Sentry from \"@sentry/react\";\n\nconst container = document.getElementById(\"app\");\nconst root = createRoot(container, {\n  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {\n    console.warn(\"Uncaught error\", error, errorInfo.componentStack);\n  }),\n  onCaughtError: Sentry.reactErrorHandler(),\n  onRecoverableError: Sentry.reactErrorHandler(),\n});\nroot.render(<App />);\n```\n\n### React 18 and Below\n\n```javascript\n// main.jsx\nimport \"./instrument\";\nimport App from \"./App\";\nimport { createRoot } from \"react-dom/client\";\n\nconst container = document.getElementById(\"app\");\nconst root = createRoot(container);\nroot.render(<App />);\n```\n\nAdd an `ErrorBoundary` in your app:\n\n```javascript\n// App.jsx\nimport React from \"react\";\nimport * as Sentry from \"@sentry/react\";\n\nfunction App() {\n  return (\n    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>\n      <YourAppContent />\n    </Sentry.ErrorBoundary>\n  );\n}\n\nexport default App;\n```\n\n## 4. (Optional) Set Up Source Maps\n\nRun the Sentry wizard to configure source map uploads for your bundler:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n\n## 5. Verify Your Setup\n\nAdd a test button to trigger an error:\n\n```jsx\n<button\n  type=\"button\"\n  onClick={() => {\n    throw new Error(\"Sentry Test Error\");\n  }}\n>\n  Break the world\n</button>\n```\n\nCheck Sentry to confirm the error appears with a stack trace.\n",
  "name": "React",
  "packages": [
    "@sentry/react"
  ],
  "rank": 8,
  "slug": "react"
};

export default react;
