import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/Helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = [
    '',
    '/dashboard',
    '/dashboard/integrations/sanad-sso',
    '/dashboard/integrations/otp',
    '/dashboard/integrations/sms',
    '/dashboard/integrations/google-recaptcha',
    '/sign-in',
    '/about',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
