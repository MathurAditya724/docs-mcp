import type { SentrySkill } from "../../types";

const flask: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: `import sentry_sdk

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    send_default_pii=True,
)

# Errors are captured automatically. To manually capture:
sentry_sdk.capture_exception(Exception("Something went wrong"))
sentry_sdk.capture_message("Something happened")`,
      description:
        "Automatically captures unhandled exceptions in your Flask application.",
      name: "Error Monitoring",
      setup:
        "Error monitoring is enabled by default when you call sentry_sdk.init(). The Flask integration auto-activates when the flask package is installed. Unhandled exceptions in route handlers are captured automatically.",
      slug: "error-monitoring",
    },
    {
      code: `import sentry_sdk

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    send_default_pii=True,
    # Set traces_sample_rate to 1.0 to capture 100% of transactions for tracing.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,
)

# Flask routes are automatically instrumented as transactions.
# Each incoming HTTP request creates a trace.`,
      description:
        "Track performance across your Flask application with distributed tracing.",
      name: "Tracing",
      setup:
        "Enable tracing by setting traces_sample_rate in your sentry_sdk.init() call. Flask routes are automatically instrumented as transactions.",
      slug: "tracing",
    },
    {
      code: `import sentry_sdk

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    send_default_pii=True,
    traces_sample_rate=1.0,
    # Enable profiling
    profile_session_sample_rate=1.0,
    profile_lifecycle="trace",
)`,
      description:
        "Identify slow or resource-intensive functions in your Flask application.",
      name: "Profiling",
      setup:
        "Enable profiling by setting profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call. Profiling requires tracing to be enabled. No additional packages needed — profiling is built into the Python SDK.",
      slug: "profiling",
    },
    {
      code: `import sentry_sdk

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    send_default_pii=True,
    enable_logs=True,
)

# Use structured logging
sentry_sdk.logger.info("User logged in", user_id="123")
sentry_sdk.logger.warn("Slow query detected", duration=5000)
sentry_sdk.logger.error("Operation failed", reason="timeout")`,
      description:
        "Centralize and analyze your application logs. Correlate them with errors and performance issues.",
      name: "Logs",
      setup:
        "Enable logs by setting enable_logs=True in your sentry_sdk.init() call. Use sentry_sdk.logger.info(), .warn(), .error() to send structured logs. The Python SDK also automatically captures logs from the standard logging module as breadcrumbs.",
      slug: "logs",
    },
  ],
  gettingStarted: `Install the Sentry Python SDK:

\`\`\`bash
pip install sentry-sdk
\`\`\`

The Flask integration activates automatically when the \`flask\` package is installed. No need to explicitly enable it.

Initialize Sentry BEFORE creating your Flask app:

\`\`\`python
import sentry_sdk
from flask import Flask

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    send_default_pii=True,
    traces_sample_rate=1.0,
)

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"
\`\`\`

To customize the Flask integration explicitly:

\`\`\`python
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    send_default_pii=True,
    integrations=[
        FlaskIntegration(
            transaction_style="url",
            http_methods_to_capture=("GET", "POST"),
        ),
    ],
)
\`\`\``,
  name: "Flask",
  packages: ["sentry-sdk"],
  rank: 10,
  slug: "flask",
};

export default flask;
