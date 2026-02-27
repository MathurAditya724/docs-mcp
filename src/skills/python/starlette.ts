import type { SentrySkill } from "../../types";

const starlette: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\nfrom starlette.applications import Starlette\nfrom starlette.routing import Route\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\nasync def trigger_error(request):\n    division_by_zero = 1 / 0\n\napp = Starlette(\n    routes=[\n        Route(\"/sentry-debug\", trigger_error),\n    ]\n)",
      "description": "Automatically captures exceptions and reports errors from Starlette applications to Sentry.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. If you have the starlette package in your dependencies, the Starlette integration will be enabled automatically when you initialize the Sentry SDK. By default, all exceptions leading to an Internal Server Error are reported, and HTTP status codes to report on are configurable via the failed_request_status_codes option.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\nfrom starlette.applications import Starlette\nfrom starlette.routing import Route\nfrom starlette.responses import JSONResponse\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nasync def product_detail(request):\n    return JSONResponse({\"product\": \"example\"})\n\napp = Starlette(\n    routes=[\n        Route(\"/catalog/product/{product_id}\", product_detail),\n    ]\n)",
      "description": "Captures performance data and creates transactions for incoming Starlette requests.",
      "name": "Tracing",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. Set traces_sample_rate in your sentry_sdk.init() call to enable performance monitoring. If traces_sample_rate is set, performance information is reported and visible on the Performance page of sentry.io. You can configure the transaction style (url or endpoint) and which HTTP methods create transactions using the StarletteIntegration options.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\nfrom starlette.applications import Starlette\nfrom starlette.routing import Route\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)\n\nasync def homepage(request):\n    return {\"page\": \"home\"}\n\napp = Starlette(\n    routes=[\n        Route(\"/\", homepage),\n    ]\n)",
      "description": "Collects code-level profiling data for Starlette request handlers.",
      "name": "Profiling",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. Enable profiling by setting profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call alongside traces_sample_rate. Profiles will be automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\nfrom starlette.applications import Starlette\nfrom starlette.routing import Route\nfrom starlette.responses import JSONResponse\nimport logging\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\nlogger = logging.getLogger(__name__)\n\nasync def homepage(request):\n    logger.info(\"Handling homepage request\")\n    return JSONResponse({\"page\": \"home\"})\n\napp = Starlette(\n    routes=[\n        Route(\"/\", homepage),\n    ]\n)",
      "description": "Sends structured log messages from Starlette applications to Sentry.",
      "name": "Logs",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. Enable logging by setting enable_logs=True in your sentry_sdk.init() call. Log messages will be automatically captured and sent to Sentry.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Starlette Integration for Sentry\n\n### Installation\n\n```bash\npip install sentry-sdk\n```\n\n### Configuration\n\nIf you have the `starlette` package in your dependencies, the Starlette integration will be enabled automatically when you initialize the Sentry SDK. Add the following to your application entry point:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add data like request headers and IP for users, if applicable\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100% of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions, set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while there is an active span.\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### Basic Starlette Application\n\n```python\nfrom starlette.applications import Starlette\nfrom starlette.routing import Route\nfrom starlette.responses import JSONResponse\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nasync def trigger_error(request):\n    division_by_zero = 1 / 0\n\nasync def homepage(request):\n    return JSONResponse({\"status\": \"ok\"})\n\napp = Starlette(\n    routes=[\n        Route(\"/\", homepage),\n        Route(\"/sentry-debug\", trigger_error),\n    ]\n)\n```\n\n### Advanced Configuration with StarletteIntegration\n\nYou can explicitly configure the Starlette integration for more control:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.starlette import StarletteIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        StarletteIntegration(\n            # Use \"url\" or \"endpoint\" for transaction naming\n            transaction_style=\"url\",\n            # Report 403s and all 5xx status codes\n            failed_request_status_codes={403, *range(500, 599)},\n            # Track middleware performance spans\n            middleware_spans=False,\n            # Only capture transactions for GET requests\n            http_methods_to_capture=(\"GET\", \"POST\", \"PUT\", \"PATCH\", \"DELETE\"),\n        )\n    ],\n)\n```\n\n### Verify\n\nPoint your browser to `http://localhost:8000/sentry-debug` to trigger a test error. A transaction will be created in the Performance section of sentry.io and an error event will be sent and connected to the transaction.",
  "name": "Starlette",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "starlette"
};

export default starlette;
