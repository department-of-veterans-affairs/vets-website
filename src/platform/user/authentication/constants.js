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
  [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: '',
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
  MHV_VERIFIED: 'mhv_verified',
};

export const SIGNUP_TYPES = {
  [CSP_IDS.ID_ME]: 'idme_signup',
  [CSP_IDS.LOGIN_GOV]: 'logingov_signup',
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
  redirectUri: 'redirect_uri',
};

export const OCC_MOBILE = {
  REGISTERED_APPS: 'registeredApps',
  DEFAULT: 'default',
};

export const OCC_MOBILE_DSLOGON_ONLY = [
  'ahburnpitregistry',
  '/ahburnpitregistry/',
  '%2Fahburnpitregistry%2F',
  'AHburnpitregistry',
  '/AHburnpitregistry/',
  '%2FAHburnpitregistry%2F',
  'AHBurnPitRegistry',
  '/AHBurnPitRegistry/',
  '%2FAHBurnPitRegistry%2F',
];

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
  maintenance: {
    headline: 'Scheduled Maintenance',
    status: 'warning',
  },
};

const maintenanceWindow = (startTime, endTime) => {
  return (
    <>
      <b>
        {new Date(startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}
      </b>{' '}
      on{' '}
      <b>
        {new Date(startTime).toLocaleString('en-US', {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        })}
      </b>{' '}
      and{' '}
      <b>
        {new Date(endTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })}
      </b>{' '}
      on{' '}
      <b>
        {new Date(endTime).toLocaleString('en-US', {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        })}
      </b>
    </>
  );
};

export const getStatusFromStatuses = _status => {
  const { status } = _status[0];
  if (status === 'maintenance') {
    const { startTime, endTime, csp } = _status[0];

    if (csp && csp === SERVICE_PROVIDERS[csp]?.policy) {
      return {
        ...DOWNTIME_BANNER_CONFIG.maintenance,
        message: (
          <>
            We’re sorry. Our <b> {SERVICE_PROVIDERS[csp].label} </b> sign in
            process is currently scheduled to undergo maintenance between{' '}
            {maintenanceWindow(startTime, endTime)}. This may temporarily impact
            your ability to sign in to to VA.gov using your{' '}
            <b>{SERVICE_PROVIDERS[csp].label}</b> account. We apologize for any
            inconvenience this may cause and appreciate your understanding.
          </>
        ),
      };
    }
    return {
      ...DOWNTIME_BANNER_CONFIG.maintenance,
      message: (
        <>
          We’re sorry. Our system is currently scheduled to undergo maintenance
          between {maintenanceWindow(startTime, endTime)}. This may temporarily
          impact your ability to sign in or use tools on to VA.gov. We apologize
          for any inconvenience this may cause and appreciate your
          understanding.
        </>
      ),
    };
  }

  const sorted = _status
    .sort((a, b) => (a.service < b.service ? 1 : -1))
    .find(k => !['active'].includes(k.status));
  return sorted && AUTH_DEPENDENCIES.some(id => id === sorted.serviceId)
    ? DOWNTIME_BANNER_CONFIG[sorted.serviceId]
    : {};
};
