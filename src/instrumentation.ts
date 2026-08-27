import * as Sentry from '@sentry/nextjs';

export function register() {
  // Sentry initialization is disabled by the reduced environment contract.
}

export const onRequestError = Sentry.captureRequestError;
