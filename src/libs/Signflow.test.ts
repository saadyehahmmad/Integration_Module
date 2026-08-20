import { describe, expect, it } from 'vitest';
import { getSignflowCulture } from './Signflow';

describe('Signflow', () => {
  describe('culture mapping', () => {
    it('returns ar for Arabic locale', () => {
      expect(getSignflowCulture('ar')).toBe('ar');
    });

    it('returns en for other locales', () => {
      expect(getSignflowCulture('en')).toBe('en');
    });
  });
});
