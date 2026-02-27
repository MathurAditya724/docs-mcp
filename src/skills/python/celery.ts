import type { SentrySkill } from "../../types";

const celery: SentrySkill = {
  "category": "library",
  "ecosystem": "python",
  "features": [
    {
      "code": "from celery import Celery, signals\nimport sentry_sdk\n\napp = Celery(\"tasks\", broker=\"...\")\n\n@signals.celeryd_init.connect\ndef init_sentry(**_kwargs):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n    )\n\n@app.task\ndef debug_sentry():\n    1 / 0",
      "description": "Automatically capture errors from Celery tasks and link them to the triggering function via distributed tracing.",
      "name": "Error Monitoring",
      "setup": "Install sentry-sdk from PyPI with 'pip install sentry-sdk'. If you have the celery package in your dependencies, the Celery integration will be enabled automatically when you initialize the Sentry SDK. Make sure to call sentry_sdk.init() on worker startup using the celeryd_init signal, not just in the module where your tasks are defined.",
      "slug": "error-monitoring"
    },
    {
      "code": "from celery import Celery, signals\nimport sentry_sdk\n\napp = Celery(\"tasks\", broker=\"...\")\n\n@signals.celeryd_init.connect\ndef init_sentry(**_kwargs):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        traces_sample_rate=1.0,\n    )\n\n@app.task\ndef add(x, y):\n    return x + y\n\n# In your main application:\nimport sentry_sdk\nfrom tasks import add\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    send_default_pii=True,\n    traces_sample_rate=1.0,\n)\n\nwith sentry_sdk.start_transaction(name=\"calling-a-celery-task\"):\n    result = add.delay(4, 4)",
      "description": "Enable distributed tracing across Celery tasks to connect task execution traces back to the triggering function.",
      "name": "Tracing",
      "setup": "Install sentry-sdk from PyPI with 'pip install sentry-sdk'. Set traces_sample_rate in your sentry_sdk.init() calls in both your application process and the Celery worker process. Distributed tracing is enabled by default via the propagate_traces option in CeleryIntegration, linking task traces to the calling code.",
      "slug": "tracing"
    },
    {
      "code": "from celery import Celery, signals\nimport sentry_sdk\n\napp = Celery(\"tasks\", broker=\"...\")\n\n@signals.celeryd_init.connect\ndef init_sentry(**_kwargs):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        traces_sample_rate=1.0,\n        profile_session_sample_rate=1.0,\n        profile_lifecycle=\"trace\",\n    )\n\n@app.task\ndef add(x, y):\n    return x + y",
      "description": "Collect code-level profiling data for Celery tasks to identify performance bottlenecks.",
      "name": "Profiling",
      "setup": "Install sentry-sdk from PyPI with 'pip install sentry-sdk'. Set profile_session_sample_rate and profile_lifecycle in your sentry_sdk.init() call inside the celeryd_init signal handler. Profiles are automatically collected while there is an active span.",
      "slug": "profiling"
    },
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.celery import CeleryIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    integrations=[\n        CeleryIntegration(\n            monitor_beat_tasks=True,\n            exclude_beat_tasks=[\n                \"unimportant-task\",\n                \"payment-check-.*\",\n            ],\n        ),\n    ],\n)",
      "description": "Automatically monitor Celery Beat scheduled tasks using Sentry Crons to track their execution and detect failures.",
      "name": "Crons",
      "setup": "Install sentry-sdk from PyPI with 'pip install sentry-sdk'. Explicitly add CeleryIntegration to your sentry_sdk.init() call with monitor_beat_tasks=True to enable auto-instrumentation of Celery Beat tasks. You can optionally exclude specific tasks using the exclude_beat_tasks parameter with task names or regular expressions.",
      "slug": "crons"
    }
  ],
  "gettingStarted": "## Celery Integration for Sentry\n\n### Installation\n\n```bash\npip install sentry-sdk\n```\n\n### Setup Without Django\n\nInitialize Sentry in your Celery worker using the `celeryd_init` signal so it loads on worker startup:\n\n**tasks.py**\n```python\nfrom celery import Celery, signals\nimport sentry_sdk\n\n# Initialize Celery app\napp = Celery(\"tasks\", broker=\"...\")\n\n# Initialize Sentry SDK on Celery startup\n@signals.celeryd_init.connect\ndef init_sentry(**_kwargs):\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        # Set traces_sample_rate to 1.0 to capture 100%\n        # of transactions for tracing.\n        traces_sample_rate=1.0,\n        # To collect profiles for all profile sessions,\n        # set `profile_session_sample_rate` to 1.0.\n        profile_session_sample_rate=1.0,\n        # Profiles will be automatically collected while\n        # there is an active span.\n        profile_lifecycle=\"trace\",\n    )\n\n# Task definitions go here\n@app.task\ndef add(x, y):\n    return x + y\n```\n\nAlso initialize Sentry in your main application process:\n\n**main.py**\n```python\nfrom tasks import add\nimport sentry_sdk\n\ndef main():\n    sentry_sdk.init(\n        dsn=\"___PUBLIC_DSN___\",\n        send_default_pii=True,\n        traces_sample_rate=1.0,\n    )\n\n    # Enqueue a task to be processed by Celery\n    with sentry_sdk.start_transaction(name=\"calling-a-celery-task\"):\n        result = add.delay(4, 4)\n\nif __name__ == \"__main__\":\n    main()\n```\n\n### Setup With Django\n\nIf you're using Celery with Django and have initialized the SDK in your `settings.py`, and have Celery configured to use the same settings via `config_from_object`, no additional Celery SDK initialization is needed.\n\n### Advanced Options\n\nTo customize the Celery integration behavior, add it explicitly:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.celery import CeleryIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    integrations=[\n        CeleryIntegration(\n            # Enable Celery Beat auto-monitoring with Sentry Crons\n            monitor_beat_tasks=True,\n            # Exclude specific tasks from monitoring\n            exclude_beat_tasks=[\n                \"unimportant-task\",\n                \"payment-check-.*\",\n            ],\n            # Propagate traces from calling code to tasks (default: True)\n            propagate_traces=True,\n        ),\n    ],\n)\n```\n\n### Verify\n\nAdd this intentional error to a Celery task to verify everything is working:\n\n```python\n@app.task\ndef debug_sentry():\n    1 / 0\n```\n\nThen trigger it with `debug_sentry.delay()` and check your Sentry project for the captured error.\n",
  "name": "Celery",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 1,
  "slug": "celery"
};

export default celery;
