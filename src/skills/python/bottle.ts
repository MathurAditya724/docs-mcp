import type { SentrySkill } from "../../types";

const bottle: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\nfrom bottle import Bottle, run\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\napp = Bottle()\n\n@app.route('/')\ndef hello():\n    1 / 0\n    return \"Hello World!\"\n\nrun(app, host='localhost', port=8000)",
      "description": "Automatically captures all unhandled exceptions and Internal Server Errors in Bottle applications.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk via pip. The Bottle integration is enabled automatically when you initialize the Sentry SDK if the bottle package is present in your dependencies. Call sentry_sdk.init() before creating your Bottle app with your DSN and desired options.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\nfrom bottle import Bottle, run\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\napp = Bottle()\n\n@app.route('/')\ndef hello():\n    return \"Hello World!\"\n\nrun(app, host='localhost', port=8000)",
      "description": "Automatically creates transactions for each request and links errors to their corresponding transactions.",
      "name": "Tracing",
      "setup": "Set traces_sample_rate in your sentry_sdk.init() call to a value between 0.0 and 1.0. Each incoming request will automatically generate a performance transaction in Sentry.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\nfrom bottle import Bottle, run\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)\n\napp = Bottle()\n\n@app.route('/')\ndef hello():\n    return \"Hello World!\"\n\nrun(app, host='localhost', port=8000)",
      "description": "Collects code-level profiling data for Bottle request handlers while there is an active trace.",
      "name": "Profiling",
      "setup": "Set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call. Profiling requires tracing to be enabled (traces_sample_rate > 0). Profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\nfrom bottle import Bottle, run\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\napp = Bottle()\n\n@app.route('/')\ndef hello():\n    return \"Hello World!\"\n\nrun(app, host='localhost', port=8000)",
      "description": "Sends structured log messages from your Bottle application to Sentry.",
      "name": "Logs",
      "setup": "Set enable_logs=True in your sentry_sdk.init() call to enable log capture and forwarding to Sentry.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for Bottle\n\n### 1. Install the SDK\n\n```bash\npip install sentry-sdk\n```\n\n### 2. Initialize Sentry\n\nAdd the Sentry initialization as early as possible in your application. The Bottle integration is enabled automatically when the `bottle` package is present.\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle=\"trace\",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\n### 3. Create Your Bottle App\n\n```python\nfrom bottle import Bottle, run\n\napp = Bottle()\n\n@app.route('/')\ndef hello():\n    return \"Hello World!\"\n\nrun(app, host='localhost', port=8000)\n```\n\n### 4. Verify Your Setup\n\nAdd an intentional error to test that everything is working:\n\n```python\nfrom bottle import Bottle, run\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\napp = Bottle()\n\n@app.route('/')\ndef hello():\n    1 / 0\n    return \"Hello World!\"\n\nrun(app, host='localhost', port=8000)\n```\n\nVisit http://localhost:8000/ to trigger the error. A transaction will be created in the Performance section of sentry.io and an error event will be sent and connected to the transaction.\n\n### 5. Advanced Configuration (Optional)\n\nYou can explicitly configure the Bottle integration with custom options:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.bottle import BottleIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        BottleIntegration(\n            # Use 'endpoint' (default) or 'url' for transaction naming\n            transaction_style=\"endpoint\",\n            # Report HTTP responses with status codes in 5xx range\n            failed_request_status_codes={*range(500, 600)},\n        ),\n    ],\n)\n```\n\n### uWSGI Note\n\nIf you're using uWSGI, enable threading support to avoid unexpected behavior:\n\n```bash\nuwsgi --enable-threads --py-call-uwsgi-fork-hooks ...\n```\n\n### Supported Versions\n\n- Bottle: 0.12.13+\n- Python: 3.6+",
  "name": "Bottle",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "bottle"
};

export default bottle;
