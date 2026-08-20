import { getTranslations } from 'next-intl/server';
import { getSession } from '@/libs/AuthSession';
import { Env } from '@/libs/Env';
import { Link } from '@/libs/I18nNavigation';
import { getSignflowRedirectUri } from '@/libs/Signflow';
import { IntegrationDetailsTable } from '@/modules/integrations/components/IntegrationDetailsTable';
import { IntegrationFlowSteps } from '@/modules/integrations/components/IntegrationFlowSteps';
import { IntegrationPanel } from '@/modules/integrations/components/IntegrationPanel';
import { IntegrationShell } from '@/modules/integrations/components/IntegrationShell';

type SanadIntegrationDetailProps = {
  locale: string;
};

/**
 * SANAD SSO module detail: endpoints, flow, and connect action.
 * @param props The active locale for translations and login redirect.
 * @returns The Sanad detail page.
 */
export const SanadIntegrationDetail = async (props: SanadIntegrationDetailProps) => {
  const t = await getTranslations({
    locale: props.locale,
    namespace: 'SanadIntegration',
  });
  const session = await getSession();

  const rows = [
    { label: t('fields.provider'), value: t('values.provider') },
    { label: t('fields.protocol'), value: t('values.protocol') },
    { label: t('fields.auth_url'), value: `${Env.SIGNFLOW_BASE_URL}/signflow/v2/auth` },
    { label: t('fields.token_url'), value: `${Env.SIGNFLOW_GSB_BASE_URL}/signflow/v2/token` },
    {
      label: t('fields.userinfo_url'),
      value: `${Env.SIGNFLOW_GSB_BASE_URL}/signflow/v2/info/user`,
    },
    { label: t('fields.logout_url'), value: `${Env.SIGNFLOW_GSB_BASE_URL}/signflow/v2/logout` },
    { label: t('fields.redirect_uri'), value: getSignflowRedirectUri() },
    { label: t('fields.client_id'), value: Env.SIGNFLOW_CLIENT_ID },
    { label: t('fields.pkce'), value: t('values.pkce') },
    { label: t('fields.status'), value: t('values.status_ready') },
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
            t('flow_steps.authorize'),
            t('flow_steps.callback'),
            t('flow_steps.token'),
            t('flow_steps.userinfo'),
            t('flow_steps.session'),
          ]}
        />
      </IntegrationPanel>

      {session ? (
        <IntegrationPanel title={t('connected_title')} tone="success">
          <p className="text-sm text-stone-700">{t('connected_as', { id: session.nationalId })}</p>
          <Link
            className="mt-4 inline-block text-sm font-medium text-stone-900 underline"
            href="/dashboard/user-profile/"
          >
            {t('view_profile')}
          </Link>
        </IntegrationPanel>
      ) : (
        <IntegrationPanel title={t('connect_title')}>
          <p className="text-sm text-stone-600">{t('connect_description')}</p>
          <a
            className="mt-5 inline-block bg-stone-950 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
            href={`/api/auth/login?locale=${props.locale}`}
          >
            {t('connect_button')}
          </a>
        </IntegrationPanel>
      )}
    </IntegrationShell>
  );
};
