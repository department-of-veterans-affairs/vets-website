import React from 'react';
import environment from '../../utilities/environment';
import {
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
  oracleHealthEnvPrefixes,
} from '../../utilities/sso/constants';

export const API_VERSION = 'v1';
export const FORCE_NEEDED = 'force-needed';

export const API_SESSION_URL = ({ version = API_VERSION, type = null }) => {
  if (!type) {
    throw new Error('Attempted to call API_SESSION_URL without a type');
  }
  return `${environment.API_URL}/${version}/sessions/${type}/new`;
};

export const AUTH_EVENTS = {
  MOCK_LOGIN: 'mock-login-link-clicked-modal',
  MODAL_LOGIN: 'login-link-clicked-modal',
  LOGIN: 'login-link-clicked',
  SSO_LOGIN: 'sso-automatic-login',
  SSO_LOGOUT: 'sso-automatic-logout',
  MFA: 'multifactor-link-clicked',
  VERIFY: 'verify-link-clicked',
  LOGOUT: 'logout-link-clicked',
  REGISTER: 'register-link-clicked',
  ERROR_USER_FETCH: 'login-error-user-fetch',
  ERROR_FORCE_NEEDED: 'login-failed-force-needed',
  OAUTH_LOGIN: 'login-oauth-success',
  OAUTH_LOGOUT: 'logout-oauth-link-clicked',
  OAUTH_ERROR_DEFAULT: 'login-error-oauth-default',
  OAUTH_ERROR_STATE_MISMATCH: 'login-error-oauth-state-mismatch',
  OAUTH_ERROR_USER_FETCH: 'login-error-oauth-user-fetch',
};

export const CSP_IDS = {
  MHV: 'mhv',
  MHV_VERBOSE: 'myhealthevet',
  ID_ME: 'idme',
  DS_LOGON: 'dslogon',
  LOGIN_GOV: 'logingov',
  VAMOCK: 'vamock',
};

export const SERVICE_PROVIDERS = {
  [CSP_IDS.ID_ME]: {
    label: 'ID.me',
    link: 'https://wallet.id.me/settings',
    image: <img src="/img/idme.svg" alt="ID.me" />,
    altImage: <img src="/img/idme.svg" alt="ID.me" />,
    policy: 'idme',
    className: 'idme-button',
  },
  [CSP_IDS.LOGIN_GOV]: {
    label: 'Login.gov',
    link: 'https://secure.login.gov/account',
    image: <img src="/img/logingov.svg" alt="Login.gov" />,
    policy: 'logingov',
    className: `logingov-button`,
  },
  [CSP_IDS.DS_LOGON]: {
    label: 'DS Logon',
    link: 'https://myaccess.dmdc.osd.mil/identitymanagement',
    image: <>DS Logon</>,
    policy: 'dslogon',
    className: 'dslogon-button',
  },
  [CSP_IDS.MHV]: {
    label: 'My HealtheVet',
    link: 'https://www.myhealth.va.gov',
    image: <>My HealtheVet</>,
    policy: 'mhv',
    className: 'mhv-button',
  },
};

export const ACTIVE_SERVICE_PROVIDERS = {
  [CSP_IDS.ID_ME]: SERVICE_PROVIDERS[CSP_IDS.ID_ME],
  [CSP_IDS.LOGIN_GOV]: SERVICE_PROVIDERS[CSP_IDS.LOGIN_GOV],
};

export const AUTHN_SETTINGS = {
  RETURN_URL: 'authReturnUrl',
  REDIRECT_EVENT: 'login-auth-redirect',
  REQUEST_ID: 'requestId',
};

export const EXTERNAL_APPS = {
  MHV: CSP_IDS.MHV,
  MY_VA_HEALTH: 'myvahealth',
  VA_FLAGSHIP_MOBILE: 'vamobile',
  VA_OCC_MOBILE: 'vaoccmobile',
  ARP: 'arp',
  SMHD: 'smhdweb',
};

export const ARP_APPS = {
  FORM21A: 'form21a',
};

export const OKTA_APPS = [
  'okta_test',
  'okta_stg',
  '861fbfbf1b4cd2594e0f7a4a367a9a87',
];

export const eAuthURL = `https://${
  eauthEnvironmentPrefixes[environment.BUILDTYPE]
}eauth.va.gov`;

export const EXTERNAL_REDIRECTS = {
  [EXTERNAL_APPS.MY_VA_HEALTH]: `https://${
    cernerEnvPrefixes[environment.BUILDTYPE]
  }patientportal.myhealth.va.gov`,
  [EXTERNAL_APPS.MHV]: `${eAuthURL}/mhv-portal-web/eauth`,
  [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: '',
  [EXTERNAL_APPS.VA_OCC_MOBILE]: `${eAuthURL}/MAP/users/v2/landing`,
  [EXTERNAL_APPS.ARP]: `${environment.BASE_URL}/representative`,
  [EXTERNAL_APPS.SMHD]: `${eAuthURL}/MAP/users/v2/landing?application=vaoccmobile&redirect_uri=/smhdWeb/`,
  [ARP_APPS.FORM21A]: `${
    environment.BASE_URL
  }/representative/accreditation/attorney-claims-agent-form-21a`,
};

export const EXTERNAL_REDIRECTS_ALT = {
  [EXTERNAL_APPS.MY_VA_HEALTH]: `https://${
    oracleHealthEnvPrefixes[environment.BUILDTYPE]
  }patientportal.myhealth.va.gov`,
};

export const GA = {
  clientIdKey: 'clientId',
  trackingIdKey: 'trackingId',
  trackingIds: ['UA-50123418-16', 'UA-50123418-17'],
  queryParams: {
    sis: 'ga_client_id',
    default: 'client_id',
  },
};

export const IDME_TYPES = ['idme', 'idme_signup'];

export const POLICY_TYPES = {
  MFA: 'mfa',
  SLO: 'slo',
  CUSTOM: 'custom',
  SIGNUP: 'signup',
  MHV_VERIFIED: 'mhv_verified',
};

export const SIGNUP_TYPES = {
  [CSP_IDS.ID_ME]: 'idme_signup',
  [CSP_IDS.LOGIN_GOV]: 'logingov_signup',
};

export const LINK_TYPES = {
  CREATE: 'create',
  SIGNIN: 'signin',
};

// Keep these KEYS camel case for ease of destructuring
export const AUTH_PARAMS = {
  application: 'application',
  OAuth: 'oauth',
  codeChallenge: 'code_challenge',
  codeChallengeMethod: 'code_challenge_method',
  clientId: 'client_id',
  to: 'to',
  redirectUri: 'redirect_uri',
  scope: 'scope',
  verification: 'verification',
  operation: 'operation',
  state: 'state',
};
