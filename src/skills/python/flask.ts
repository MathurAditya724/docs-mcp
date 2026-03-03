import type { SentrySkill } from "../../types";

const flask: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: 'sentry_sdk.capture_exception(Exception("something broke"))',
      description: "Auto-captures errors from routes and handlers.",
      name: "Error Monitoring",
      setup:
        "Configured by init(). FlaskIntegration auto-enabled. Manual: capture_exception().",
      slug: "error-monitoring",
    },
    {
      code: 'traces_sample_rate=1.0,\n\nFlaskIntegration(\n    transaction_style="url",\n    http_methods_to_capture=("GET", "POST"),\n)',
      description: "Auto-traces requests and DB queries.",
      name: "Tracing",
      setup:
        "Set traces_sample_rate. Options: transaction_style, http_methods_to_capture.",
      slug: "tracing",
    },
    {
      code: 'profile_session_sample_rate=1.0,\nprofile_lifecycle="trace",',
      description: "Code-level profiling. Requires tracing.",
      name: "Profiling",
      setup:
        "Add profile_session_sample_rate and profile_lifecycle to init(). Requires traces_sample_rate > 0.",
      slug: "profiling",
    },
    {
      code: 'enable_logs=True,\n\nimport logging\nlogger = logging.getLogger(__name__)\nlogger.info("Request processed")',
      description: "Python logger messages sent to Sentry.",
      name: "Logs",
      setup: "Set enable_logs=True. LoggingIntegration auto-enabled.",
      slug: "logs",
    },
    {
      code: 'from sentry_sdk.crons import monitor\n\n@monitor(monitor_slug="daily-cleanup")\ndef run_scheduled_task():\n    db.session.query(ExpiredSession).delete()\n    db.session.commit()',
      description: "Monitor scheduled tasks for missed/late/failed runs.",
      name: "Crons",
      setup: "@monitor decorator or monitor() context manager.",
      slug: "crons",
    },
    {
      code: '@app.errorhandler(500)\ndef server_error_handler(error):\n    return render_template("500.html",\n        sentry_event_id=sentry_sdk.last_event_id(),\n    ), 500\n\n# 500.html: Sentry.showReportDialog({ eventId: "{{ sentry_event_id }}" })',
      description: "Crash-Report modal on error pages.",
      name: "User Feedback",
      setup:
        "Pass last_event_id() to template. Load Sentry browser SDK, call showReportDialog({ eventId }).",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '```bash\npip install sentry-sdk\n```\n\nInit before creating Flask app:\n```python\nimport sentry_sdk\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n    enable_logs=True,\n)\n```\n\nFlaskIntegration auto-enabled.',
  name: "Flask",
  packages: ["sentry-sdk"],
  rank: 7,
  slug: "flask",
};

export default flask;
