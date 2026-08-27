import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

export const Env = createEnv({
  server: {
    SIGNFLOW_BASE_URL: z.url(),
    SIGNFLOW_GSB_BASE_URL: z.url(),
    SIGNFLOW_CLIENT_ID: z.string().min(1),
    SIGNFLOW_REDIRECT_URI: z.url(),
    SIGNFLOW_CLIENT_SECRET: z.string().min(1),
    SIGNFLOW_IBM_CLIENT_ID: z.string().min(1),
    SIGNFLOW_IBM_CLIENT_SECRET: z.string().min(1),
    SIGNFLOW_PKCE_VERIFIER: z.string().min(1),
    SIGNFLOW_PKCE_CHALLENGE: z.string().min(1),
    RECAPTCHA_MIN_SCORE: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0).max(1).default(0.5),
    ),
    RECAPTCHA_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  },
  client: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    NEXT_PUBLIC_LOGGING_LEVEL: z.preprocess(
      emptyToUndefined,
      z.enum(['error', 'info', 'debug', 'warning', 'trace', 'fatal']).default('info'),
    ),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    SIGNFLOW_BASE_URL: process.env.SIGNFLOW_BASE_URL,
    SIGNFLOW_GSB_BASE_URL: process.env.SIGNFLOW_GSB_BASE_URL,
    SIGNFLOW_CLIENT_ID: process.env.SIGNFLOW_CLIENT_ID,
    SIGNFLOW_REDIRECT_URI: process.env.SIGNFLOW_REDIRECT_URI,
    SIGNFLOW_CLIENT_SECRET: process.env.SIGNFLOW_CLIENT_SECRET,
    SIGNFLOW_IBM_CLIENT_ID: process.env.SIGNFLOW_IBM_CLIENT_ID,
    SIGNFLOW_IBM_CLIENT_SECRET: process.env.SIGNFLOW_IBM_CLIENT_SECRET,
    SIGNFLOW_PKCE_VERIFIER: process.env.SIGNFLOW_PKCE_VERIFIER,
    SIGNFLOW_PKCE_CHALLENGE: process.env.SIGNFLOW_PKCE_CHALLENGE,
    RECAPTCHA_MIN_SCORE: process.env.RECAPTCHA_MIN_SCORE,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    NEXT_PUBLIC_LOGGING_LEVEL: process.env.NEXT_PUBLIC_LOGGING_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
  },
});
