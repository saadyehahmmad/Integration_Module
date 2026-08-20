/**
 * SignFlow / GSB endpoint access levels for the SANAD integration UI.
 */
export type SignflowAccessLevel = 'ibm_only' | 'ibm_and_access_token' | 'ibm_and_oauth_secrets' | 'oauth_authorize';

export type SignflowEndpoint = {
  id: string;
  method: 'GET' | 'POST';
  host: 'signflow' | 'gsb';
  path: string;
  access: SignflowAccessLevel;
};

/**
 * Catalog of SignFlow endpoints and the credentials each call requires.
 * IBM-only means X-IBM-Client-Id / X-IBM-Client-Secret headers are sufficient.
 */
export const SIGNFLOW_ENDPOINTS: SignflowEndpoint[] = [
  {
    id: 'status',
    method: 'GET',
    host: 'gsb',
    path: '/signflow/v2/info/status/{NationalID}',
    access: 'ibm_only',
  },
  {
    id: 'introspect',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/introspect',
    access: 'ibm_and_access_token',
  },
  {
    id: 'userinfo',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/info/user',
    access: 'ibm_and_access_token',
  },
  {
    id: 'x509',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/info/x509',
    access: 'ibm_and_access_token',
  },
  {
    id: 'signature_image',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/signature',
    access: 'ibm_and_access_token',
  },
  {
    id: 'sign',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/sign',
    access: 'ibm_and_access_token',
  },
  {
    id: 'logout',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/logout',
    access: 'ibm_and_access_token',
  },
  {
    id: 'token',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/token',
    access: 'ibm_and_oauth_secrets',
  },
  {
    id: 'refresh',
    method: 'POST',
    host: 'gsb',
    path: '/signflow/v2/refresh',
    access: 'ibm_and_oauth_secrets',
  },
  {
    id: 'authorize',
    method: 'GET',
    host: 'signflow',
    path: '/signflow/v2/auth',
    access: 'oauth_authorize',
  },
];
