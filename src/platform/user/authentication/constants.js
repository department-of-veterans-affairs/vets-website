import React from 'react';
import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';
import IDMeSVG from 'platform/user/authentication/components/IDMeSVG';
import environment from '../../utilities/environment';
import {
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
} from '../../utilities/sso/constants';

export const API_VERSION = 'v1';
export const SIS_API_VERSION = 'v0';

export const API_SESSION_URL = ({ version = API_VERSION, type = null }) =>
  `${environment.API_URL}/${version}/sessions/${type}/new`;

export const API_SIGN_IN_SERVICE_URL = ({
  version = SIS_API_VERSION,
  type = '',
  endpoint = 'authorize',
}) =>
  `${environment.API_URL}/${version}/sign_in/${endpoint}${type &&
    `?type=${type}`}`;

export const AUTH_EVENTS = {
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
  OAUTH_ERROR_DEFAULT: 'login-error-oauth-default',
  OAUTH_ERROR_STATE_MISMATCH: 'login-error-oauth-state-mismatch',
  OAUTH_ERROR_USER_FETCH: 'login-error-oauth-user-fetch',
};

export const SERVICE_PROVIDERS = {
  logingov: { label: 'Login.gov', link: 'https://secure.login.gov/account' },
  idme: { label: 'ID.me', link: 'https://wallet.id.me/settings' },
  dslogon: {
    label: 'DS Logon',
    link: 'https://myaccess.dmdc.osd.mil/identitymanagement',
  },
  mhv: { label: 'My HealtheVet', link: 'https://www.myhealth.va.gov' },
  myhealthevet: { label: 'My HealtheVet', link: 'https://www.myhealth.va.gov' },
};

export const CSP_IDS = {
  MHV: 'mhv',
  MHV_VERBOSE: 'myhealthevet',
  ID_ME: 'idme',
  DS_LOGON: 'dslogon',
  LOGIN_GOV: 'logingov',
};

export const AUTHN_SETTINGS = {
  RETURN_URL: 'authReturnUrl',
  REDIRECT_EVENT: 'login-auth-redirect',
};

export const EXTERNAL_APPS = {
  MHV: CSP_IDS.MHV,
  MY_VA_HEALTH: 'myvahealth',
  EBENEFITS: 'ebenefits',
  VA_FLAGSHIP_MOBILE: 'vamobile',
  VA_OCC_MOBILE: 'vaoccmobile',
};

export const EBENEFITS_DEFAULT_PATH = '/profilepostauth';

export const eAuthURL = `https://${
  eauthEnvironmentPrefixes[environment.BUILDTYPE]
}eauth.va.gov`;

export const EXTERNAL_REDIRECTS = {
  [EXTERNAL_APPS.MY_VA_HEALTH]: `https://${
    cernerEnvPrefixes[environment.BUILDTYPE]
  }patientportal.myhealth.va.gov`,
  [EXTERNAL_APPS.MHV]: `${eAuthURL}/mhv-portal-web/eauth`,
  [EXTERNAL_APPS.EBENEFITS]: `${eAuthURL}/ebenefits`,
  [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: `https://${
    eauthEnvironmentPrefixes[environment.BUILDTYPE]
  }fed.eauth.va.gov/oauthe/sps/oauth/oauth20/authorize`,
  [EXTERNAL_APPS.VA_OCC_MOBILE]: `${eAuthURL}/MAP/users/v2/landing`,
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
  VERIFY: 'verify',
  MFA: 'mfa',
  SLO: 'slo',
  CUSTOM: 'custom',
  SIGNUP: 'signup',
};

export const SIGNUP_TYPES = {
  [CSP_IDS.ID_ME]: 'idme_signup',
  [CSP_IDS.LOGIN_GOV]: 'logingov_signup',
};

export const CSP_CONTENT = {
  [CSP_IDS.LOGIN_GOV]: { LOGO: <LoginGovSVG />, COPY: 'Login.gov' },
  [CSP_IDS.ID_ME]: { LOGO: <IDMeSVG />, COPY: 'ID.me' },
  [CSP_IDS.DS_LOGON]: { LOGO: <>DS Logon</>, COPY: 'DS Logon' },
  [CSP_IDS.MHV]: { LOGO: <>My HealtheVet</>, COPY: 'My HealtheVet' },
};

export const AUTH_LEVEL = { FAIL: 'fail', SUCCESS: 'success' };
export const AUTH_ERROR = {
  USER_DENIED: '001', // User clicked 'Deny' in Authorization
  USER_CLOCK_MISMATCH: '002', // User clock is incorrect
  SERVER_CLOCK_MISMATCH: '003', // Server timing error
  MVI_MISMATCH: '004', // MVI Mismatch
  SESSION_EXPIRED: '005', // Session Expiration
  DEFAULT: '007', // Catch all (generic/unknown error)
  LOGINGOV_PROOFING_FAIL: '009', // Login.gov Failure to Proof

  MULTIPLE_MHVIDS: '101', // Multiple MHV IDs/IENs
  MULTIPLE_EDIPIS: '102', // Multiple EDIPIS
  ICN_MISMATCH: '103', // ICN Mismatch
  UUID_MISSING: '104', // UUID Missing (Login.gov or ID.me)
  MULTIPLE_CORPIDS: '106', // Multiple Corp IDs
  REQUIRED_MISSING_USER_PARAMTER: '108',
};

export const MHV_TRANSITION_DATE = null;
export const MHV_TRANSITION_TIME = '[x]';
export const ACCOUNT_TRANSITION_DISMISSED = 'accountTransitionDismissed';

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
};
