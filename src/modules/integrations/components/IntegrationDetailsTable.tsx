type IntegrationDetailRow = {
  label: string;
  value: string;
};

type IntegrationDetailsTableProps = {
  rows: IntegrationDetailRow[];
};

/**
 * Key/value table for integration configuration fields.
 * @param props The detail rows to render.
 * @returns The definition list markup.
 */
export const IntegrationDetailsTable = (props: IntegrationDetailsTableProps) => (
  <dl className="divide-y divide-stone-200">
    {props.rows.map((row) => (
      <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4" key={row.label}>
        <dt className="text-sm text-stone-500">{row.label}</dt>
        <dd className="font-mono text-sm break-all text-stone-900">{row.value}</dd>
      </div>
    ))}
  </dl>
);
