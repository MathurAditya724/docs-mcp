import type { SentrySkill } from "../../types";

const litestar: SentrySkill = {
  "category": "framework",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)",
      "description": "Automatically capture errors and exceptions from Litestar request handlers and report them to Sentry.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk and litestar packages. If the litestar package is in your dependencies, the Litestar integration will be enabled automatically when you initialize the Sentry SDK. Call sentry_sdk.init() before creating your Litestar app.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)",
      "description": "Monitor performance and trace interactions between services by capturing transactions for every Litestar request.",
      "name": "Tracing",
      "setup": "Install sentry-sdk and litestar packages. Enable tracing by setting traces_sample_rate in sentry_sdk.init(). The Litestar integration will automatically create transactions for incoming requests.",
      "slug": "tracing"
    },
    {
      "code": "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle=\"trace\",\n)",
      "description": "Collect and analyze performance profiles from real users running your Litestar application.",
      "name": "Profiling",
      "setup": "Install sentry-sdk and litestar packages. Enable profiling by setting profile_session_sample_rate and profile_lifecycle in sentry_sdk.init() alongside tracing configuration. Profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    }
  ],
  "gettingStarted": "## Litestar Integration with Sentry\n\n### Installation\n\n```bash\npip install sentry-sdk uvicorn litestar\n```\n\n### Configuration\n\nIf the `litestar` package is in your dependencies, the Litestar integration will be enabled automatically when you initialize the Sentry SDK.\n\nCreate your application file (e.g., `app.py`):\n\n```python\nimport sentry_sdk\nfrom litestar import Litestar, get\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    # Add data like request headers and IP for users, if applicable\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set profile_session_sample_rate to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle=\"trace\",\n)\n\n@get(\"/hello\")\nasync def hello_world() -> str:\n    return \"Hello!\"\n\napp = Litestar(route_handlers=[hello_world])\n```\n\n### Custom Integration Options\n\nYou can explicitly configure the `LitestarIntegration` to set options like `failed_request_status_codes`:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.litestar import LitestarIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        LitestarIntegration(\n            failed_request_status_codes={403, *range(500, 599)},\n        ),\n    ],\n)\n```\n\n### Run the Development Server\n\n```bash\nuvicorn app:app\n```\n\n### Verify\n\nTo verify the integration is working, add an intentional error to a route handler:\n\n```python\nimport sentry_sdk\nfrom litestar import Litestar, get\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\n@get(\"/hello\")\nasync def hello_world() -> str:\n    1 / 0  # This will raise a ZeroDivisionError\n    return \"Hello!\"\n\napp = Litestar(route_handlers=[hello_world])\n```\n\nVisit `http://localhost:8000/hello` and the error will appear in your Sentry project connected to the transaction.",
  "name": "Litestar",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 5,
  "slug": "litestar"
};

export default litestar;
