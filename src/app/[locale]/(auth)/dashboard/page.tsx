import { setRequestLocale } from 'next-intl/server';
import { IntegrationsHub } from '@/modules/integrations/components/IntegrationsHub';

export default async function DashboardPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="py-5">
      <IntegrationsHub />
    </div>
  );
}
