import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  return (
    <BaseTemplate
      leftNav={
        <>
          <li>
            <Link href="/" className="border-none text-stone-700 hover:text-stone-950">
              {t('home_link')}
            </Link>
          </li>
          <li>
            <Link href="/dashboard/" className="border-none text-stone-700 hover:text-stone-950">
              {t('integrations_link')}
            </Link>
          </li>
        </>
      }
      rightNav={
        <li>
          <Link href="/sign-in/" className="border-none text-stone-700 hover:text-stone-950">
            {t('sign_in_link')}
          </Link>
        </li>
      }
    >
      <div className="py-8 text-xl [&_p]:my-6">{props.children}</div>
    </BaseTemplate>
  );
}
