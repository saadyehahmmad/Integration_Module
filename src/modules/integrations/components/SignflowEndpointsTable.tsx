import type { SignflowAccessLevel, SignflowEndpoint } from '@/modules/integrations/sanad/endpoints';

type SignflowEndpointsTableProps = {
  endpoints: SignflowEndpoint[];
  baseUrls: { signflow: string; gsb: string };
  labels: {
    method: string;
    endpoint: string;
    access: string;
    accessLevels: Record<SignflowAccessLevel, string>;
  };
};

const accessClassName: Record<SignflowAccessLevel, string> = {
  ibm_only: 'bg-emerald-100 text-emerald-900',
  ibm_and_access_token: 'bg-amber-100 text-amber-950',
  ibm_and_oauth_secrets: 'bg-stone-200 text-stone-800',
  oauth_authorize: 'bg-sky-100 text-sky-950',
};

/**
 * Builds the absolute URL for a catalogued SignFlow endpoint.
 * @param endpoint The endpoint definition.
 * @param baseUrls SignFlow Web UI and GSB base URLs.
 * @returns Absolute URL string.
 */
const resolveEndpointUrl = (
  endpoint: SignflowEndpoint,
  baseUrls: SignflowEndpointsTableProps['baseUrls'],
) => `${endpoint.host === 'gsb' ? baseUrls.gsb : baseUrls.signflow}${endpoint.path}`;

/**
 * Table of SignFlow endpoints with required credential access level.
 * @param props Endpoint list, base URLs, and localized labels.
 * @returns The endpoints table markup.
 */
export const SignflowEndpointsTable = (props: SignflowEndpointsTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[36rem] text-left text-sm">
      <thead>
        <tr className="border-b border-stone-200 text-stone-500">
          <th className="py-2 pr-4 font-medium">{props.labels.method}</th>
          <th className="py-2 pr-4 font-medium">{props.labels.endpoint}</th>
          <th className="py-2 font-medium">{props.labels.access}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200">
        {props.endpoints.map((endpoint) => (
          <tr key={endpoint.id}>
            <td className="py-3 pr-4 font-mono text-stone-800">{endpoint.method}</td>
            <td className="py-3 pr-4 font-mono break-all text-stone-900">
              {resolveEndpointUrl(endpoint, props.baseUrls)}
            </td>
            <td className="py-3">
              <span
                className={`inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${accessClassName[endpoint.access]}`}
              >
                {props.labels.accessLevels[endpoint.access]}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
