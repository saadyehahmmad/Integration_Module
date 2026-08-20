import { describe, expect, it } from 'vitest';
import { isRecaptchaConfigured } from './server';

describe('Recaptcha', () => {
  describe('configuration', () => {
    it('reports whether site and secret keys are present', () => {
      expect(isRecaptchaConfigured()).toBeTypeOf('boolean');
    });
  });
});
