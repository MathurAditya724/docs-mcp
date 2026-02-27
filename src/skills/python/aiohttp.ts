import type { SentrySkill } from "../../types";

const aiohttp: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\nfrom aiohttp import web\n\nasync def hello(request):\n    1 / 0  # raises an error\n    return web.Response(text=\"Hello, world\")\n\napp = web.Application()\napp.add_routes([web.get('/', hello)])\nweb.run_app(app)",
      "description": "Automatically captures exceptions and internal server errors from AIOHTTP request handlers.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk via pip. The AIOHTTP integration is enabled automatically when the aiohttp package is present in your dependencies and you call sentry_sdk.init() with your DSN. All exceptions leading to an Internal Server Error are reported automatically.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nfrom aiohttp import web\n\nasync def hello(request):\n    return web.Response(text=\"Hello, world\")\n\napp = web.Application()\napp.add_routes([web.get('/', hello)])\nweb.run_app(app)",
      "description": "Automatically creates transactions for each incoming AIOHTTP request for performance monitoring.",
      "name": "Tracing",
      "setup": "Install sentry-sdk via pip and set traces_sample_rate in your sentry_sdk.init() call. The AIOHTTP integration will automatically instrument incoming requests and create transactions in the Performance section of sentry.io.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)\n\nfrom aiohttp import web\n\nasync def hello(request):\n    return web.Response(text=\"Hello, world\")\n\napp = web.Application()\napp.add_routes([web.get('/', hello)])\nweb.run_app(app)",
      "description": "Collects code-level profiling data for AIOHTTP request handlers during active traces.",
      "name": "Profiling",
      "setup": "Install sentry-sdk via pip and set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call alongside tracing configuration. Profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\nfrom aiohttp import web\nimport logging\n\nlogger = logging.getLogger(__name__)\n\nasync def hello(request):\n    logger.info(\"Handling request\")\n    return web.Response(text=\"Hello, world\")\n\napp = web.Application()\napp.add_routes([web.get('/', hello)])\nweb.run_app(app)",
      "description": "Captures log records as Sentry logs and creates breadcrumbs from Python logging calls within AIOHTTP handlers.",
      "name": "Logs",
      "setup": "Install sentry-sdk via pip and set enable_logs=True in your sentry_sdk.init() call. Logging with any logger will create breadcrumbs when the Logging integration is enabled (enabled by default).",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## AIOHTTP Integration Setup\n\n### 1. Install the SDK\n\n```bash\npip install sentry-sdk\n```\n\nIf you're on Python 3.6, also install:\n\n```bash\npip install \"aiocontextvars\"\n```\n\n### 2. Initialize Sentry\n\nThe AIOHTTP integration is enabled automatically when the `aiohttp` package is present. Initialize Sentry as early as possible in your application:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### 3. Create Your AIOHTTP App\n\n```python\nfrom aiohttp import web\n\nasync def hello(request):\n    return web.Response(text=\"Hello, world\")\n\napp = web.Application()\napp.add_routes([web.get('/', hello)])\nweb.run_app(app)\n```\n\n### 4. Optional: Configure Integration Options\n\nYou can explicitly pass options to the AIOHTTP integration:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.aiohttp import AioHttpIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        AioHttpIntegration(\n            # Use 'method_and_path_pattern' for e.g. \"GET /path/{id}\"\n            # or 'handler_name' for e.g. \"module.handler\" (default)\n            transaction_style=\"method_and_path_pattern\",\n            # Report HTTP exceptions with these status codes to Sentry\n            # Default: {*range(500, 600)}\n            failed_request_status_codes={400, *range(500, 600)},\n        ),\n    ],\n)\n```\n\n### 5. Verify Setup\n\nAdd this intentional error to test your configuration:\n\n```python\nfrom aiohttp import web\nimport sentry_sdk\n\nsentry_sdk.init(dsn=\"___PUBLIC_DSN__\")\n\nasync def hello(request):\n    1 / 0  # This will raise a ZeroDivisionError\n    return web.Response(text=\"Hello, world\")\n\napp = web.Application()\napp.add_routes([web.get('/', hello)])\nweb.run_app(app)\n```\n\nVisit `http://localhost:8080/` and you should see an error event appear in sentry.io along with a transaction in the Performance section.\n\n### Supported Versions\n\n- AIOHTTP: 3.4+\n- Python: 3.7+",
  "name": "AIOHTTP",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "aiohttp"
};

export default aiohttp;
