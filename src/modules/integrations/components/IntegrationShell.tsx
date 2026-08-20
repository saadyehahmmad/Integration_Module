import { Link } from '@/libs/I18nNavigation';
import type { IntegrationStatus } from '@/modules/integrations/catalog';

type IntegrationShellProps = {
  backLabel: string;
  title: string;
  description: string;
  badgeLabel: string;
  badgeTone: IntegrationStatus;
  children: React.ReactNode;
};

const badgeClassName: Record<IntegrationStatus, string> = {
  ready: 'bg-emerald-100 text-emerald-900',
  planned: 'bg-stone-200 text-stone-700',
  coming_soon: 'bg-amber-200 text-amber-950',
};

/**
 * Shared page chrome for an integration module detail view.
 * @param props Back link, title, description, badge, and children.
 * @returns The detail page shell.
 */
export const IntegrationShell = (props: IntegrationShellProps) => (
  <section className="space-y-8">
    <div>
      <Link className="text-sm text-stone-600 hover:text-stone-900" href="/dashboard/">
        ← {props.backLabel}
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">{props.title}</h1>
        <span
          className={`px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${badgeClassName[props.badgeTone]}`}
        >
          {props.badgeLabel}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">{props.description}</p>
    </div>
    {props.children}
  </section>
);
