import React from 'react';
import environment from '../../utilities/environment';
import { eauthEnvironmentPrefixes } from '../../utilities/sso/constants';
import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';
import IDMeSVG from 'platform/user/authentication/components/IDMeSVG';

export const API_VERSION = 'v1';

export const AUTH_EVENTS = {
  MODAL_LOGIN: 'login-link-clicked-modal',
  SSO_LOGIN: 'sso-automatic-login',
  SSO_LOGOUT: 'sso-automatic-logout',
  MFA: 'multifactor-link-clicked',
  VERIFY: 'verify-link-clicked',
  LOGOUT: 'logout-link-clicked',
  REGISTER: 'register-link-clicked',
  ERROR_USER_FETCH: 'login-error-user-fetch',
  ERROR_FORCE_NEEDED: 'login-failed-force-needed',
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
};

export const MY_VA_HEALTH_LINKS = {
  STAGING: 'https://staging-patientportal.myhealth.va.gov',
  PRODUCTION: 'https://patientportal.myhealth.va.gov',
};

export const MHV_LINK = `https://${
  eauthEnvironmentPrefixes[environment.BUILDTYPE]
}eauth.va.gov/mhv-portal-web/eauth`;

export const EXTERNAL_REDIRECTS = {
  [EXTERNAL_APPS.MY_VA_HEALTH]: environment.isProduction()
    ? MY_VA_HEALTH_LINKS.PRODUCTION
    : MY_VA_HEALTH_LINKS.STAGING,
  [EXTERNAL_APPS.MHV]: MHV_LINK,
};

export const VAGOV_TRACKING_IDS = ['UA-50123418-16', 'UA-50123418-17'];

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
