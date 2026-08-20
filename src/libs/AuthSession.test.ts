import { describe, expect, it } from 'vitest';
import { createOAuthState, decryptSession, encryptSession, safeEqual } from './AuthSession';

const secret = 'unit-test-auth-secret-key-32chars';

const session = {
  nationalId: '999999999',
  email: 'user@example.com',
  mobile: '00962790000000',
  dateOfBirth: '1990-01-01',
  accessToken: 'access-token',
};

describe('AuthSession', () => {
  describe('session encryption', () => {
    it('round-trips a session with the same secret', () => {
      const token = encryptSession(session, secret);

      expect(decryptSession(token, secret)).toStrictEqual(session);
    });

    it('returns null when the secret does not match', () => {
      const token = encryptSession(session, secret);

      expect(decryptSession(token, 'different-secret-value-32chars!!')).toBeNull();
    });

    it('returns null for a malformed token', () => {
      expect(decryptSession('not-a-valid-token', secret)).toBeNull();
    });
  });

  describe('constant-time compare', () => {
    it('returns true for identical strings', () => {
      expect(safeEqual('abc', 'abc')).toBeTruthy();
    });

    it('returns false for different strings', () => {
      expect(safeEqual('abc', 'abd')).toBeFalsy();
      expect(safeEqual('abc', 'ab')).toBeFalsy();
    });
  });

  describe('oauth state', () => {
    it('returns a 32 character hexadecimal string', () => {
      expect(createOAuthState()).toMatch(/^[0-9a-f]{32}$/u);
    });
  });
});
