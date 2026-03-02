import type { SentrySkill } from "../../types";

const flask: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n)\n\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello_world():\n    1 / 0  # raises an error\n    return "<p>Hello, World!</p>"',
      description:
        "Automatically capture errors and exceptions from Flask routes and report them to Sentry.",
      name: "Error Monitoring",
      setup:
        "Install the sentry-sdk package using pip. If you have the flask package in your dependencies, the Flask integration will be enabled automatically when you initialize the Sentry SDK. Call sentry_sdk.init() before creating your Flask app so that all errors are captured. Request data including HTTP method, URL, headers, and form data will be attached to all events automatically.",
      slug: "error-monitoring",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello_world():\n    return "<p>Hello, World!</p>"',
      description:
        "Automatically create transactions for Flask requests and trace performance across your application.",
      name: "Tracing",
      setup:
        "Install the sentry-sdk package and initialize it with traces_sample_rate set to a value between 0.0 and 1.0. When you point your browser to a Flask route, a transaction will be created in the Performance section of sentry.io and connected to any error events that occur during the request.",
      slug: "tracing",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n)\n\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello_world():\n    return "<p>Hello, World!</p>"',
      description:
        "Collect code-level profiling data for Flask requests to identify performance bottlenecks.",
      name: "Profiling",
      setup:
        "Install the sentry-sdk package and initialize it with profile_session_sample_rate and profile_lifecycle options in addition to traces_sample_rate. Profiles will be automatically collected while there is an active span during Flask request handling.",
      slug: "profiling",
    },
    {
      code: 'import sentry_sdk\nimport logging\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello_world():\n    app.logger.info("Hello from Flask!")\n    return "<p>Hello, World!</p>"',
      description:
        "Send structured logs emitted by Flask's logger or any Python logger to Sentry.",
      name: "Logs",
      setup:
        "Install the sentry-sdk package and initialize it with enable_logs=True. Logs emitted by app.logger or any logger will be recorded as breadcrumbs by the Logging integration, which is enabled by default. Setting enable_logs=True sends logs directly to Sentry as log events.",
      slug: "logs",
    },
    {
      code: 'import sentry_sdk\nfrom sentry_sdk.crons import monitor\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n)\n\n@monitor(monitor_slug="my-scheduled-task")\ndef run_scheduled_task():\n    # Your periodic task logic here\n    pass',
      description:
        "Monitor periodic and scheduled tasks to detect missed, late, or failed executions.",
      name: "Crons",
      setup:
        "Use the @monitor decorator from sentry_sdk.crons to wrap your scheduled task functions. Sentry will notify you if a task is missed, exceeds its maximum runtime, or fails. You can also use monitor as a context manager or send manual check-ins with capture_checkin.",
      slug: "crons",
    },
    {
      code: 'import sentry_sdk\nfrom flask import render_template\n\n@app.errorhandler(500)\ndef server_error_handler(error):\n    return render_template("500.html",\n        sentry_event_id=sentry_sdk.last_event_id(),\n    ), 500\n\n# In your 500.html template:\n# <script src="https://browser.sentry-cdn.com/10.41.0/bundle.min.js" crossorigin="anonymous"></script>\n# <script>\n#   Sentry.init({ dsn: "___PUBLIC_DSN___" });\n#   Sentry.showReportDialog({ eventId: "{{ sentry_event_id }}" });\n# </script>',
      description:
        "Collect user feedback when errors occur in your Flask application using the Crash-Report modal.",
      name: "User Feedback",
      setup:
        "In your Flask 500 error handler, retrieve the event ID with sentry_sdk.last_event_id() and pass it to your error template. In the template, load the Sentry browser SDK and call Sentry.showReportDialog({ eventId }) to display a feedback modal prompting for name, email, and description.",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '## Flask SDK Setup\n\n### 1. Install the SDK\n\n```bash\npip install sentry-sdk\n```\n\n### 2. Initialize the SDK\n\nAdd the following to the top of your Flask application, before creating your Flask app:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    # To collect profiles for all profile sessions,\n    # set `profile_session_sample_rate` to 1.0.\n    profile_session_sample_rate=1.0,\n    # Profiles will be automatically collected while\n    # there is an active span.\n    profile_lifecycle="trace",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\nIf you have the `flask` package in your dependencies, the Flask integration will be enabled automatically when you initialize the Sentry SDK.\n\n### 3. Create your Flask app\n\n```python\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello_world():\n    return "<p>Hello, World!</p>"\n```\n\n### 4. Verify the setup\n\nAdd an intentional error to test that everything is working:\n\n```python\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/debug-sentry")\ndef trigger_error():\n    1 / 0  # raises a ZeroDivisionError\n    return "<p>This won\'t be reached.</p>"\n```\n\nVisit `http://localhost:5000/debug-sentry` in your browser. An error event will be sent to sentry.io and connected to a transaction in the Performance section.\n\n### 5. Optional: Configure FlaskIntegration explicitly\n\nYou can pass options to `FlaskIntegration` to customize its behavior:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.flask import FlaskIntegration\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        FlaskIntegration(\n            transaction_style="url",  # or "endpoint" (default)\n            http_methods_to_capture=("GET", "POST", "PUT", "DELETE", "PATCH"),\n        ),\n    ],\n)\n```\n\n### Supported Versions\n\n- Flask: 1.1.4+\n- Python: 3.6+\n',
  name: "Flask",
  packages: ["sentry-sdk"],
  rank: 7,
  slug: "flask",
};

export default flask;
