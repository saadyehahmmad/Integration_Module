import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  server: {
    ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
    AUTH_SECRET: z.string().min(32),
    SIGNFLOW_BASE_URL: z.url(),
    SIGNFLOW_GSB_BASE_URL: z.url(),
    SIGNFLOW_CLIENT_ID: z.string().min(1),
    SIGNFLOW_CLIENT_SECRET: z.string().min(1),
    SIGNFLOW_IBM_CLIENT_ID: z.string().min(1),
    SIGNFLOW_IBM_CLIENT_SECRET: z.string().min(1),
    SIGNFLOW_PKCE_VERIFIER: z.string().min(1),
    SIGNFLOW_PKCE_CHALLENGE: z.string().min(1),
    SIGNFLOW_REDIRECT_URI: z.url().optional(),
    RECAPTCHA_SECRET_KEY: z.string().min(1).optional(),
    RECAPTCHA_MIN_SCORE: z.coerce.number().min(0).max(1).default(0.5),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_LOGGING_LEVEL: z
      .enum(['error', 'info', 'debug', 'warning', 'trace', 'fatal'])
      .default('info'),
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: z.string().optional(),
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    ARCJET_KEY: process.env.ARCJET_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    SIGNFLOW_BASE_URL: process.env.SIGNFLOW_BASE_URL,
    SIGNFLOW_GSB_BASE_URL: process.env.SIGNFLOW_GSB_BASE_URL,
    SIGNFLOW_CLIENT_ID: process.env.SIGNFLOW_CLIENT_ID,
    SIGNFLOW_CLIENT_SECRET: process.env.SIGNFLOW_CLIENT_SECRET,
    SIGNFLOW_IBM_CLIENT_ID: process.env.SIGNFLOW_IBM_CLIENT_ID,
    SIGNFLOW_IBM_CLIENT_SECRET: process.env.SIGNFLOW_IBM_CLIENT_SECRET,
    SIGNFLOW_PKCE_VERIFIER: process.env.SIGNFLOW_PKCE_VERIFIER,
    SIGNFLOW_PKCE_CHALLENGE: process.env.SIGNFLOW_PKCE_CHALLENGE,
    SIGNFLOW_REDIRECT_URI: process.env.SIGNFLOW_REDIRECT_URI,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_MIN_SCORE: process.env.RECAPTCHA_MIN_SCORE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_LOGGING_LEVEL: process.env.NEXT_PUBLIC_LOGGING_LEVEL,
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NODE_ENV: process.env.NODE_ENV,
  },
});
