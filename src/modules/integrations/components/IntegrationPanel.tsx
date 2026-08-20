type IntegrationPanelProps = {
  title: string;
  tone?: 'default' | 'muted' | 'success';
  children: React.ReactNode;
};

const toneClassName = {
  default: 'border-stone-300 bg-white',
  muted: 'border-stone-300 bg-stone-50',
  success: 'border-emerald-700/30 bg-emerald-50',
} as const;

/**
 * Content panel used inside an integration detail page.
 * @param props Panel title, optional tone, and children.
 * @returns The panel markup.
 */
export const IntegrationPanel = (props: IntegrationPanelProps) => (
  <div className={`border p-6 ${toneClassName[props.tone ?? 'default']}`}>
    <h2 className="text-lg font-semibold text-stone-900">{props.title}</h2>
    <div className="mt-4">{props.children}</div>
  </div>
);
