import type { SentrySkill } from "../../types";

const nestjs: SentrySkill = {
  "category": "framework",
  "ecosystem": "javascript",
  "features": [
    {
      "code": "import * as Sentry from \"@sentry/nestjs\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n});\n\n// In your main module (app.module.ts), add SentryGlobalFilter:\nimport { Module } from \"@nestjs/common\";\nimport { APP_FILTER } from \"@nestjs/core\";\nimport { SentryGlobalFilter } from \"@sentry/nestjs/setup\";\n\n@Module({\n  providers: [\n    {\n      provide: APP_FILTER,\n      useClass: SentryGlobalFilter,\n    },\n  ],\n})\nexport class AppModule {}\n\n// Manually capture exceptions in specific filters:\nimport * as Sentry from \"@sentry/nestjs\";\nimport { ArgumentsHost, Catch } from \"@nestjs/common\";\nimport { BaseExceptionFilter } from \"@nestjs/core\";\n\n@Catch()\nexport class YourExceptionFilter extends BaseExceptionFilter {\n  catch(exception: unknown, host: ArgumentsHost) {\n    Sentry.captureException(exception);\n    return super.catch(exception, host);\n  }\n}",
      "description": "Automatically capture unhandled exceptions and errors in your NestJS application and send them to Sentry.",
      "name": "Error Monitoring",
      "setup": "Install @sentry/nestjs and create an instrument.ts file in the root of your project with Sentry.init(). Import instrument.ts as the first import in main.ts, add SentryModule.forRoot() to your main module's imports, and add SentryGlobalFilter to your module providers to capture all exceptions.",
      "slug": "error-monitoring"
    },
    {
      "code": "import * as Sentry from \"@sentry/nestjs\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  tracesSampleRate: 1.0,\n});\n\n// Example route with manual tracing\nimport { Get, Controller } from \"@nestjs/common\";\n\n@Controller()\nexport class AppController {\n  @Get(\"/debug-sentry\")\n  tracedRoute() {\n    return Sentry.startSpan(\n      {\n        op: \"test\",\n        name: \"My First Test Transaction\",\n      },\n      () => {\n        // Your logic here\n        return { status: \"ok\" };\n      }\n    );\n  }\n}",
      "description": "Track software performance and distributed tracing across your NestJS application.",
      "name": "Tracing",
      "setup": "Add tracesSampleRate to your Sentry.init() call in instrument.ts to enable tracing. Set the value between 0.0 and 1.0 to control what percentage of transactions are captured. Use Sentry.startSpan() to create custom spans within your route handlers.",
      "slug": "tracing"
    },
    {
      "code": "import * as Sentry from \"@sentry/nestjs\";\nconst { nodeProfilingIntegration } = require(\"@sentry/profiling-node\");\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  integrations: [\n    nodeProfilingIntegration(),\n  ],\n  tracesSampleRate: 1.0,\n  profileSessionSampleRate: 1.0,\n});",
      "description": "Gain deeper insight into your NestJS application's performance by profiling code execution to identify slow or resource-intensive functions.",
      "name": "Profiling",
      "setup": "Install @sentry/profiling-node in addition to @sentry/nestjs. Add nodeProfilingIntegration() to the integrations array and set profileSessionSampleRate in your Sentry.init() call in instrument.ts.",
      "slug": "profiling"
    },
    {
      "code": "import * as Sentry from \"@sentry/nestjs\";\n\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  enableLogs: true,\n});\n\n// Use Sentry logger to send structured logs\nconst { logger } = Sentry;\n\nlogger.info(\"User signed in\", { userId: \"123\" });\nlogger.error(\"Something went wrong\", { errorCode: 500 });",
      "description": "Centralize and analyze application logs by sending them to Sentry, where they can be correlated with errors and performance issues.",
      "name": "Logs",
      "setup": "Add enableLogs: true to your Sentry.init() call in instrument.ts to enable log collection. Use the Sentry logger API to emit structured logs from your NestJS application.",
      "slug": "logs"
    }
  ],
  "gettingStarted": "## Getting Started with Sentry for NestJS\n\n### Step 1: Install\n\n```bash\nnpm install @sentry/nestjs --save\n```\n\nIf you want profiling support, also install:\n\n```bash\nnpm install @sentry/nestjs @sentry/profiling-node --save\n```\n\n### Step 2: Create instrument.ts\n\nCreate a file named `instrument.ts` in the root directory of your project:\n\n```typescript\n// instrument.ts\nimport * as Sentry from \"@sentry/nestjs\";\n\n// Ensure to call this before requiring any other modules!\nSentry.init({\n  dsn: \"___PUBLIC_DSN___\",\n  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.\n  tracesSampleRate: 1.0,\n  // Enable logs to be sent to Sentry\n  enableLogs: true,\n});\n```\n\n### Step 3: Update main.ts\n\nImport `instrument.ts` as the very first import in your `main.ts`:\n\n```typescript\n// main.ts\n// Import this first!\nimport \"./instrument\";\n\n// Now import other modules\nimport { NestFactory } from \"@nestjs/core\";\nimport { AppModule } from \"./app.module\";\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  await app.listen(3000);\n}\nbootstrap();\n```\n\n### Step 4: Update app.module.ts\n\nAdd `SentryModule` as a root module and `SentryGlobalFilter` to capture all errors:\n\n```typescript\n// app.module.ts\nimport { Module } from \"@nestjs/common\";\nimport { APP_FILTER } from \"@nestjs/core\";\nimport { SentryModule } from \"@sentry/nestjs/setup\";\nimport { SentryGlobalFilter } from \"@sentry/nestjs/setup\";\nimport { AppController } from \"./app.controller\";\nimport { AppService } from \"./app.service\";\n\n@Module({\n  imports: [\n    SentryModule.forRoot(),\n    // ...other modules\n  ],\n  controllers: [AppController],\n  providers: [\n    AppService,\n    {\n      provide: APP_FILTER,\n      useClass: SentryGlobalFilter,\n    },\n  ],\n})\nexport class AppModule {}\n```\n\n### Step 5: Verify Your Setup\n\nAdd a test route to trigger an error:\n\n```typescript\nimport { Get, Controller } from \"@nestjs/common\";\n\n@Controller()\nexport class AppController {\n  @Get(\"/debug-sentry\")\n  getError() {\n    throw new Error(\"My first Sentry error!\");\n  }\n}\n```\n\nVisit `/debug-sentry` in your browser and check your Sentry project for the captured error.\n\n### Step 6: Add Source Maps (Optional)\n\nUpload source maps to Sentry for readable stack traces:\n\n```bash\nnpx @sentry/wizard@latest -i sourcemaps\n```\n",
  "name": "Sentry NestJS SDK",
  "packages": [
    "@sentry/nestjs",
    "@sentry/profiling-node"
  ],
  "rank": 7,
  "slug": "nestjs"
};

export default nestjs;
