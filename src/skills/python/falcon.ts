import type { SentrySkill } from "../../types";

const falcon: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\nimport falcon\n\nclass HelloWorldResource:\n    def on_get(self, req, resp):\n        message = {'hello': \"world\"}\n        1 / 0  # raises an error\n        resp.media = message\n\napp = falcon.App()\napp.add_route('/', HelloWorldResource())",
      "description": "Automatically captures exceptions and errors from Falcon web applications and reports them to Sentry.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Initialize Sentry at the start of your application before creating your Falcon app. If you have the falcon package in your dependencies, the Falcon integration will be enabled automatically when you initialize the Sentry SDK. All exceptions leading to an Internal Server Error are reported along with request data such as HTTP method, URL, headers, and form data.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nimport falcon\n\nclass HelloWorldResource:\n    def on_get(self, req, resp):\n        message = {'hello': \"world\"}\n        resp.media = message\n\napp = falcon.App()\napp.add_route('/', HelloWorldResource())",
      "description": "Automatically creates transactions for each Falcon request and sends performance data to Sentry.",
      "name": "Tracing",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Initialize Sentry with `traces_sample_rate` set to a value between 0.0 and 1.0. Each request will automatically create a transaction in the Performance section of sentry.io. Error events will be connected to their corresponding transactions.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)\n\nimport falcon\n\nclass HelloWorldResource:\n    def on_get(self, req, resp):\n        message = {'hello': \"world\"}\n        resp.media = message\n\napp = falcon.App()\napp.add_route('/', HelloWorldResource())",
      "description": "Collects code-level profiling data for Falcon requests to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Initialize Sentry with `profile_session_sample_rate` and `profile_lifecycle` options in addition to `traces_sample_rate`. Profiles will be automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\nimport falcon\nimport logging\n\nlogger = logging.getLogger(__name__)\n\nclass HelloWorldResource:\n    def on_get(self, req, resp):\n        logger.info(\"Handling hello world request\")\n        message = {'hello': \"world\"}\n        resp.media = message\n\napp = falcon.App()\napp.add_route('/', HelloWorldResource())",
      "description": "Sends structured log messages from Falcon applications to Sentry.",
      "name": "Logs",
      "setup": "Install sentry-sdk with pip: `pip install sentry-sdk`. Initialize Sentry with `enable_logs=True` to enable log collection. Python logging calls will be captured and sent to Sentry.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Sentry for Falcon\n\n### Installation\n\n```bash\npip install sentry-sdk\n```\n\n### Configuration\n\nInitialize Sentry as early as possible in your application, before creating your Falcon app. If you have the `falcon` package in your dependencies, the Falcon integration will be enabled automatically.\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set `profile_session_sample_rate` to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### Create Your Falcon App\n\n```python\nimport falcon\n\nclass HelloWorldResource:\n    def on_get(self, req, resp):\n        message = {'hello': \"world\"}\n        resp.media = message\n\napp = falcon.App()\napp.add_route('/', HelloWorldResource())\n```\n\n### Advanced Configuration\n\nYou can explicitly configure the `FalconIntegration` to set options like `transaction_style`:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.falcon import FalconIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        FalconIntegration(\n            # Use \"path\" for the actual URL path, or\n            # \"uri_template\" (default) for the route template\n            transaction_style=\"uri_template\",\n        ),\n    ],\n)\n```\n\n### Verify\n\nAdd this intentional error to test that everything is working:\n\n```python\nimport falcon\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nclass HelloWorldResource:\n    def on_get(self, req, resp):\n        message = {'hello': \"world\"}\n        1 / 0  # raises an error\n        resp.media = message\n\napp = falcon.App()\napp.add_route('/', HelloWorldResource())\n```\n\nWhen you point your browser to `http://localhost:8000/`, a transaction will be created in the Performance section of sentry.io, and an error event will be sent and connected to the transaction.\n\n### uWSGI Note\n\nIf you're using uWSGI, enable threading support to avoid unexpected behavior:\n\n```bash\nuwsgi --enable-threads --py-call-uwsgi-fork-hooks ...\n```",
  "name": "Falcon",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "falcon"
};

export default falcon;
