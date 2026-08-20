import { getTranslations } from 'next-intl/server';
import { Env } from '@/libs/Env';
import { IntegrationDetailsTable } from '@/modules/integrations/components/IntegrationDetailsTable';
import { IntegrationFlowSteps } from '@/modules/integrations/components/IntegrationFlowSteps';
import { IntegrationPanel } from '@/modules/integrations/components/IntegrationPanel';
import { IntegrationShell } from '@/modules/integrations/components/IntegrationShell';
import { RecaptchaDemoForm } from '@/modules/recaptcha/DemoForm';
import {
  getRecaptchaSiteKey,
  getRecaptchaSiteverifyUrl,
  isRecaptchaConfigured,
} from '@/modules/recaptcha/server';

type RecaptchaIntegrationDetailProps = {
  locale: string;
};

/**
 * Google reCAPTCHA module detail: config, flow, and live verification demo.
 * @param props The active locale for translations.
 * @returns The reCAPTCHA detail page.
 */
export const RecaptchaIntegrationDetail = async (props: RecaptchaIntegrationDetailProps) => {
  const t = await getTranslations({
    locale: props.locale,
    namespace: 'RecaptchaIntegration',
  });
  const configured = isRecaptchaConfigured();
  const siteKey = getRecaptchaSiteKey();

  const rows = [
    { label: t('fields.provider'), value: t('values.provider') },
    { label: t('fields.version'), value: t('values.version') },
    { label: t('fields.verify_url'), value: getRecaptchaSiteverifyUrl() },
    { label: t('fields.app_verify_url'), value: '/api/recaptcha/verify' },
    { label: t('fields.site_key'), value: siteKey ?? t('values.not_set') },
    {
      label: t('fields.secret_key'),
      value: Env.RECAPTCHA_SECRET_KEY ? t('values.secret_configured') : t('values.not_set'),
    },
    { label: t('fields.min_score'), value: String(Env.RECAPTCHA_MIN_SCORE) },
    {
      label: t('fields.status'),
      value: configured ? t('values.status_ready') : t('values.status_needs_keys'),
    },
  ];

  return (
    <IntegrationShell
      backLabel={t('back_to_hub')}
      title={t('title')}
      description={t('description')}
      badgeLabel={t('badge_ready')}
      badgeTone="ready"
    >
      <IntegrationPanel title={t('details_title')}>
        <IntegrationDetailsTable rows={rows} />
      </IntegrationPanel>

      <IntegrationPanel title={t('flow_title')} tone="muted">
        <IntegrationFlowSteps
          steps={[
            t('flow_steps.load'),
            t('flow_steps.execute'),
            t('flow_steps.verify'),
            t('flow_steps.score'),
          ]}
        />
      </IntegrationPanel>

      <IntegrationPanel title={t('demo_title')}>
        {configured && siteKey ? (
          <RecaptchaDemoForm siteKey={siteKey} />
        ) : (
          <p className="text-sm text-stone-700">{t('setup_body')}</p>
        )}
      </IntegrationPanel>
    </IntegrationShell>
  );
};
