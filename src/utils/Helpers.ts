import { Env } from '@/libs/Env';

/**
 * Resolves the public base URL for local development and Vercel.
 * @returns The absolute application origin without a trailing slash.
 */
export const getBaseUrl = () => {
  if (Env.NEXT_PUBLIC_APP_URL) {
    return Env.NEXT_PUBLIC_APP_URL.replace(/\/$/u, '');
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export { localizePath as getI18nPath } from '@/libs/I18nRouting';
