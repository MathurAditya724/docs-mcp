import type { SentrySkill } from "../../types";

const pyramid: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)",
      "description": "Automatically capture all unhandled exceptions and Internal Server Errors in your Pyramid application.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk with pip. If the pyramid package is in your dependencies, the Pyramid integration is enabled automatically when you initialize the Sentry SDK. Call sentry_sdk.init() before your Pyramid app is created.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)",
      "description": "Capture performance data and distributed traces for all Pyramid requests.",
      "name": "Tracing",
      "setup": "Install sentry-sdk with pip and set traces_sample_rate in your sentry_sdk.init() call. The Pyramid integration will automatically instrument incoming requests when the pyramid package is present.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)",
      "description": "Collect code-level profiling data for Pyramid requests to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Install sentry-sdk with pip and set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call alongside tracing configuration.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)",
      "description": "Send Python log records as structured log events to Sentry.",
      "name": "Logs",
      "setup": "Install sentry-sdk with pip and set enable_logs=True in your sentry_sdk.init() call. The Logging integration is enabled by default, and log records will also create breadcrumbs on events.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Pyramid Setup\n\n### 1. Install the SDK\n\n```bash\npip install \"sentry-sdk\"\n```\n\n### 2. Initialize the SDK\n\nAdd Sentry initialization as early as possible in your application, before your Pyramid app is created. If `pyramid` is in your dependencies, the integration is enabled automatically.\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### 3. Verify Setup\n\nCreate a simple Pyramid app that triggers an error to verify Sentry is working:\n\n```python\nfrom wsgiref.simple_server import make_server\nfrom pyramid.config import Configurator\nfrom pyramid.response import Response\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\ndef hello_world(request):\n    1 / 0  # raises an error\n    return Response('Hello World!')\n\nif __name__ == '__main__':\n    with Configurator() as config:\n        config.add_route('hello', '/')\n        config.add_view(hello_world, route_name='hello')\n        app = config.make_wsgi_app()\n    server = make_server('0.0.0.0', 6543, app)\n    server.serve_forever()\n```\n\nVisit `http://localhost:6543/` and an error event will be sent to Sentry.\n\n### 4. Custom Integration Options\n\nYou can explicitly configure the Pyramid integration to customize transaction naming:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.pyramid import PyramidIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        PyramidIntegration(\n            transaction_style=\"route_pattern\",  # or \"route_name\" (default)\n        )\n    ],\n)\n```\n\n### Notes\n\n- If using uWSGI, enable threading with `--enable-threads` and `--py-call-uwsgi-fork-hooks`.\n- Requires Pyramid 1.6+ and Python 3.6+.\n- The SDK reports all exceptions leading to Internal Server Errors.\n- Request data (HTTP method, URL, headers, form data, JSON payloads) is attached to all events.",
  "name": "Pyramid",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "pyramid"
};

export default pyramid;
