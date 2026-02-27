import type { SentrySkill } from "../../types";

const tornado: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)",
      "description": "Automatically capture all unhandled exceptions and errors in your Tornado application.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. If the tornado package is in your dependencies, the Tornado integration will be enabled automatically when you initialize the Sentry SDK. Call sentry_sdk.init() before your application starts.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)",
      "description": "Automatically create transactions for each Tornado request and trace performance across your application.",
      "name": "Tracing",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. Set traces_sample_rate in your sentry_sdk.init() call to enable performance monitoring. Each request will automatically create a transaction in Sentry.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)",
      "description": "Collect code-level profiling data for Tornado requests to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. Set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call. Profiles will be automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.logging import LoggingIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)",
      "description": "Send structured logs from your Tornado application to Sentry for centralized log management.",
      "name": "Logs",
      "setup": "Install sentry-sdk from PyPI with `pip install sentry-sdk`. Set enable_logs=True in your sentry_sdk.init() call to enable log capture. Logging with any logger will also create breadcrumbs when the Logging integration is enabled (done by default).",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Sentry for Tornado\n\n### Installation\n\n```bash\npip install sentry-sdk\n```\n\nIf you're on Python 3.6, you also need the `aiocontextvars` package:\n\n```bash\npip install \"aiocontextvars\"\n```\n\n### Configuration\n\nIf you have the `tornado` package in your dependencies, the Tornado integration will be enabled automatically when you initialize the Sentry SDK. Add the following to your application entry point:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add data like request headers and IP for users, if applicable\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### Verify\n\nCreate a simple Tornado application to verify the integration is working:\n\n```python\nimport asyncio\nimport tornado\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nclass MainHandler(tornado.web.RequestHandler):\n    def get(self):\n        1 / 0  # raises an error\n        self.write(\"Hello, world\")\n\ndef make_app():\n    return tornado.web.Application([\n        (r\"/\", MainHandler),\n    ])\n\nasync def main():\n    app = make_app()\n    app.listen(8888)\n    await asyncio.Event().wait()\n\nasyncio.run(main())\n```\n\nWhen you point your browser to `http://localhost:8888/`, a transaction in the Performance section of sentry.io will be created. Additionally, an error event will be sent to sentry.io and will be connected to the transaction.\n\n### Behavior\n\n- The Tornado integration will be installed for all of your apps and handlers.\n- All exceptions leading to an Internal Server Error are reported.\n- Request data is attached to all events: HTTP method, URL, headers, form data, JSON payloads.\n- Each request has a separate scope. Changes to the scope within a view will only apply to events sent as part of the request being handled.\n- Logging with any logger will create breadcrumbs when the Logging integration is enabled (done by default).\n\n### Supported Versions\n\n- Tornado: 6+\n- Python: 3.8+\n",
  "name": "Tornado",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "tornado"
};

export default tornado;
