'use client';

import { useTranslations } from 'next-intl';
import Script from 'next/script';
import { useState } from 'react';
import * as z from 'zod';
import { executeRecaptcha, getRecaptchaScriptUrl } from '@/modules/recaptcha/client';

const DEMO_ACTION = 'integrations_demo';

const VerifyResponseSchema = z.object({
  success: z.boolean().optional(),
  score: z.number().nullable().optional(),
});

type RecaptchaDemoFormProps = {
  siteKey: string;
};

/**
 * Runs a live reCAPTCHA v3 check against the local verify API.
 * @param props The public site key used to load and execute reCAPTCHA.
 * @returns The demo form UI.
 */
export const RecaptchaDemoForm = (props: RecaptchaDemoFormProps) => {
  const t = useTranslations('RecaptchaIntegration');
  const [scriptReady, setScriptReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    if (!scriptReady) {
      setIsError(true);
      setMessage(t('demo_error_loading'));
      return;
    }

    setPending(true);

    try {
      const token = await executeRecaptcha({ siteKey: props.siteKey, action: DEMO_ACTION });
      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: DEMO_ACTION }),
      });
      const parsed = VerifyResponseSchema.safeParse(await response.json());
      const payload = parsed.success ? parsed.data : null;

      if (!response.ok || !payload?.success) {
        setIsError(true);
        setMessage(
          payload?.score === null || payload?.score === undefined
            ? t('demo_error_failed')
            : t('demo_error_score', { score: String(payload.score) }),
        );
        setPending(false);
        return;
      }

      setMessage(t('demo_success', { score: String(payload.score ?? 'n/a') }));
    } catch {
      setIsError(true);
      setMessage(t('demo_error_failed'));
    }

    setPending(false);
  };

  return (
    <>
      <Script
        src={getRecaptchaScriptUrl(props.siteKey)}
        strategy="afterInteractive"
        onReady={() => {
          setScriptReady(true);
        }}
      />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="text-sm text-stone-600">{t('demo_description')}</p>
        <button
          className="bg-stone-950 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          disabled={pending || !scriptReady}
          type="submit"
        >
          {pending ? t('demo_pending') : t('demo_button')}
        </button>
        {message ? (
          <p className={`text-sm ${isError ? 'text-red-700' : 'text-emerald-800'}`}>{message}</p>
        ) : null}
      </form>
    </>
  );
};
