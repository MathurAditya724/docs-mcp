import type { SentrySkill } from "../../types";

const sanic: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "from sanic import Sanic\nfrom sanic.response import text\nimport sentry_sdk\nfrom sentry_sdk.integrations.asyncio import AsyncioIntegration\n\napp = Sanic(__name__)\n\n@app.listener(\"before_server_start\")\nasync def init_sentry(_):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        integrations=[\n            AsyncioIntegration(),\n        ],\n    )\n\n@app.get(\"/\")\nasync def hello_world(request):\n    1 / 0  # raises an error\n    return text(\"Hello, world.\")",
      "description": "Automatically captures exceptions and request data (HTTP method, URL, headers, form data, JSON payloads) for all Sanic requests that result in an Internal Server Error.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk from PyPI with pip install sentry-sdk. The Sanic integration is enabled automatically when the sanic package is in your dependencies. To ensure errors in background tasks are reported, always enable AsyncioIntegration alongside SanicIntegration and initialize the SDK inside a before_server_start listener.",
      "slug": "error-monitoring"
    },
    {
      "code": "from sanic import Sanic\nimport sentry_sdk\nfrom sentry_sdk.integrations.asyncio import AsyncioIntegration\nfrom sentry_sdk.integrations.sanic import SanicIntegration\n\napp = Sanic(__name__)\n\n@app.listener(\"before_server_start\")\nasync def init_sentry(_):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        traces_sample_rate=1.0,\n        integrations=[\n            AsyncioIntegration(),\n            SanicIntegration(\n                # Generate transactions for all HTTP status codes, including 404\n                unsampled_statuses=None,\n            ),\n        ],\n    )",
      "description": "Monitors interactions between multiple services by capturing transactions for Sanic requests, with configurable filtering of transactions by HTTP status code.",
      "name": "Tracing",
      "setup": "Set traces_sample_rate when initializing the Sentry SDK inside a before_server_start listener. By default, the Sanic integration generates transactions for all requests except those resulting in a 404 HTTP status. You can customize which statuses skip transaction creation by manually instantiating SanicIntegration with the unsampled_statuses option.",
      "slug": "tracing"
    },
    {
      "code": "from sanic import Sanic\nimport sentry_sdk\nfrom sentry_sdk.integrations.asyncio import AsyncioIntegration\n\napp = Sanic(__name__)\n\n@app.listener(\"before_server_start\")\nasync def init_sentry(_):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        traces_sample_rate=1.0,\n        profile_session_sample_rate=1.0,\n        profile_lifecycle=\"trace\",\n        integrations=[\n            AsyncioIntegration(),\n        ],\n    )",
      "description": "Collects and analyzes performance profiles from real users while there is an active trace span in your Sanic application.",
      "name": "Profiling",
      "setup": "Set profile_session_sample_rate and profile_lifecycle when initializing the Sentry SDK inside a before_server_start listener. Profiling requires tracing to be enabled (traces_sample_rate must be set). Profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    }
  ],
  "gettingStarted": "## Sanic Integration for Sentry\n\n### Installation\n\n```bash\npip install sentry-sdk\n```\n\nIf you're on Python 3.6, also install:\n\n```bash\npip install \"aiocontextvars\"\n```\n\n### Configuration\n\nInitialize the Sentry SDK inside a `before_server_start` listener to ensure async code is instrumented properly and background task errors are captured. The Sanic integration is enabled automatically when the `sanic` package is detected.\n\n```python\nfrom sanic import Sanic\nfrom sanic.response import text\nimport sentry_sdk\nfrom sentry_sdk.integrations.asyncio import AsyncioIntegration\n\napp = Sanic(__name__)\n\n@app.listener(\"before_server_start\")\nasync def init_sentry(_):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        # Add request headers and IP for users\n        send_default_pii=True,\n        # Set traces_sample_rate to 1.0 to capture 100% of transactions for tracing\n        traces_sample_rate=1.0,\n        # Collect profiles for all profile sessions\n        profile_session_sample_rate=1.0,\n        profile_lifecycle=\"trace\",\n        integrations=[\n            AsyncioIntegration(),\n        ],\n    )\n\n@app.get(\"/\")\nasync def hello_world(request):\n    return text(\"Hello, world.\")\n```\n\n### Customizing Transaction Sampling by HTTP Status\n\nBy default, no transactions are generated for 404 responses. To customize this behavior:\n\n```python\nfrom sentry_sdk.integrations.asyncio import AsyncioIntegration\nfrom sentry_sdk.integrations.sanic import SanicIntegration\n\n@app.listener(\"before_server_start\")\nasync def init_sentry(_):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        traces_sample_rate=1.0,\n        integrations=[\n            AsyncioIntegration(),\n            SanicIntegration(\n                # None means generate transactions for ALL HTTP statuses including 404\n                unsampled_statuses=None,\n                # Or specify a custom set: unsampled_statuses={200, 404}\n            ),\n        ],\n    )\n```\n\n### Verify\n\nAdd this route to trigger a test error:\n\n```python\n@app.get(\"/error\")\nasync def trigger_error(request):\n    1 / 0  # This will raise a ZeroDivisionError\n    return text(\"This won't be reached.\")\n```\n\nVisit `http://localhost:8000/error` and the error will be sent to Sentry.\n\n### Supported Versions\n\n- Sanic: 0.8+\n- Python: 3.6+ (Sanic 0.8+), 3.7+ (Sanic 21.0+)\n",
  "name": "Sanic",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "sanic"
};

export default sanic;
