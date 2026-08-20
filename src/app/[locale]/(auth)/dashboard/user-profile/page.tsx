import { getTranslations, setRequestLocale } from 'next-intl/server';
import { requireSession } from '@/libs/AuthSession';

export default async function UserProfilePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const session = await requireSession(locale);
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return (
    <div className="my-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-stone-500">{t('national_id_label')}</dt>
          <dd>{session.nationalId}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">{t('email_label')}</dt>
          <dd>{session.email ?? t('empty_value')}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">{t('mobile_label')}</dt>
          <dd>{session.mobile ?? t('empty_value')}</dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">{t('date_of_birth_label')}</dt>
          <dd>{session.dateOfBirth ?? t('empty_value')}</dd>
        </div>
      </dl>
    </div>
  );
}
