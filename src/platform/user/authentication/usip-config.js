import { EXTERNAL_APPS, EXTERNAL_REDIRECTS } from './constants';

const defaultSignInProviders = {
  logingov: true,
  idme: true,
  mhv: true,
  dslogon: true,
};

const defaultSignUpProviders = {
  logingov: true,
  idme: true,
};

const defaultMobileQueryParams = {
  allowSkipDupe: false,
  allowOAuth: true,
  allowPostLogin: false,
  allowRedirect: false,
};

export const externalApplicationsConfig = {
  default: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
      allowSkipDupe: false,
      allowOAuth: false,
      allowPostLogin: true,
      allowRedirect: false,
    },
    OAuthEnabled: false,
    requiresVerification: false,
  },
  [EXTERNAL_APPS.MHV]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
      allowSkipDupe: true,
      allowOAuth: false,
      allowPostLogin: true,
      allowRedirect: true,
    },
    OAuthEnabled: false,
    requiresVerification: false,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV],
  },
  [EXTERNAL_APPS.MY_VA_HEALTH]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
      allowSkipDupe: true,
      allowOAuth: false,
      allowPostLogin: false,
      allowRedirect: false,
    },
    OAuthEnabled: false,
    requiresVerification: false,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH],
  },
  [EXTERNAL_APPS.EBENEFITS]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
      allowSkipDupe: false,
      allowOAuth: false,
      allowPostLogin: false,
      allowRedirect: false,
    },
    OAuthEnabled: false,
    requiresVerification: false,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.EBENEFITS],
  },
  [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: true,
    queryParams: { ...defaultMobileQueryParams },
    OAuthEnabled: true,
    requiresVerification: true,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_FLAGSHIP_MOBILE],
  },
  [EXTERNAL_APPS.VA_OCC_MOBILE]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: true,
    queryParams: { ...defaultMobileQueryParams },
    OAuthEnabled: true,
    requiresVerification: true,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE],
  },
};
