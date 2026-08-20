/**
 * Catalog of integration services exposed by the Integrations Module.
 */
export type IntegrationStatus = 'ready' | 'planned' | 'coming_soon';

type IntegrationId = 'otp' | 'sms' | 'call-center' | 'sanad-sso' | 'google-recaptcha';

export type IntegrationModule = {
  id: IntegrationId;
  href: string | null;
  status: IntegrationStatus;
};

/** Ordered list of integration modules shown on the hub. */
export const INTEGRATION_MODULES: IntegrationModule[] = [
  { id: 'otp', href: '/dashboard/integrations/otp', status: 'planned' },
  { id: 'sms', href: '/dashboard/integrations/sms', status: 'planned' },
  { id: 'call-center', href: null, status: 'coming_soon' },
  { id: 'sanad-sso', href: '/dashboard/integrations/sanad-sso', status: 'ready' },
  { id: 'google-recaptcha', href: '/dashboard/integrations/google-recaptcha', status: 'ready' },
];

/** Planned modules that open a placeholder detail page. */
export type PlannedIntegrationId = 'otp' | 'sms';
