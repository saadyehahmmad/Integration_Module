import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/libs/I18nNavigation';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IndexPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#e7e5e4_0%,_transparent_55%),linear-gradient(180deg,#fafaf9_0%,#f5f5f4_100%)]"
      />
      <p className="text-sm font-medium tracking-wide text-stone-500 uppercase">{t('eyebrow')}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t('description')}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="bg-stone-950 px-5 py-3 text-sm font-medium text-white hover:bg-stone-800"
          href="/dashboard/"
        >
          {t('cta_label')}
        </Link>
        <Link
          className="border border-stone-400 bg-white px-5 py-3 text-sm font-medium text-stone-900 hover:border-stone-700"
          href="/dashboard/integrations/sanad-sso/"
        >
          {t('sanad_cta')}
        </Link>
      </div>
    </section>
  );
}
