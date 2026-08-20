import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SSO_LOCALE_COOKIE, SSO_STATE_COOKIE } from '@/libs/AuthCookies';
import {
  applySessionCookie,
  applySsoCookies,
  clearAuthCookies,
  createOAuthState,
  getSession,
  safeEqual,
} from '@/libs/AuthSession';
import { localizedUrl, resolveLocale } from '@/libs/I18nRouting';
import { logger } from '@/libs/Logger';
import {
  buildAuthorizationUrl,
  exchangeAuthorizationCode,
  fetchSignflowUser,
  revokeSignflowToken,
} from '@/libs/Signflow';

/**
 * Redirects the user to SignFlow to start SANAD SSO.
 * @param request The incoming login request, optionally including a locale query param.
 * @returns A redirect to the SignFlow authorization page.
 */
export const startSanadLogin = (request: Request) => {
  const locale = resolveLocale(new URL(request.url).searchParams.get('locale'));
  const state = createOAuthState();
  const response = NextResponse.redirect(buildAuthorizationUrl({ state, locale }));

  applySsoCookies(response, state, locale);

  return response;
};

/**
 * Completes SANAD SSO and stores the local session cookie.
 * @param request The SignFlow callback request containing `code` and `state`.
 * @returns A redirect to the dashboard on success, or sign-in on failure.
 */
export const completeSanadLogin = async (request: NextRequest) => {
  const { origin, searchParams } = request.nextUrl;
  const locale = resolveLocale(request.cookies.get(SSO_LOCALE_COOKIE)?.value);
  const expectedState = request.cookies.get(SSO_STATE_COOKIE)?.value;
  const errorCode = searchParams.get('errorCode') ?? searchParams.get('error');
  const state = searchParams.get('state');
  const code = searchParams.get('code');

  const fail = (error: string) => {
    const response = NextResponse.redirect(localizedUrl(origin, '/sign-in', locale, { error }));
    clearAuthCookies(response);
    return response;
  };

  if (errorCode) {
    return fail(errorCode);
  }

  if (!code || !state || !expectedState || !safeEqual(state, expectedState)) {
    return fail('interrupted');
  }

  const token = await exchangeAuthorizationCode(code);

  if (!token) {
    return fail('token');
  }

  const user = await fetchSignflowUser(token.access_token);

  if (!user) {
    logger.warn('SignFlow user info is missing after token exchange');
    return fail('user');
  }

  const response = NextResponse.redirect(localizedUrl(origin, '/dashboard', locale));

  clearAuthCookies(response);
  applySessionCookie(response, {
    nationalId: user.username,
    email: user.mail ?? null,
    mobile: user.mobile ?? null,
    dateOfBirth: user.dateOfBirth ?? null,
    accessToken: token.access_token,
  });

  return response;
};

/**
 * Ends the local session and revokes the SignFlow access token.
 * @param request The logout form submission, optionally including a locale field.
 * @returns A redirect to the marketing home page.
 */
export const endSanadSession = async (request: Request) => {
  const formData = await request.formData();
  const localeField = formData.get('locale');
  const locale = resolveLocale(typeof localeField === 'string' ? localeField : undefined);
  const session = await getSession();

  if (session) {
    await revokeSignflowToken(session.accessToken);
  }

  const response = NextResponse.redirect(localizedUrl(new URL(request.url).origin, '/', locale));
  clearAuthCookies(response);

  return response;
};
