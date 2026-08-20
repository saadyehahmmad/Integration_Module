import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlannedIntegrationDetail } from '@/modules/integrations/planned/Detail';

type SmsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: SmsPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'IntegrationsHub',
  });

  return {
    title: t('modules.sms.title'),
    description: t('modules.sms.description'),
  };
}

export default async function SmsIntegrationPage(props: SmsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5">
      <PlannedIntegrationDetail locale={locale} moduleId="sms" />
    </div>
  );
}
