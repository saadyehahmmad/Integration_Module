import { getTranslations } from 'next-intl/server';
import { INTEGRATION_MODULES } from '@/modules/integrations/catalog';
import { IntegrationCard } from '@/modules/integrations/components/IntegrationCard';

/**
 * Integrations Module hub: service cards as discrete integration modules.
 * @returns The hub grid markup.
 */
export const IntegrationsHub = async () => {
  const t = await getTranslations('IntegrationsHub');

  return (
    <section className="space-y-8">
      <header className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-stone-500 uppercase">{t('eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">{t('title')}</h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600">{t('description')}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {INTEGRATION_MODULES.map((module) => (
          <IntegrationCard
            key={module.id}
            module={module}
            title={t(`modules.${module.id}.title`)}
            description={t(`modules.${module.id}.description`)}
            statusLabel={t(`status.${module.status}`)}
            openLabel={t('open_module')}
          />
        ))}
      </div>
    </section>
  );
};
