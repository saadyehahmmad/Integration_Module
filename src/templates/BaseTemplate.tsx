import { useTranslations } from 'next-intl';
import { AppConfig } from '@/utils/AppConfig';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('BaseTemplate');

  return (
    <div className="w-full px-1 text-stone-700 antialiased">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-stone-300">
          <div className="pt-12 pb-6">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-950">
              {AppConfig.name}
            </h1>
            <h2 className="mt-2 text-base text-stone-600">{t('description')}</h2>
          </div>

          <div className="flex justify-between pb-4">
            <nav aria-label={t('main_navigation_label')}>
              <ul className="flex flex-wrap gap-x-5 text-base">{props.leftNav}</ul>
            </nav>

            <nav>
              <ul className="flex flex-wrap gap-x-5 text-base">{props.rightNav}</ul>
            </nav>
          </div>
        </header>

        <main>{props.children}</main>

        <footer className="border-t border-stone-300 py-8 text-center text-sm text-stone-500">
          {t('footer_text', {
            year: new Date().getFullYear(),
            name: AppConfig.name,
          })}
        </footer>
      </div>
    </div>
  );
};
