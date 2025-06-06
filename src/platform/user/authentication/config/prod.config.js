import {
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  EXTERNAL_REDIRECTS_ALT,
} from '../constants';
import {
  legacySignInProviders,
  defaultSignInProviders,
  defaultMobileQueryParams,
  defaultWebOAuthOptions,
  defaultMobileOAuthOptions,
  arpWebOAuthOptions,
} from './constants';

export default {
  default: {
    allowedSignInProviders: { ...defaultSignInProviders },
    legacySignInProviders,
    isMobile: false,
    queryParams: {
      allowOAuth: true,
      allowPostLogin: true,
      allowRedirect: false,
    },
    oAuthOptions: defaultWebOAuthOptions,
    OAuthEnabled: true,
    requiresVerification: false,
  },
  [EXTERNAL_APPS.MHV]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    legacySignInProviders,
    isMobile: false,
    queryParams: {
      allowOAuth: false,
      allowPostLogin: true,
      allowRedirect: true,
    },
    OAuthEnabled: false,
    requiresVerification: true,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV],
  },
  [EXTERNAL_APPS.MY_VA_HEALTH]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    legacySignInProviders,
    isMobile: false,
    queryParams: {
      allowOAuth: false,
      allowPostLogin: false,
      allowRedirect: false,
    },
    OAuthEnabled: false,
    requiresVerification: true,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH],
    alternateRedirectUrl: EXTERNAL_REDIRECTS_ALT[EXTERNAL_APPS.MY_VA_HEALTH],
  },
  [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    legacySignInProviders,
    isMobile: true,
    queryParams: { ...defaultMobileQueryParams },
    OAuthEnabled: true,
    requiresVerification: true,
    oAuthOptions: defaultMobileOAuthOptions,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_FLAGSHIP_MOBILE],
  },
  [EXTERNAL_APPS.VA_OCC_MOBILE]: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
    },
    legacySignInProviders,
    isMobile: true,
    queryParams: { ...defaultMobileQueryParams },
    OAuthEnabled: false,
    requiresVerification: true,
    oAuthOptions: defaultMobileOAuthOptions,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE],
  },
  [EXTERNAL_APPS.ARP]: {
    allowedSignInProviders: {
      idme: false,
      logingov: true,
    },
    legacySignInProviders: {
      dslogon: false,
    },
    isMobile: false,
    queryParams: {
      allowOAuth: true,
      allowPostLogin: true,
      allowRedirect: false,
    },
    oAuthOptions: {
      ...arpWebOAuthOptions,
      clientId: 'fe0d4b2cac7935e7eec5946b8ee31643',
    },
    OAuthEnabled: true,
    requiresVerification: false,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP],
  },
  [EXTERNAL_APPS.SMHD]: {
    allowedSignInProviders: {
      idme: true,
      logingov: true,
    },
    legacySignInProviders: {
      dslogon: false,
    },
    isMobile: false,
    queryParams: {
      allowOAuth: false,
      allowPostLogin: false,
      allowRedirect: false,
    },
    oAuthOptions: defaultMobileOAuthOptions,
    OAuthEnabled: false,
    requiresVerification: false,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.SMHD],
  },
};
