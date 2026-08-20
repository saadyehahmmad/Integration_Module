import { getTranslations } from 'next-intl/server';
import type { PlannedIntegrationId } from '@/modules/integrations/catalog';
import { IntegrationPanel } from '@/modules/integrations/components/IntegrationPanel';
import { IntegrationShell } from '@/modules/integrations/components/IntegrationShell';

type PlannedIntegrationDetailProps = {
  locale: string;
  moduleId: PlannedIntegrationId;
};

/**
 * Placeholder detail view for planned integration modules.
 * @param props Locale and planned module identifier.
 * @returns The planned module detail page.
 */
export const PlannedIntegrationDetail = async (props: PlannedIntegrationDetailProps) => {
  const t = await getTranslations({
    locale: props.locale,
    namespace: 'PlannedIntegration',
  });
  const moduleT = await getTranslations({
    locale: props.locale,
    namespace: 'IntegrationsHub',
  });

  return (
    <IntegrationShell
      backLabel={t('back_to_hub')}
      title={moduleT(`modules.${props.moduleId}.title`)}
      description={moduleT(`modules.${props.moduleId}.description`)}
      badgeLabel={moduleT('status.planned')}
      badgeTone="planned"
    >
      <IntegrationPanel title={moduleT(`modules.${props.moduleId}.title`)} tone="muted">
        <p className="text-sm text-stone-700">{t('body')}</p>
      </IntegrationPanel>
    </IntegrationShell>
  );
};
