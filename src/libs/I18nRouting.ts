import { defineRouting } from 'next-intl/routing';
import { AppConfig } from '@/utils/AppConfig';

export const routing = defineRouting({
  locales: AppConfig.i18n.locales,
  localePrefix: AppConfig.i18n.localePrefix,
  defaultLocale: AppConfig.i18n.defaultLocale,
});

/**
 * Returns a supported locale, falling back to the default.
 * @param locale A candidate locale from a cookie, query, or form field.
 * @returns A locale configured in the app.
 */
export const resolveLocale = (locale?: string | null) =>
  routing.locales.find((item) => item === locale) ?? routing.defaultLocale;

/**
 * Reads the locale prefix from a pathname when present.
 * @param pathname The request pathname.
 * @returns The locale prefix, or undefined when the default locale is unprefixed.
 */
export const getLocaleFromPathname = (pathname: string) =>
  routing.locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

/**
 * Builds a locale-aware path by prefixing non-default locales.
 * @param path The application-relative path starting with a slash.
 * @param locale The active locale identifier.
 * @returns The localized path.
 */
export const localizePath = (path: string, locale: string) =>
  locale === routing.defaultLocale ? path : `/${locale}${path}`;

/**
 * Returns true when the pathname is a dashboard route.
 * @param pathname The request pathname.
 * @returns True when the path requires a session.
 */
export const isDashboardPath = (pathname: string) => {
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return true;
  }

  return routing.locales.some(
    (locale) => pathname === `/${locale}/dashboard` || pathname.startsWith(`/${locale}/dashboard/`),
  );
};

/**
 * Builds an absolute localized URL.
 * @param origin The request origin.
 * @param path The application-relative path starting with a slash.
 * @param locale The active locale identifier.
 * @param query Optional query parameters.
 * @returns An absolute URL.
 */
export const localizedUrl = (
  origin: string,
  path: string,
  locale: string,
  query?: Record<string, string>,
) => {
  const url = new URL(localizePath(path, resolveLocale(locale)), origin);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  return url;
};
