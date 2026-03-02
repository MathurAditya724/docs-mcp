import type { SentrySkill } from "../../types";

const django: SentrySkill = {
  category: "framework",
  ecosystem: "python",
  features: [
    {
      code: "import sentry_sdk\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n)\n\n# In your Django urls.py, add a test endpoint:\nfrom django.urls import path\n\ndef trigger_error(request):\n    division_by_zero = 1 / 0\n\nurlpatterns = [\n    path('sentry-debug/', trigger_error),\n    # ...\n]",
      description:
        "Automatically capture errors and exceptions from Django views, middleware, and signals.",
      name: "Error Monitoring",
      setup:
        "Install sentry-sdk with pip and initialize it in your Django settings.py file with your DSN. The Django integration is enabled automatically and will capture errors from views, middleware, and other Django components. Set send_default_pii=True to include request data and user information with error events.",
      slug: "error-monitoring",
    },
    {
      code: 'import django.db.models.signals\nimport sentry_sdk\nfrom sentry_sdk.integrations.django import DjangoIntegration\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        DjangoIntegration(\n            transaction_style=\'url\',\n            middleware_spans=True,\n            signals_spans=True,\n            signals_denylist=[\n                django.db.models.signals.pre_init,\n                django.db.models.signals.post_init,\n            ],\n            cache_spans=False,\n            http_methods_to_capture=("GET",),\n        ),\n    ],\n)',
      description:
        "Monitor performance of Django middleware, signals, database queries, Redis commands, and cache operations.",
      name: "Tracing",
      setup:
        "Set traces_sample_rate in your sentry_sdk.init() call to enable performance monitoring. You can optionally pass DjangoIntegration explicitly to configure tracing options such as middleware_spans, signals_spans, and cache_spans. The integration automatically monitors the middleware stack, signals, database queries, Redis commands, and Django cache access.",
      slug: "tracing",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n)',
      description:
        "Collect code-level profiling data for Django requests to identify performance bottlenecks.",
      name: "Profiling",
      setup:
        "Set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call along with traces_sample_rate. Profiles are automatically collected while there is an active span, giving you code-level visibility into your Django application's performance.",
      slug: "profiling",
    },
    {
      code: 'import sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    enable_logs=True,\n)\n\n# Django logger messages are now sent to Sentry as logs\nimport logging\nlogger = logging.getLogger(__name__)\n\ndef my_view(request):\n    logger.warning("Something suspicious happened", extra={"user_id": request.user.id})\n    return HttpResponse("OK")',
      description:
        "Send Django logger messages to Sentry as structured log events.",
      name: "Logs",
      setup:
        "Set enable_logs=True in your sentry_sdk.init() call. The Logging integration is enabled by default and will record log messages from any Django logger as both breadcrumbs and log events in Sentry.",
      slug: "logs",
    },
    {
      code: 'import sentry_sdk\nfrom sentry_sdk.crons import monitor\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n)\n\n@monitor(monitor_slug="my-scheduled-task")\ndef run_scheduled_task():\n    # Your periodic task logic here (management command, Celery task, etc.)\n    pass',
      description:
        "Monitor periodic and scheduled tasks (management commands, Celery tasks) to detect missed, late, or failed executions.",
      name: "Crons",
      setup:
        "Use the @monitor decorator from sentry_sdk.crons to wrap your scheduled task functions. Sentry will notify you if a task is missed, exceeds its maximum runtime, or fails. You can also use monitor as a context manager or send manual check-ins with capture_checkin. For Celery Beat tasks, the Celery integration provides automatic crons instrumentation.",
      slug: "crons",
    },
    {
      code: 'import sentry_sdk\nfrom django.shortcuts import render\n\n# views.py\ndef handler500(request):\n    return render(request, "500.html", {\n        "sentry_event_id": sentry_sdk.last_event_id(),\n    }, status=500)\n\n# urls.py\n# handler500 = "myapp.views.handler500"\n\n# In your 500.html template:\n# <script src="https://browser.sentry-cdn.com/10.41.0/bundle.min.js" crossorigin="anonymous"></script>\n# <script>\n#   Sentry.init({ dsn: "___PUBLIC_DSN___" });\n#   Sentry.showReportDialog({ eventId: "{{ sentry_event_id }}" });\n# </script>',
      description:
        "Collect user feedback when errors occur in your Django application using the Crash-Report modal.",
      name: "User Feedback",
      setup:
        "In your Django 500 error handler view, retrieve the event ID with sentry_sdk.last_event_id() and pass it to your error template. In the template, load the Sentry browser SDK and call Sentry.showReportDialog({ eventId }) to display a feedback modal prompting for name, email, and description.",
      slug: "user-feedback",
    },
  ],
  gettingStarted:
    '## Getting Started with Sentry for Django\n\n### 1. Install the SDK\n\n```bash\npip install sentry-sdk\n```\n\n### 2. Configure Sentry in `settings.py`\n\nAdd the following at the top of your Django `settings.py` file:\n\n```python\nimport sentry_sdk\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    # Add request headers and IP for users\n    send_default_pii=True,\n    # Capture 100% of transactions for tracing\n    traces_sample_rate=1.0,\n    # Collect profiles for all profile sessions\n    profile_session_sample_rate=1.0,\n    profile_lifecycle="trace",\n    # Enable logs to be sent to Sentry\n    enable_logs=True,\n)\n```\n\nThe Django integration is automatically enabled when the SDK is initialized inside a Django project.\n\n### 3. (Optional) Configure DjangoIntegration Options\n\nFor advanced configuration, pass `DjangoIntegration` explicitly:\n\n```python\nimport django.db.models.signals\nimport sentry_sdk\nfrom sentry_sdk.integrations.django import DjangoIntegration\n\nsentry_sdk.init(\n    dsn="___PUBLIC_DSN___",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n    integrations=[\n        DjangoIntegration(\n            transaction_style=\'url\',\n            middleware_spans=True,\n            signals_spans=True,\n            signals_denylist=[\n                django.db.models.signals.pre_init,\n                django.db.models.signals.post_init,\n            ],\n            cache_spans=False,\n            http_methods_to_capture=("GET",),\n        ),\n    ],\n)\n```\n\n### 4. Verify Your Setup\n\nAdd a test endpoint to your `urls.py` to trigger an intentional error:\n\n```python\nfrom django.urls import path\n\ndef trigger_error(request):\n    division_by_zero = 1 / 0\n\nurlpatterns = [\n    path(\'sentry-debug/\', trigger_error),\n    # ... your other URL patterns\n]\n```\n\nVisit `/sentry-debug/` in your browser and check your Sentry dashboard to confirm the error was captured.\n\n### Supported Versions\n\n- Django 1.8+\n- Python 3.6+\n\n### What\'s Monitored Automatically\n\n- Errors and exceptions from views and middleware\n- Django middleware stack performance\n- Django signals\n- Database queries\n- Redis commands\n- Django cache operations\n- User data (when `send_default_pii=True` and `django.contrib.auth` is used)\n- Request data (HTTP method, URL, headers, form data, JSON payloads)\n- Log messages as breadcrumbs and log events\n',
  name: "Django",
  packages: ["sentry-sdk"],
  rank: 10,
  slug: "django",
};

export default django;
