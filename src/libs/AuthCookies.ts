/** Cookie names used by SANAD SSO and the encrypted session. */
export const SESSION_COOKIE = 'auth_session';
export const SSO_STATE_COOKIE = 'sso_state';
export const SSO_LOCALE_COOKIE = 'sso_locale';

export const AUTH_COOKIES = [SESSION_COOKIE, SSO_STATE_COOKIE, SSO_LOCALE_COOKIE] as const;
