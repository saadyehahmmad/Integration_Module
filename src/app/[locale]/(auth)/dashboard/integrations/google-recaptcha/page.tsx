import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RecaptchaIntegrationDetail } from '@/modules/recaptcha/Detail';

type GoogleRecaptchaPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: GoogleRecaptchaPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'RecaptchaIntegration',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function GoogleRecaptchaIntegrationPage(props: GoogleRecaptchaPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5">
      <RecaptchaIntegrationDetail locale={locale} />
    </div>
  );
}
