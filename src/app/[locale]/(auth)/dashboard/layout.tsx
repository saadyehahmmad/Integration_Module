import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSession } from '@/libs/AuthSession';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: DashboardLayoutProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const session = await getSession();
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return (
    <BaseTemplate
      leftNav={
        <>
          <li>
            <Link href="/dashboard/" className="border-none text-stone-700 hover:text-stone-950">
              {t('dashboard_link')}
            </Link>
          </li>
          {session ? (
            <li>
              <Link
                href="/dashboard/user-profile/"
                className="border-none text-stone-700 hover:text-stone-950"
              >
                {t('user_profile_link')}
              </Link>
            </li>
          ) : null}
        </>
      }
      rightNav={
        <li>
          {session ? (
            <form action="/api/auth/logout" method="post">
              <input name="locale" type="hidden" value={locale} />
              <button className="border-none text-stone-700 hover:text-stone-950" type="submit">
                {t('sign_out')}
              </button>
            </form>
          ) : (
            <Link href="/sign-in/" className="border-none text-stone-700 hover:text-stone-950">
              {t('sign_in')}
            </Link>
          )}
        </li>
      }
    >
      {props.children}
    </BaseTemplate>
  );
}
