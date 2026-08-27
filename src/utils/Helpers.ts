import { Env } from '@/libs/Env';

/**
 * Resolves the public base URL for local development and Vercel.
 * @returns The absolute application origin without a trailing slash.
 */
export const getBaseUrl = () => {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return new URL(Env.SIGNFLOW_REDIRECT_URI).origin;
};

export { localizePath as getI18nPath } from '@/libs/I18nRouting';
