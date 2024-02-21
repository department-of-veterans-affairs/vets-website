import environment from 'platform/utilities/environment';
import { AUTH_ERRORS } from 'platform/user/authentication/errors';

export const ALL_STATE_AND_VERIFIERS = [
  'state',
  'idme_signup_state',
  'logingov_signup_state',
  'code_verifier',
  'idme_signup_code_verifier',
  'logingov_signup_code_verifier',
];

const SIS_API_VERSION = 'v0';
export const OAUTH_ENDPOINTS = {
  TOKEN: 'token',
  AUTHORIZE: 'authorize',
  REFRESH: 'refresh',
};

export const API_SIGN_IN_SERVICE_URL = ({
  version = SIS_API_VERSION,
  type = '',
  endpoint = OAUTH_ENDPOINTS.AUTHORIZE,
}) =>
  `${environment.API_URL}/${version}/sign_in/${endpoint}${type &&
    `?type=${type}`}`;

export const CLIENT_IDS = {
  VAWEB: 'vaweb',
  VAMOBILE: 'vamobile',
  VAMOCK: 'vamock',
};

export const COOKIES = {
  INFO_TOKEN: 'vagov_info_token',
  CI: 'ci',
};

export const OAUTH_KEYS = {
  CLIENT_ID: 'client_id',
  CODE_CHALLENGE: 'code_challenge',
  CODE_CHALLENGE_METHOD: 'code_challenge_method',
  REDIRECT_URI: 'redirect_uri',
  RESPONSE_TYPE: 'response_type',
  STATE: 'state',
  GRANT_TYPE: 'grant_type',
  CODE: 'code',
  CODE_VERIFIER: 'code_verifier',
  ACR: 'acr',
};

export const OPERATIONS = {
  SIGNUP: 'sign_up',
};

export const OAUTH_ALLOWED_PARAMS = {
  CODE: 'code',
  S256: 'S256',
  AUTH_CODE: 'authorization_code',
  OPERATION: 'operation',
};

const generateOAuthKeysWithout = array =>
  Object.keys(OAUTH_KEYS).reduce(
    (acc, cv) => ({
      ...acc,
      ...(!array.includes(cv) && { [cv]: OAUTH_KEYS[cv] }),
    }),
    {},
  );

export const AUTHORIZE_KEYS_WEB = generateOAuthKeysWithout([
  'GRANT_TYPE',
  'CODE_VERIFIER',
  'CODE',
  'REDIRECT_URI',
]);

export const AUTHORIZE_KEYS_MOBILE = generateOAuthKeysWithout([
  'GRANT_TYPE',
  'CODE_VERIFIER',
  'CODE',
  'STATE',
  'REDIRECT_URI',
]);

export const OAUTH_ERRORS = {
  OAUTH_DEFAULT_ERROR: '201', // default
  OAUTH_STATE_MISMATCH: '202', // state mismatch
  OAUTH_INVALID_REQUEST: '203', // invalid request/missing param
  OAUTH_UNAUTHORIZED_CLIENT: '204', // client not registered
  OAUTH_ACCESS_DENIED: '205', // client not authorized
  OAUTH_RT_UNSUPPORTED: '206', // response type unsupported
};

export const OAUTH_EVENTS = {
  ERROR_DEFAULT: 'login-error-oauth-default',
  OAUTH_ERRORS_STATE_MISMATCH: 'login-error-oauth-state-mismatch',
  OAUTH_ERRORS_USER_FETCH: 'login-error-oauth-user-fetch',
  'Code is not valid': 'login-error-oauth-code-not-valid',
  'Code is not defined': 'login-error-oauth-code-not-defined',
  'State is not defined': 'login-error-oauth-state-not-defined',
  'Code Verifier is not defined': 'login-error-oauth-cv-not-defined',
  'Grant Type is not defined': 'login-error-oauth-grant-type-not-defined', // Refresh
  'Refresh token is not defined': 'login-error-oauth-refresh-token-not-defined',
};

export const OAUTH_ERROR_RESPONSES = {
  // Callback
  'Code is not valid': AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode,
  'Code is not defined': AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode,
  'State is not defined': AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode,
  'State mismatches client side': AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode,
  // Token Exchange
  'Code Verifier is not defined': AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode,
  'Grant Type is not defined': AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode,
  // Refresh
  'Refresh token is not defined': AUTH_ERRORS.OAUTH_INVALID_REQUEST.errorCode,
  // Default | Unknown
  default: AUTH_ERRORS.OAUTH_DEFAULT_ERROR.errorCode,
};
