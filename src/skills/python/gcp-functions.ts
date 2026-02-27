import type { SentrySkill } from "../../types";

const gcpFunctions: SentrySkill = {
  "category": "library",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.gcp import GcpIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    integrations=[\n        GcpIntegration(),\n    ],\n)\n\ndef http_function_entrypoint(request):\n    # Your function logic here\n    pass",
      "description": "Automatically report all errors and exceptions from Google Cloud Functions to Sentry.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk>=0.17.1 and add the GcpIntegration to your sentry_sdk.init() call. The integration automatically captures errors and attaches function details, stackdriver log links, execution time, and request data to each event.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.gcp import GcpIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        GcpIntegration(),\n    ],\n)\n\ndef http_function_entrypoint(request):\n    # Your function logic here\n    pass",
      "description": "Monitor performance and trace interactions between multiple services or applications in Google Cloud Functions.",
      "name": "Tracing",
      "setup": "Enable tracing by setting traces_sample_rate in your sentry_sdk.init() call alongside the GcpIntegration. Set traces_sample_rate to a value between 0.0 and 1.0 to control what percentage of transactions are captured.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.gcp import GcpIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n    integrations=[\n        GcpIntegration(),\n    ],\n)\n\ndef http_function_entrypoint(request):\n    # Your function logic here\n    pass",
      "description": "Collect and analyze performance profiles from Google Cloud Functions executions.",
      "name": "Profiling",
      "setup": "Enable profiling by setting profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call alongside the GcpIntegration. Profiling requires tracing to be enabled as profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Google Cloud Functions\n\n### 1. Install the SDK\n\nAdd the Sentry SDK to your `requirements.txt`:\n\n```text\nsentry-sdk>=0.17.1\n```\n\n> **Note:** The GCP integration currently supports only the Python 3.7 runtime environment. Limited Sentry support is available on newer Python runtimes by directly enabling integrations for supported frameworks and/or using the generic serverless integration.\n\n### 2. Configure Sentry\n\nInitialize Sentry in your Cloud Function file:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.gcp import GcpIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n    integrations=[\n        GcpIntegration(),\n    ],\n)\n\ndef http_function_entrypoint(request):\n    # Your function logic here\n    pass\n```\n\n### 3. Enable Timeout Warnings (Optional)\n\nTo receive warnings when your function is near its configured timeout:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.gcp import GcpIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    integrations=[\n        GcpIntegration(timeout_warning=True),\n    ],\n)\n```\n\n> The timeout warning is sent only if the timeout in the Cloud Function configuration is set to a value greater than one second.\n\n### 4. Verify\n\nAdd this intentional error to test that everything is working:\n\n```python\ndef http_function_entrypoint(request):\n    division_by_zero = 1 / 0\n```\n\nDeploy your function and invoke it. The error should appear in your Sentry project.\n\n### What's Captured Automatically\n\nWith the GCP integration enabled, Sentry will:\n- Automatically report all events from your Cloud Functions\n- Attach a link to Stackdriver logs\n- Include function details, `sys.argv`, execution time (ms), and configured timeout (s)\n- Attach request data: HTTP method, URL, headers, form data, and JSON payloads",
  "name": "Google Cloud Functions",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 1,
  "slug": "gcp-functions"
};

export default gcpFunctions;
