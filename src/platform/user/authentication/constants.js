import React from 'react';
import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';
import IDMeSVG from 'platform/user/authentication/components/IDMeSVG';
import environment from '../../utilities/environment';
import {
  eauthEnvironmentPrefixes,
  cernerEnvPrefixes,
} from '../../utilities/sso/constants';

export const API_VERSION = 'v1';
export const FORCE_NEEDED = 'force-needed';

export const API_SESSION_URL = ({ version = API_VERSION, type = null }) =>
  `${environment.API_URL}/${version}/sessions/${type}/new`;

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
};

export const SERVICE_PROVIDERS = {
  [CSP_IDS.LOGIN_GOV]: {
    label: 'Login.gov',
    link: 'https://secure.login.gov/account',
    image: <LoginGovSVG />,
    policy: 'logingov',
    className: `logingov-button`,
  },
  [CSP_IDS.ID_ME]: {
    label: 'ID.me',
    link: 'https://wallet.id.me/settings',
    image: <IDMeSVG />,
    policy: 'idme',
    className: 'idme-button',
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

export const AUTHN_SETTINGS = {
  RETURN_URL: 'authReturnUrl',
  REDIRECT_EVENT: 'login-auth-redirect',
  REQUEST_ID: 'requestId',
};

export const EXTERNAL_APPS = {
  MHV: CSP_IDS.MHV,
  MY_VA_HEALTH: 'myvahealth',
  EBENEFITS: 'ebenefits',
  VA_FLAGSHIP_MOBILE: 'vamobile',
  VA_OCC_MOBILE: 'vaoccmobile',
};

export const SIGNOUT_TYPES = {
  SLO: 'slo',
};

export const AUTH_BROKER = {
  IAM: 'iam',
  SIS: 'sis',
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
  MFA: 'mfa',
  SLO: 'slo',
  CUSTOM: 'custom',
  SIGNUP: 'signup',
};

export const SIGNUP_TYPES = {
  [CSP_IDS.ID_ME]: 'idme_signup',
  [CSP_IDS.LOGIN_GOV]: 'logingov_signup',
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

  OAUTH_DEFAULT_ERROR: '201',
  OAUTH_STATE_MISMATCH: '202',
  OAUTH_INVALID_REQUEST: '203',

  GENERIC: '400',
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

export const AUTH_DEPENDENCIES = [
  EXTERNAL_SERVICES.idme,
  EXTERNAL_SERVICES.ssoe,
  EXTERNAL_SERVICES.dslogon,
  EXTERNAL_SERVICES.mhv,
  EXTERNAL_SERVICES.mvi,
  EXTERNAL_SERVICES.logingov,
];

export const generateCSPBanner = ({ csp }) => {
  return {
    headline: `You may have trouble signing in with ${
      SERVICE_PROVIDERS[csp].label
    }`,
    status: 'warning',
    message: `We’re sorry. We’re working to fix some problems with our ${
      SERVICE_PROVIDERS[csp].label
    } sign in process. If you’d like to sign in to VA.gov with your ${
      SERVICE_PROVIDERS[csp].label
    } account, please check back later.`,
  };
};

export const DOWNTIME_BANNER_CONFIG = {
  ...Object.keys(SERVICE_PROVIDERS).reduce(
    (acc, cv) => ({
      ...acc,
      [cv]: generateCSPBanner({ csp: cv }),
    }),
    {},
  ),
  ssoe: {
    headline: 'Our sign in process isn’t working right now',
    status: 'error',
    message:
      'We’re sorry. We’re working to fix some problems with our sign in process. If you’d like to sign in to VA.gov, please check back later.',
  },
  mvi: {
    headline: 'You may have trouble signing in or using some tools or services',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or services, please check back soon.',
  },
};

export const getStatusFromStatuses = _status => {
  const sorted = _status
    .sort((a, b) => {
      if (a.service < b.service) return 1;
      if (a.service > b.service) return -1;
      return 0;
    })
    .find(k => !['active'].includes(k.status));

  return sorted && AUTH_DEPENDENCIES.some(id => id === sorted.serviceId)
    ? DOWNTIME_BANNER_CONFIG[sorted.serviceId]
    : {};
};
