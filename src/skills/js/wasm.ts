import type { SentrySkill } from "../../types";

const wasm: SentrySkill = {
  "category": "library",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/browser\";\nimport { wasmIntegration } from \"@sentry/wasm\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    wasmIntegration(),\n  ],\n});\n\n// Example: capturing errors from WebAssembly modules\nfunction testWasmError() {\n  try {\n    // Assuming you already have your WebAssembly module loaded as 'wasmModule'\n    const result = wasmModule.divide(10, 0);\n  } catch (e) {\n    Sentry.captureException(e);\n  }\n}",
      "description": "Capture errors and exceptions from WebAssembly modules with enhanced debug information including Debug IDs, Debug Files, Code IDs, and memory addresses.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/browser and @sentry/wasm packages, then initialize Sentry in your application's entry point before loading your WebAssembly modules. Add the wasmIntegration() to your integrations array to enable enhanced debug information for WebAssembly modules.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/browser\";\nimport { wasmIntegration } from \"@sentry/wasm\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    wasmIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^\\/https:\\/\\/yourserver\\.io\\/api/],\n});\n\n// Example: wrapping WebAssembly function calls in a Sentry span\nfunction testWasmTracing() {\n  Sentry.startSpan(\n    { op: \"test\", name: \"Example Span\" },\n    () => {\n      try {\n        // Assuming you already have your WebAssembly module loaded as 'wasmModule'\n        const result = wasmModule.compute_intensive_function(1000);\n        console.log(\"Result:\", result);\n      } catch (e) {\n        Sentry.captureException(e);\n      }\n    }\n  );\n}",
      "description": "Track performance of WebAssembly module execution using Sentry spans to measure execution time and distributed tracing.",
      "name": "Tracing",
      "setup": "Add browserTracingIntegration() and wasmIntegration() to your Sentry.init() integrations array and set a tracesSampleRate. Wrap your WebAssembly function calls in Sentry.startSpan() to create performance spans.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/browser\";\nimport { wasmIntegration } from \"@sentry/wasm\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    wasmIntegration(),\n  ],\n  enableLogs: true,\n});\n\n// Logs are now automatically sent to Sentry\nconst { logger } = Sentry;\nlogger.info(\"WebAssembly module loaded\");\nlogger.error(\"WebAssembly execution failed\");",
      "description": "Centralize and analyze application logs alongside WebAssembly errors to correlate them with performance issues.",
      "name": "Logs",
      "setup": "Enable logs by setting enableLogs: true in your Sentry.init() configuration. Logs will be automatically captured and can be viewed in the Sentry Logs page, where you can filter by service, environment, or search keywords.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for WebAssembly\n\n### Step 1: Install\n\nInstall the Sentry Browser SDK and the WebAssembly integration package:\n\n```bash\nnpm install @sentry/browser @sentry/wasm --save\n```\n\n### Step 2: Configure\n\nInitialize Sentry in your application's entry point **before** loading your WebAssembly modules:\n\n```javascript\nimport * as Sentry from \"@sentry/browser\";\nimport { wasmIntegration } from \"@sentry/wasm\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  sendDefaultPii: true,\n  integrations: [\n    Sentry.browserTracingIntegration(),\n    wasmIntegration(),\n  ],\n  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing\n  tracesSampleRate: 1.0,\n  tracePropagationTargets: [\"localhost\", /^\\/https:\\/\\/yourserver\\.io\\/api/],\n  // Enable logs to be sent to Sentry\n  enableLogs: true,\n});\n```\n\n### Step 3: Verify Your Setup\n\nAdd a function to your WebAssembly module to test error capture. For example, in Rust:\n\n```rust\n#[no_mangle]\npub extern \"C\" fn divide(a: i32, b: i32) -> i32 {\n    // This will cause a division by zero trap when b is 0\n    a / b\n}\n```\n\nAdd an HTML button and JavaScript function to trigger the error:\n\n```html\n<button type=\"button\" onclick=\"testWasmError()\">Trigger WebAssembly error</button>\n```\n\n```javascript\nfunction testWasmError() {\n  try {\n    // Replace 'wasmModule' with your actual WebAssembly module instance\n    const result = wasmModule.divide(10, 0);\n    // or via WebAssembly API:\n    // const result = wasmModule.instance.exports.divide(10, 0);\n  } catch (e) {\n    Sentry.captureException(e);\n  }\n}\n```\n\nOpen your app in the browser and click the button to trigger a WebAssembly error. Check the **Issues** page in Sentry to see the captured error with enhanced WebAssembly debug information.",
  "name": "WebAssembly (Wasm)",
  "packages": [
    "@sentry/browser",
    "@sentry/wasm"
  ],
  "rank": 1,
  "slug": "wasm"
};

export default wasm;
