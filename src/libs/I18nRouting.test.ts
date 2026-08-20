import { describe, expect, it } from 'vitest';
import { isDashboardPath, localizePath, localizedUrl, resolveLocale, routing } from './I18nRouting';

describe('I18nRouting', () => {
  describe('locale helpers', () => {
    it('resolves the default locale and rejects unknown locales', () => {
      expect(resolveLocale('en')).toBe('en');
      expect(resolveLocale('de')).toBe(routing.defaultLocale);
      expect(resolveLocale()).toBe(routing.defaultLocale);
    });

    it('keeps paths unprefixed for the default locale', () => {
      expect(localizePath('/sign-in', routing.defaultLocale)).toBe('/sign-in');
    });

    it('identifies dashboard paths', () => {
      expect(isDashboardPath('/dashboard')).toBeTruthy();
      expect(isDashboardPath('/dashboard/user-profile')).toBeTruthy();
      expect(isDashboardPath('/about')).toBeFalsy();
    });

    it('builds an absolute URL with query params', () => {
      expect(
        localizedUrl('http://localhost:3000', '/sign-in', 'en', { error: 'token' }).toString(),
      ).toBe('http://localhost:3000/sign-in?error=token');
    });
  });
});
