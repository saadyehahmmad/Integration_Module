declare global {
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Executes Google reCAPTCHA v3 in the browser and returns a token.
 * @param options Site key and action label passed to grecaptcha.execute.
 * @returns A short-lived reCAPTCHA token.
 * @throws {Error} When the Google script is unavailable.
 */
export const executeRecaptcha = async (options: {
  siteKey: string;
  action: string;
}): Promise<string> => {
  if (!window.grecaptcha) {
    throw new Error('grecaptcha_unavailable');
  }

  const { grecaptcha } = window;

  // grecaptcha.ready is callback-based; wrapping is required.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise<void>((resolve) => {
    grecaptcha.ready(() => {
      resolve();
    });
  });

  return await grecaptcha.execute(options.siteKey, { action: options.action });
};

/**
 * Builds the Google reCAPTCHA v3 script URL for a site key.
 * @param siteKey The public reCAPTCHA site key.
 * @returns The absolute script URL.
 */
export const getRecaptchaScriptUrl = (siteKey: string) =>
  `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
