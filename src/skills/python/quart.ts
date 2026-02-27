import type { SentrySkill } from "../../types";

const quart: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\nfrom quart import Quart\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\napp = Quart(__name__)\n\n@app.route(\"/\")\nasync def hello():\n    1 / 0  # raises an error\n    return {\"hello\": \"world\"}\n\napp.run()",
      "description": "Automatically captures all exceptions leading to Internal Server Error, from before/after serving functions, and background tasks in Quart applications.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk from PyPI using pip install sentry-sdk. If you have the quart package in your dependencies, the Quart integration will be enabled automatically when you initialize the Sentry SDK. Call sentry_sdk.init() with your DSN before creating your Quart app instance.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\nfrom quart import Quart\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\napp = Quart(__name__)\n\n@app.route(\"/\")\nasync def hello():\n    return {\"hello\": \"world\"}\n\napp.run()",
      "description": "Creates transactions for each request and connects errors to their corresponding performance traces in Quart applications.",
      "name": "Tracing",
      "setup": "Install sentry-sdk from PyPI using pip install sentry-sdk. Initialize the Sentry SDK with traces_sample_rate set to a value between 0.0 and 1.0 to control what percentage of transactions are captured. The Quart integration is enabled automatically when the quart package is present.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\nfrom quart import Quart\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)\n\napp = Quart(__name__)\n\n@app.route(\"/\")\nasync def hello():\n    return {\"hello\": \"world\"}\n\napp.run()",
      "description": "Collects code-level profiling data for Quart requests while there is an active trace span.",
      "name": "Profiling",
      "setup": "Install sentry-sdk from PyPI using pip install sentry-sdk. Initialize the Sentry SDK with both traces_sample_rate and profile_session_sample_rate set to control sampling, and set profile_lifecycle to 'trace' so profiles are collected automatically during active spans.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\nfrom quart import Quart\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\napp = Quart(__name__)\n\n@app.route(\"/\")\nasync def hello():\n    return {\"hello\": \"world\"}\n\napp.run()",
      "description": "Enables sending Python log records as structured logs to Sentry from Quart applications.",
      "name": "Logs",
      "setup": "Install sentry-sdk from PyPI using pip install sentry-sdk. Initialize the Sentry SDK with enable_logs=True. The Logging integration is enabled by default, so any logging calls will also create breadcrumbs automatically.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Quart Integration for Sentry\n\n### Installation\n\n```bash\npip install sentry-sdk quart\n```\n\n### Configuration\n\nIf you have the `quart` package in your dependencies, the Quart integration will be enabled automatically when you initialize the Sentry SDK.\n\nAdd the following to your application entry point, before creating your Quart app:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### Example Application\n\n```python\nfrom quart import Quart\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\napp = Quart(__name__)\n\n@app.route(\"/\")\nasync def hello():\n    return {\"hello\": \"world\"}\n\n@app.route(\"/error\")\nasync def error():\n    1 / 0  # raises an error\n    return {\"hello\": \"world\"}\n\napp.run()\n```\n\n### Verify\n\nVisit `http://localhost:5000/error` in your browser. A transaction will be created in the Performance section of sentry.io, and an error event will be sent and connected to that transaction.\n\n### Behavior\n\n- All exceptions leading to an Internal Server Error are reported\n- Errors from before/after serving functions and background tasks are reported\n- Request data (HTTP method, URL, headers) is attached to all events\n- Each request has a separate scope\n- Logging creates breadcrumbs automatically via the Logging integration\n\n### Supported Versions\n\n- Quart: 0.16.1+\n- Python: 3.7+",
  "name": "Quart",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "quart"
};

export default quart;
