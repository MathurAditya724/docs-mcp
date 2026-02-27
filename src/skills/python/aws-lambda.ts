import type { SentrySkill } from "../../types";

const awsLambda: SentrySkill = {
  "category": "library",
  "ecosystem": "python",
  "features": [
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    integrations=[\n        AwsLambdaIntegration(),\n    ],\n    traces_sample_rate=1.0,\n    send_default_pii=True,\n)\n\ndef handler(event, context):\n    # Your Lambda function code here\n    return {\"statusCode\": 200, \"body\": \"Hello from Lambda!\"}",
      "description": "Automatically capture errors and exceptions from AWS Lambda functions.",
      "name": "Error Monitoring",
      "setup": "Install the Sentry SDK and add the AwsLambdaIntegration to your sentry_sdk.init() call at the top of your Lambda function handler file. The integration will automatically capture unhandled exceptions and report them to Sentry.",
      "slug": "error-monitoring"
    },
    {
      "code": "import sentry_sdk\nfrom sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    integrations=[\n        AwsLambdaIntegration(),\n    ],\n    traces_sample_rate=1.0,\n)\n\ndef handler(event, context):\n    with sentry_sdk.start_transaction(op=\"function\", name=\"my-lambda-function\"):\n        # Your Lambda function code here\n        return {\"statusCode\": 200, \"body\": \"Hello from Lambda!\"}",
      "description": "Monitor performance and distributed traces across AWS Lambda function invocations.",
      "name": "Tracing",
      "setup": "Set traces_sample_rate in your sentry_sdk.init() call to enable performance monitoring. The AwsLambdaIntegration will automatically create transactions for each Lambda invocation.",
      "slug": "tracing"
    }
  ],
  "gettingStarted": "## AWS Lambda Python Setup\n\nYou can instrument your AWS Lambda functions in several ways:\n\n### Option 1: Manual Code Instrumentation\n\nInstall the Sentry SDK into your Lambda function packages:\n\n```bash\npip install \"sentry-sdk\"\n```\n\nAdd Sentry initialization to your Lambda handler file:\n\n```python\nimport sentry_sdk\nfrom sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration\n\nsentry_sdk.init(\n    dsn=\"___PUBLIC_DSN___\",\n    integrations=[\n        AwsLambdaIntegration(),\n    ],\n    # Set traces_sample_rate to 1.0 to capture 100%\n    # of transactions for tracing.\n    traces_sample_rate=1.0,\n    send_default_pii=True,\n)\n\ndef handler(event, context):\n    # Your Lambda function code here\n    return {\"statusCode\": 200, \"body\": \"Hello from Lambda!\"}\n```\n\n### Option 2: AWS Lambda Layer (No Code Changes)\n\nAdd the Sentry Lambda Layer to your function via the AWS console or CLI and configure it using environment variables. See the [AWS Lambda Layer docs](https://docs.sentry.io/platforms/python/integrations/aws-lambda/aws-lambda-layer/) for details.\n\n### Option 3: Sentry Product Integration\n\nInstrument directly from the Sentry product UI without touching your code. This requires access to your AWS infrastructure. See the [AWS Lambda guide](https://docs.sentry.io/platforms/python/integrations/aws-lambda/) for details.\n\n### Verify\n\nAdd an intentional error to test your setup:\n\n```python\ndef handler(event, context):\n    division_by_zero = 1 / 0\n```\n\nDeploy and invoke your Lambda function, then check your Sentry project for the captured error.",
  "name": "AWS Lambda",
  "packages": [
    "sentry-sdk"
  ],
  "rank": 1,
  "slug": "aws-lambda"
};

export default awsLambda;
