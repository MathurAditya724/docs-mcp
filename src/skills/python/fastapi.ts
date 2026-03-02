import type { SentrySkill } from "../../types";

const fastapi: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n)\n\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/sentry-debug")\nasync def trigger_error():\n    division_by_zero = 1 / 0',
      description:
        "Automatically capture errors and exceptions from FastAPI route handlers and report them to Sentry.",
      name: "Error Monitoring",
      setup:
        "Install sentry-sdk with pip. The FastAPI integration is enabled automatically when you initialize the Sentry SDK if fastapi is in your dependencies. Call sentry_sdk.init() before creating your FastAPI app. By default all 5xx status codes are reported. Request data including URL, HTTP method, headers, and JSON payloads is attached to all events. Set send_default_pii=True to include user information.",
      slug: "error-monitoring",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\nasync def homepage():\n    return {"message": "Hello, World!"}',
      description:
        "Monitor performance of FastAPI middleware, database queries, and Redis commands with automatic transaction creation.",
      name: "Tracing",
      setup:
        "Set traces_sample_rate in your sentry_sdk.init() call to enable performance monitoring. The integration automatically monitors the middleware stack, middleware send/receive callbacks, database queries, and Redis commands. Each FastAPI request creates a transaction in Sentry.",
      slug: "tracing",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n)',
      description:
        "Collect code-level profiling data for FastAPI requests to identify performance bottlenecks.",
      name: "Profiling",
      setup:
        "Set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call along with traces_sample_rate. Profiles are automatically collected while there is an active span during FastAPI request handling.",
      slug: "profiling",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\nimport logging\nlogger = logging.getLogger(__name__)\n\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\nasync def homepage():\n    logger.info("Homepage accessed")\n    return {"message": "Hello, World!"}',
      description:
        "Send structured logs from Python's logging module to Sentry as log events.",
      name: "Logs",
      setup:
        "Set enable_logs=True in your sentry_sdk.init() call. The Logging integration is enabled by default and will record log messages as both breadcrumbs and log events in Sentry.",
      slug: "logs",
    },
    {
      code: 'import sentry_sdk\nfrom sentry_sdk.crons import monitor\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n)\n\n@monitor(monitor_slug="my-scheduled-task")\ndef run_scheduled_task():\n    # Your periodic task logic here\n    pass',
      description:
        "Monitor periodic and scheduled tasks to detect missed, late, or failed executions.",
      name: "Crons",
      setup:
        "Use the @monitor decorator from sentry_sdk.crons to wrap your scheduled task functions. Sentry will notify you if a task is missed, exceeds its maximum runtime, or fails. You can also use monitor as a context manager or send manual check-ins with capture_checkin.",
      slug: "crons",
    },
  ],
  gettingStarted:
    '## FastAPI SDK Setup\n\n### 1. Install the SDK\n\n```bash\npip install sentry-sdk\n```\n\n### 2. Initialize the SDK\n\nAdd the following before creating your FastAPI app:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle="trace",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\nThe FastAPI integration is enabled automatically when the SDK detects `fastapi` in your dependencies.\n\n### 3. Create your FastAPI app\n\n```python\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\nasync def homepage():\n    return {"message": "Hello, World!"}\n```\n\n### 4. Verify the setup\n\nAdd an intentional error to test:\n\n```python\n@app.get("/sentry-debug")\nasync def trigger_error():\n    division_by_zero = 1 / 0\n```\n\nVisit `http://localhost:8000/sentry-debug` in your browser. An error event and a transaction will appear in Sentry.\n\n### 5. Optional: Configure FastApiIntegration explicitly\n\nBecause FastAPI is built on Starlette, both integrations must be instantiated:\n\n```python\nfrom sentry_sdk.integrations.starlette import StarletteIntegration\nfrom sentry_sdk.integrations.fastapi import FastApiIntegration\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        StarletteIntegration(\n            transaction_style="endpoint",\n            failed_request_status_codes={403, *range(500, 599)},\n        ),\n        FastApiIntegration(\n            transaction_style="endpoint",\n            failed_request_status_codes={403, *range(500, 599)},\n        ),\n    ],\n)\n```\n\nOptions: `transaction_style` ("url" or "endpoint"), `failed_request_status_codes` (set of HTTP status codes to report), `middleware_spans` (True/False), `http_methods_to_capture` (tuple of HTTP methods).',
  name: "FastAPI",
  packages: ["sentry-sdk"],
  rank: 8,
  slug: "fastapi",
};

export default fastapi;
