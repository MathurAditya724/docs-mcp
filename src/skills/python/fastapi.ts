import type { SentrySkill } from "../../types";

const fastapi: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\nfrom fastapi import FastAPI\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\napp = FastAPI()\n\n@app.get(\"/sentry-debug\")\nasync def trigger_error():\n    division_by_zero = 1 / 0",
      "description": "Automatically captures and reports unhandled exceptions and HTTP errors from FastAPI applications to Sentry.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Call `sentry_sdk.init()` with your DSN before creating your FastAPI app instance. The FastAPI integration is enabled automatically when the fastapi package is detected. By default, all exceptions leading to an Internal Server Error (5xx) are captured, and request data such as URL, HTTP method, headers, and JSON payloads is attached to all issues.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.starlette import StarletteIntegration\nfrom sentry_sdk.integrations.fastapi import FastApiIntegration\nfrom fastapi import FastAPI\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        StarletteIntegration(\n            transaction_style=\"url\",\n            failed_request_status_codes={403, *range(500, 599)},\n            http_methods_to_capture=(\"GET\", \"POST\", \"PUT\", \"DELETE\", \"PATCH\"),\n        ),\n        FastApiIntegration(\n            transaction_style=\"url\",\n            failed_request_status_codes={403, *range(500, 599)},\n            http_methods_to_capture=(\"GET\", \"POST\", \"PUT\", \"DELETE\", \"PATCH\"),\n        ),\n    ],\n)\n\napp = FastAPI()\n\n@app.get(\"/catalog/product/{product_id}\")\nasync def product_detail(product_id: str):\n    return {\"product_id\": product_id}",
      "description": "Monitors performance of FastAPI requests, middleware, database queries, and Redis commands by creating transactions and spans.",
      "name": "Tracing",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Set `traces_sample_rate` in your `sentry_sdk.init()` call to enable performance monitoring. The integration automatically traces the middleware stack, middleware send/receive callbacks, database queries, and Redis commands. You can configure transaction naming style (url or endpoint), which HTTP methods to capture, and which status codes trigger error reporting by explicitly passing `StarletteIntegration` and `FastApiIntegration` to the `integrations` list.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\nfrom fastapi import FastAPI\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)\n\napp = FastAPI()\n\n@app.get(\"/\")\nasync def root():\n    return {\"message\": \"Hello World\"}",
      "description": "Collects code-level profiling data for FastAPI request handlers to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Set `traces_sample_rate` to enable tracing, then set `profile_session_sample_rate` to control the fraction of sessions to profile, and set `profile_lifecycle` to `\"trace\"` so profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\nfrom fastapi import FastAPI\nfrom sentry_sdk.integrations.logging import LoggingIntegration\nimport logging\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\napp = FastAPI()\n\nlogger = logging.getLogger(__name__)\n\n@app.get(\"/\")\nasync def root():\n    logger.info(\"Handling root request\")\n    return {\"message\": \"Hello World\"}",
      "description": "Sends structured log messages from FastAPI applications to Sentry for centralized log management.",
      "name": "Logs",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Set `enable_logs=True` in your `sentry_sdk.init()` call to enable log ingestion. Once enabled, log records emitted via Python's standard logging module will be forwarded to Sentry.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## FastAPI SDK Setup\n\n### 1. Install the SDK\n\n```bash\npip install sentry-sdk\n```\n\n### 2. Initialize Sentry\n\nCall `sentry_sdk.init()` before creating your FastAPI app. The FastAPI integration is enabled automatically when the `fastapi` package is installed.\n\n```python\nimport sentry_sdk\nfrom fastapi import FastAPI\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Capture 100% of transactions for tracing\n    traces_sample_rate=1.0,\n    # Collect profiles for all profile sessions\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n\napp = FastAPI()\n```\n\n### 3. Configure Integration Options (Optional)\n\nTo customize the integration behavior, explicitly pass both `StarletteIntegration` and `FastApiIntegration`:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.starlette import StarletteIntegration\nfrom sentry_sdk.integrations.fastapi import FastApiIntegration\nfrom fastapi import FastAPI\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        StarletteIntegration(\n            transaction_style=\"url\",  # or \"endpoint\"\n            failed_request_status_codes={403, *range(500, 599)},\n            http_methods_to_capture=(\"GET\", \"POST\", \"PUT\", \"DELETE\", \"PATCH\"),\n        ),\n        FastApiIntegration(\n            transaction_style=\"url\",  # or \"endpoint\"\n            failed_request_status_codes={403, *range(500, 599)},\n            http_methods_to_capture=(\"GET\", \"POST\", \"PUT\", \"DELETE\", \"PATCH\"),\n        ),\n    ],\n)\n\napp = FastAPI()\n```\n\n### 4. Verify Your Setup\n\nAdd a test route that triggers an error:\n\n```python\nfrom fastapi import FastAPI\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    traces_sample_rate=1.0,\n)\n\napp = FastAPI()\n\n@app.get(\"/sentry-debug\")\nasync def trigger_error():\n    division_by_zero = 1 / 0\n```\n\nVisit `http://localhost:8000/sentry-debug` in your browser. A transaction will appear in the Performance section of sentry.io, and an error event will be sent and linked to that transaction.\n\n### Supported Versions\n\n- FastAPI: 0.79.0+\n- Python: 3.7+\n",
  "name": "FastAPI",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 7,
  "slug": "fastapi"
};

export default fastapi;
