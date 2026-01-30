import {
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  EXTERNAL_REDIRECTS_ALT,
} from '../constants';
import {
  defaultSignInProviders,
  defaultMobileQueryParams,
  defaultWebOAuthOptions,
  defaultMobileOAuthOptions,
  arpWebOAuthOptions,
} from './constants';

export default {
  default: {
    allowedSignInProviders: { ...defaultSignInProviders },
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
    isMobile: true,
    queryParams: { ...defaultMobileQueryParams },
    OAuthEnabled: true,
    requiresVerification: true,
    oAuthOptions: defaultMobileOAuthOptions,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_FLAGSHIP_MOBILE],
  },
  [EXTERNAL_APPS.VA_OCC_MOBILE]: {
    allowedSignInProviders: {
      idme: true,
      logingov: true,
    },
    isMobile: true,
    queryParams: { ...defaultMobileQueryParams },
    OAuthEnabled: false,
    requiresVerification: true,
    oAuthOptions: defaultMobileOAuthOptions,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE],
  },
  [EXTERNAL_APPS.ARP]: {
    allowedSignInProviders: {
      idme: true,
      logingov: true,
    },
    isMobile: false,
    queryParams: {
      allowOAuth: true,
      allowPostLogin: true,
      allowRedirect: false,
    },
    oAuthOptions: arpWebOAuthOptions,
    OAuthEnabled: true,
    requiresVerification: true,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP],
  },
  [EXTERNAL_APPS.SMHD]: {
    allowedSignInProviders: {
      idme: true,
      logingov: true,
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
