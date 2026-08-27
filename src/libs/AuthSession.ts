import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextResponse } from 'next/server';
import * as z from 'zod';
import {
  AUTH_COOKIES,
  SESSION_COOKIE,
  SSO_LOCALE_COOKIE,
  SSO_STATE_COOKIE,
} from '@/libs/AuthCookies';
import { Env } from '@/libs/Env';
import { localizePath } from '@/libs/I18nRouting';

const AuthSessionSchema = z.object({
  nationalId: z.string().min(1),
  email: z.string().nullable(),
  mobile: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  accessToken: z.string().min(1),
});

/** Signed-in user stored in the encrypted session cookie. */
export type AuthSession = z.infer<typeof AuthSessionSchema>;

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const SSO_COOKIE_MAX_AGE_SECONDS = 60 * 10;

/**
 * Derives a 32-byte AES key from the application secret.
 * @param secret The secret used for cookie encryption.
 * @returns A SHA-256 digest used as the encryption key.
 */
const getKey = (secret: string) => createHash('sha256').update(secret).digest();

/**
 * Encrypts a session payload into a URL-safe cookie value.
 * @param session The authenticated user session.
 * @param secret The secret used for cookie encryption.
 * @returns The encrypted cookie payload.
 */
export const encryptSession = (session: AuthSession, secret: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(secret), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(session), 'utf-8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
};

/**
 * Decrypts a session cookie payload.
 * @param token The encrypted cookie value.
 * @param secret The secret used for cookie encryption.
 * @returns The session when valid, otherwise null.
 */
export const decryptSession = (token: string, secret: string): AuthSession | null => {
  const payload = Buffer.from(token, 'base64url');

  if (payload.length <= 28) {
    return null;
  }

  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);

  try {
    const decipher = createDecipheriv('aes-256-gcm', getKey(secret), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf-8');
    const parsed = AuthSessionSchema.safeParse(JSON.parse(json));

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

/**
 * Compares two strings in constant time.
 * @param left The first value.
 * @param right The second value.
 * @returns True when both values are equal.
 */
export const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

/**
 * Builds a random OAuth state value for CSRF protection.
 * @returns A 32-character hexadecimal state string.
 */
export const createOAuthState = () => randomBytes(16).toString('hex');

const getSessionSecret = () => Env.SIGNFLOW_CLIENT_SECRET;

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: Env.NODE_ENV === 'production',
  path: '/',
  maxAge,
});

/**
 * Writes the encrypted session cookie onto a response.
 * @param response The outgoing Next.js response.
 * @param session The authenticated user session.
 */
export const applySessionCookie = (response: NextResponse, session: AuthSession) => {
  response.cookies.set(
    SESSION_COOKIE,
    encryptSession(session, getSessionSecret()),
    cookieOptions(SESSION_MAX_AGE_SECONDS),
  );
};

/**
 * Writes short-lived SSO cookies used during the authorization redirect.
 * @param response The outgoing Next.js response.
 * @param state The OAuth state value.
 * @param locale The locale to restore after callback.
 */
export const applySsoCookies = (response: NextResponse, state: string, locale: string) => {
  const options = cookieOptions(SSO_COOKIE_MAX_AGE_SECONDS);

  response.cookies.set(SSO_STATE_COOKIE, state, options);
  response.cookies.set(SSO_LOCALE_COOKIE, locale, options);
};

/**
 * Removes session and SSO cookies from a response.
 * @param response The outgoing Next.js response.
 */
export const clearAuthCookies = (response: NextResponse) => {
  for (const name of AUTH_COOKIES) {
    response.cookies.delete(name);
  }
};

/**
 * Reads the current authenticated session from the request cookies.
 * @returns The session when present and valid, otherwise null.
 */
export const getSession = async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return token ? decryptSession(token, getSessionSecret()) : null;
};

/**
 * Requires an authenticated session and redirects to sign-in when missing.
 * @param locale The active locale used for the sign-in redirect.
 * @returns The authenticated session.
 */
export const requireSession = async (locale: string) => {
  const session = await getSession();

  if (!session) {
    redirect(localizePath('/sign-in', locale));
  }

  return session;
};
