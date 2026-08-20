import * as z from 'zod';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import { getBaseUrl } from '@/utils/Helpers';

const optionalText = z
  .union([z.string(), z.number()])
  .optional()
  .nullable()
  .transform((value) => (value === null || value === undefined ? null : String(value)));

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
});

const UserInfoSchema = z.object({
  username: z.union([z.string(), z.number()]).transform(String),
  mail: optionalText,
  mobile: optionalText,
  dateOfBirth: z.string().optional().nullable(),
});

/**
 * Resolves the OAuth callback URI registered with SignFlow.
 * @returns The absolute callback URL.
 */
export const getSignflowRedirectUri = () =>
  Env.SIGNFLOW_REDIRECT_URI ?? `${getBaseUrl()}/api/auth/callback`;

/**
 * Maps the app locale to a SignFlow culture value.
 * @param locale The active application locale.
 * @returns `ar` or `en`, the cultures supported by SignFlow.
 */
export const getSignflowCulture = (locale: string): 'ar' | 'en' => (locale === 'ar' ? 'ar' : 'en');

/**
 * Builds the SignFlow authorization URL for SANAD login.
 * @param options The OAuth state and app locale.
 * @returns The absolute authorization URL.
 */
export const buildAuthorizationUrl = (options: { state: string; locale: string }) => {
  const authUrl = new URL('/signflow/v2/auth', Env.SIGNFLOW_BASE_URL);
  const params = {
    client_id: Env.SIGNFLOW_CLIENT_ID,
    redirect_uri: getSignflowRedirectUri(),
    state: options.state,
    challenge: Env.SIGNFLOW_PKCE_CHALLENGE,
    culture: getSignflowCulture(options.locale),
  };

  for (const [key, value] of Object.entries(params)) {
    authUrl.searchParams.set(key, value);
  }

  return authUrl.toString();
};

const gsbHeaders = () => ({
  'Content-Type': 'application/json',
  'X-IBM-Client-Id': Env.SIGNFLOW_IBM_CLIENT_ID,
  'X-IBM-Client-Secret': Env.SIGNFLOW_IBM_CLIENT_SECRET,
});

/**
 * Posts JSON to a SignFlow GSB endpoint.
 * @param path The SignFlow path under the GSB base URL.
 * @param body The JSON request body.
 * @returns The HTTP response when the request succeeds, otherwise null.
 */
const postGsb = async (path: string, body: unknown) => {
  try {
    const response = await fetch(`${Env.SIGNFLOW_GSB_BASE_URL}${path}`, {
      method: 'POST',
      headers: gsbHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      logger.warn('SignFlow request failed', { path, status: response.status });
      return null;
    }

    return response;
  } catch {
    logger.warn('SignFlow could not reach the provider', { path });
    return null;
  }
};

/**
 * Posts JSON to SignFlow and parses the response with a Zod schema.
 * @param path The SignFlow path under the GSB base URL.
 * @param body The JSON request body.
 * @param schema The expected response schema.
 * @returns The parsed payload when valid, otherwise null.
 */
const postGsbJson = async <T>(path: string, body: unknown, schema: z.ZodType<T>) => {
  const response = await postGsb(path, body);

  if (!response) {
    return null;
  }

  const parsed = schema.safeParse(await response.json());

  if (!parsed.success) {
    logger.warn('SignFlow response is invalid', { path });
    return null;
  }

  return parsed.data;
};

/**
 * Exchanges an authorization code for a SignFlow access token.
 * @param code The authorization code from the SignFlow callback.
 * @returns The token payload when the exchange succeeds, otherwise null.
 */
export const exchangeAuthorizationCode = async (code: string) =>
  await postGsbJson(
    '/signflow/v2/token',
    {
      client_id: Env.SIGNFLOW_CLIENT_ID,
      client_secret: Env.SIGNFLOW_CLIENT_SECRET,
      code,
      redirect_uri: getSignflowRedirectUri(),
      verifier: Env.SIGNFLOW_PKCE_VERIFIER,
    },
    TokenResponseSchema,
  );

/**
 * Loads identity attributes for the authenticated SANAD user.
 * @param accessToken The SignFlow access token.
 * @returns The user profile when available, otherwise null.
 */
export const fetchSignflowUser = async (accessToken: string) =>
  await postGsbJson('/signflow/v2/info/user', { access_token: accessToken }, UserInfoSchema);

/**
 * Revokes a SignFlow access token on logout.
 * @param accessToken The SignFlow access token to revoke.
 */
export const revokeSignflowToken = async (accessToken: string) => {
  await postGsb('/signflow/v2/logout', { access_token: accessToken });
};
