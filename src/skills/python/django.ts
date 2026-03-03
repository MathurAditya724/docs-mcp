import type { SentrySkill } from "../../types";

const django: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: 'sentry_sdk.capture_exception(Exception("something broke"))',
      description: "Auto-captures errors from views, middleware, signals.",
      name: "Error Monitoring",
      setup:
        "Configured by init(). DjangoIntegration auto-enabled. Manual: capture_exception().",
      slug: "error-monitoring",
    },
    {
      code: 'traces_sample_rate=1.0,\n\nDjangoIntegration(\n    transaction_style="url",\n    middleware_spans=True,\n    signals_spans=True,\n    cache_spans=False,\n)',
      description: "Auto-traces middleware, signals, DB, Redis, cache.",
      name: "Tracing",
      setup:
        "Set traces_sample_rate. Options: transaction_style, middleware_spans, signals_spans, signals_denylist, cache_spans, http_methods_to_capture.",
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
      code: 'enable_logs=True,\n\nimport logging\nlogger = logging.getLogger(__name__)\nlogger.warning("Something suspicious", extra={"user_id": request.user.id})',
      description: "Python logger messages sent to Sentry.",
      name: "Logs",
      setup: "Set enable_logs=True. LoggingIntegration auto-enabled.",
      slug: "logs",
    },
    {
      code: 'from sentry_sdk.crons import monitor\n\n@monitor(monitor_slug="daily-cleanup")\ndef run_scheduled_task():\n    Session.objects.filter(expire_date__lt=timezone.now()).delete()',
      description: "Monitor scheduled tasks for missed/late/failed runs.",
      name: "Crons",
      setup:
        "@monitor decorator or monitor() context manager. Celery Beat: auto-instrumented via CeleryIntegration.",
      slug: "crons",
    },
    {
      code: 'def handler500(request):\n    return render(request, "500.html", {\n        "sentry_event_id": sentry_sdk.last_event_id(),\n    }, status=500)\n\n# urls.py: handler500 = "myapp.views.handler500"\n# 500.html: Sentry.showReportDialog({ eventId: "{{ sentry_event_id }}" })',
      description: "Crash-Report modal on error pages.",
      name: "User Feedback",
      setup:
        "Pass last_event_id() to template. Load Sentry browser SDK, call showReportDialog({ eventId }).",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '```bash\npip install sentry-sdk\n```\n\nIn `settings.py` (before Django loads):\n```python\nimport sentry_sdk\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n    enable_logs=True,\n)\n```\n\nDjangoIntegration auto-enabled.',
  name: "Django",
  packages: ["sentry-sdk"],
  rank: 10,
  slug: "django",
};

export default django;
