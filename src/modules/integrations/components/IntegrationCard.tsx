import { Link } from '@/libs/I18nNavigation';
import type { IntegrationModule, IntegrationStatus } from '@/modules/integrations/catalog';

type IntegrationCardProps = {
  module: IntegrationModule;
  title: string;
  description: string;
  statusLabel: string;
  openLabel: string;
};

const statusClassName: Record<IntegrationStatus, string> = {
  ready: 'bg-emerald-100 text-emerald-900',
  planned: 'bg-stone-200 text-stone-700',
  coming_soon: 'bg-amber-200 text-amber-950 ring-2 ring-amber-400',
};

const cardClassName: Record<IntegrationStatus, string> = {
  ready: 'border-emerald-700/30 bg-white hover:border-emerald-700',
  planned: 'border-stone-300 bg-white hover:border-stone-500',
  coming_soon: 'border-amber-400 bg-amber-50/80 opacity-95',
};

/**
 * Renders a single integration service card for the hub grid.
 * @param props Module metadata and localized labels.
 * @returns The card markup.
 */
export const IntegrationCard = (props: IntegrationCardProps) => {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-stone-900">{props.title}</h2>
        <span
          className={`shrink-0 px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${statusClassName[props.module.status]}`}
        >
          {props.statusLabel}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">{props.description}</p>
      {props.module.href ? (
        <p className="mt-6 text-sm font-medium text-stone-900">{props.openLabel} →</p>
      ) : null}
    </>
  );

  const sharedClass = `block h-full border p-6 transition-colors ${cardClassName[props.module.status]}`;

  if (props.module.href && props.module.status !== 'coming_soon') {
    return (
      <Link className={sharedClass} href={props.module.href}>
        {body}
      </Link>
    );
  }

  return (
    <div aria-disabled="true" className={`${sharedClass} cursor-not-allowed`}>
      {body}
    </div>
  );
};
