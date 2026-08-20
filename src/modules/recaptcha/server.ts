import * as z from 'zod';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';

const SITEVERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

const SiteVerifySchema = z.object({
  success: z.boolean(),
  score: z.number().optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
});

export type RecaptchaVerifyResult = {
  success: boolean;
  score: number | null;
  action: string | null;
  hostname: string | null;
  errorCodes: string[];
};

/**
 * Returns true when both reCAPTCHA site and secret keys are configured.
 * @returns Whether the reCAPTCHA module can run live verification.
 */
export const isRecaptchaConfigured = () =>
  Boolean(Env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && Env.RECAPTCHA_SECRET_KEY);

/**
 * Public site key for browser script loading, when configured.
 * @returns The site key or null.
 */
export const getRecaptchaSiteKey = () => Env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? null;

/**
 * Google siteverify endpoint used by this module.
 * @returns The absolute Google verify URL.
 */
export const getRecaptchaSiteverifyUrl = () => SITEVERIFY_URL;

/**
 * Verifies a reCAPTCHA v3 token with Google's siteverify endpoint.
 * @param options The client token and expected action name.
 * @returns The verification result, or null when the provider cannot be reached.
 */
export const verifyRecaptchaToken = async (options: {
  token: string;
  expectedAction?: string;
}): Promise<RecaptchaVerifyResult | null> => {
  if (!Env.RECAPTCHA_SECRET_KEY) {
    return null;
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: Env.RECAPTCHA_SECRET_KEY,
        response: options.token,
      }),
    });

    if (!response.ok) {
      logger.warn('reCAPTCHA siteverify HTTP failure', { status: response.status });
      return null;
    }

    const parsed = SiteVerifySchema.safeParse(await response.json());

    if (!parsed.success) {
      logger.warn('reCAPTCHA siteverify response is invalid');
      return null;
    }

    const score = parsed.data.score ?? null;
    const action = parsed.data.action ?? null;
    const actionMatches = !options.expectedAction || !action || action === options.expectedAction;
    const scorePasses = score === null || score >= Env.RECAPTCHA_MIN_SCORE;

    return {
      success: parsed.data.success && actionMatches && scorePasses,
      score,
      action,
      hostname: parsed.data.hostname ?? null,
      errorCodes: parsed.data['error-codes'] ?? [],
    };
  } catch {
    logger.warn('reCAPTCHA siteverify could not reach Google');
    return null;
  }
};
