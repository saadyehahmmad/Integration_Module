import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SanadIntegrationDetail } from '@/modules/integrations/sanad/Detail';

type SanadSsoPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: SanadSsoPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SanadIntegration',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SanadSsoPage(props: SanadSsoPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5">
      <SanadIntegrationDetail locale={locale} />
    </div>
  );
}
