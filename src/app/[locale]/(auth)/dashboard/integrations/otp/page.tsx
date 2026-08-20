import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlannedIntegrationDetail } from '@/modules/integrations/planned/Detail';

type OtpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: OtpPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'IntegrationsHub',
  });

  return {
    title: t('modules.otp.title'),
    description: t('modules.otp.description'),
  };
}

export default async function OtpIntegrationPage(props: OtpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5">
      <PlannedIntegrationDetail locale={locale} moduleId="otp" />
    </div>
  );
}
