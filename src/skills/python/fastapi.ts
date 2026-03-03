import type { SentrySkill } from "../../types";

const fastapi: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: 'sentry_sdk.capture_exception(Exception("something broke"))',
      description: "Auto-captures all 5xx errors.",
      name: "Error Monitoring",
      setup:
        "Configured by init(). FastApiIntegration auto-enabled. Manual: capture_exception().",
      slug: "error-monitoring",
    },
    {
      code: 'traces_sample_rate=1.0,\n\nfrom sentry_sdk.integrations.starlette import StarletteIntegration\nfrom sentry_sdk.integrations.fastapi import FastApiIntegration\nintegrations=[\n    StarletteIntegration(transaction_style="endpoint"),\n    FastApiIntegration(transaction_style="endpoint"),\n]',
      description: "Auto-traces middleware, DB, Redis.",
      name: "Tracing",
      setup:
        "Set traces_sample_rate. Options: transaction_style, failed_request_status_codes, middleware_spans, http_methods_to_capture. Both StarletteIntegration + FastApiIntegration needed.",
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
      code: 'from sentry_sdk.crons import monitor\n\n@monitor(monitor_slug="daily-cleanup")\nasync def run_scheduled_task():\n    await database.execute("DELETE FROM sessions WHERE expired_at < NOW()")',
      description: "Monitor scheduled tasks for missed/late/failed runs.",
      name: "Crons",
      setup: "@monitor decorator or monitor() context manager.",
      slug: "crons",
    },
    {
      code: '@app.exception_handler(Exception)\nasync def server_error_handler(request: Request, exc: Exception):\n    event_id = sentry_sdk.last_event_id()\n    html = f"""<script src="https://browser.sentry-cdn.com/10.41.0/bundle.min.js"></script>\n    <script>Sentry.init({{dsn:"___PUBLIC_DSN___"}});Sentry.showReportDialog({{eventId:"{event_id}"}});</script>"""\n    return HTMLResponse(content=html, status_code=500)',
      description: "Crash-Report modal on error pages.",
      name: "User Feedback",
      setup:
        "Register exception_handler(Exception). Pass last_event_id() to showReportDialog().",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '```bash\npip install sentry-sdk\n```\n\nInit before creating FastAPI app:\n```python\nimport sentry_sdk\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n    enable_logs=True,\n)\n```\n\nFastApiIntegration + StarletteIntegration auto-enabled.',
  name: "FastAPI",
  packages: ["sentry-sdk"],
  rank: 8,
  slug: "fastapi",
};

export default fastapi;
