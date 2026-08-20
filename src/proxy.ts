import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { SESSION_COOKIE } from '@/libs/AuthCookies';
import { getLocaleFromPathname, localizePath, routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

/**
 * Returns true when the pathname is a profile route that requires a session.
 * @param pathname The request pathname.
 * @returns True when the path requires authentication.
 */
const isProfilePath = (pathname: string) => {
  if (pathname === '/dashboard/user-profile' || pathname.startsWith('/dashboard/user-profile/')) {
    return true;
  }

  return routing.locales.some(
    (locale) =>
      pathname === `/${locale}/dashboard/user-profile` ||
      pathname.startsWith(`/${locale}/dashboard/user-profile/`),
  );
};

const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'CATEGORY:MONITOR'],
  }),
);

export default async function proxy(request: NextRequest) {
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  if (isProfilePath(request.nextUrl.pathname) && !request.cookies.has(SESSION_COOKIE)) {
    const locale = getLocaleFromPathname(request.nextUrl.pathname) ?? routing.defaultLocale;

    return NextResponse.redirect(new URL(localizePath('/sign-in', locale), request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|api|.*\\..*).*)',
};
