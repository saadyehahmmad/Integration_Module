import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getSession } from '@/libs/AuthSession';
import { getI18nPath } from '@/utils/Helpers';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
};

const errorKeyByCode = {
  interrupted: 'error_interrupted',
  incorrect_login_credentials: 'error_credentials',
} as const;

/**
 * Resolves a SignFlow error code to a translation key.
 * @param error The error query value from SignFlow or the callback route.
 * @returns A SignIn namespace key for the error message.
 */
const getSignInErrorKey = (error: string | undefined) => {
  if (error === 'interrupted' || error === 'incorrect_login_credentials') {
    return errorKeyByCode[error];
  }

  if (error) {
    return 'error_generic';
  }

  return null;
};

export async function generateMetadata(props: SignInPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignInPage(props: SignInPageProps) {
  const { locale } = await props.params;
  const { error } = await props.searchParams;
  setRequestLocale(locale);

  const session = await getSession();

  if (session) {
    redirect(getI18nPath('/dashboard', locale));
  }

  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });
  const errorKey = getSignInErrorKey(error);

  return (
    <div className="w-full max-w-md rounded border border-gray-300 p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      <p className="mt-3 text-gray-600">{t('description')}</p>
      {errorKey ? <p className="mt-4 text-red-700">{t(errorKey)}</p> : null}
      <a
        className="mt-6 inline-block rounded bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
        href={`/api/auth/login?locale=${locale}`}
      >
        {t('sanad_button')}
      </a>
    </div>
  );
}
