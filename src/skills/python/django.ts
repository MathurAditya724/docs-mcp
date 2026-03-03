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
      slug: "errors",
    },
    {
      code: 'import sentry_sdk\n\nwith sentry_sdk.start_transaction(op="task", name="process-order"):\n    with sentry_sdk.start_span(name="fetch-order"):\n        order = Order.objects.get(pk=42)\n    with sentry_sdk.start_span(name="process"):\n        order.process()',
      description: "Auto-traces middleware, signals, DB, Redis, cache.",
      name: "Tracing",
      setup:
        "Already configured: traces_sample_rate in gettingStarted init. Optional DjangoIntegration() options for init: transaction_style, middleware_spans, signals_spans, signals_denylist, cache_spans, http_methods_to_capture.",
      slug: "tracing",
    },
    {
      code: "# No additional code — configured in sentry_sdk.init() above.\n# Ensure profile_session_sample_rate and profile_lifecycle are set.",
      description: "Code-level profiling. Requires tracing.",
      name: "Profiling",
      setup:
        "Already configured: profile_session_sample_rate and profile_lifecycle in gettingStarted init. Requires traces_sample_rate > 0.",
      slug: "profiling",
    },
    {
      code: 'import logging\nlogger = logging.getLogger(__name__)\nlogger.warning("Something suspicious", extra={"user_id": request.user.id})',
      description: "Python logger messages sent to Sentry.",
      name: "Logs",
      setup:
        "Already configured: enable_logs in gettingStarted init. LoggingIntegration auto-enabled. Use standard logging module.",
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
      code: 'from django.shortcuts import render\nimport sentry_sdk\n\ndef handler500(request):\n    return render(request, "500.html", {\n        "sentry_event_id": sentry_sdk.last_event_id(),\n    }, status=500)\n\n# urls.py: handler500 = "myapp.views.handler500"\n# 500.html: Sentry.showReportDialog({ eventId: "{{ sentry_event_id }}" })',
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
