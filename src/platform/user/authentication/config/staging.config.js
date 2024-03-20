import { EXTERNAL_APPS, EXTERNAL_REDIRECTS } from '../constants';
import {
  defaultSignUpProviders,
  defaultSignInProviders,
  defaultMobileQueryParams,
  defaultWebOAuthOptions,
  defaultMobileOAuthOptions,
  arpWebOAuthOptions,
} from './constants';

export default {
  default: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
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
    allowedSignUpProviders: { ...defaultSignUpProviders },
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
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
      allowOAuth: false,
      allowPostLogin: false,
      allowRedirect: false,
    },
    OAuthEnabled: false,
    requiresVerification: true,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH],
  },
  [EXTERNAL_APPS.EBENEFITS]: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
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
    oAuthOptions: defaultMobileOAuthOptions,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_FLAGSHIP_MOBILE],
  },
  [EXTERNAL_APPS.VA_OCC_MOBILE]: {
    allowedSignInProviders: {
      default: { ...defaultSignInProviders },
      registeredApps: { dslogon: true },
    },
    allowedSignUpProviders: {
      default: { ...defaultSignUpProviders },
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
    allowedSignUpProviders: {
      idme: true,
      logingov: true,
    },
    isMobile: false,
    queryParams: {
      allowOAuth: true,
      allowPostLogin: true,
      allowRedirect: false,
    },
    oAuthOptions: {
      ...arpWebOAuthOptions,
      // TODO: refactor `CLIENT_IDS` to vary by environment. This is the value
      // for the ARP frontend in staging.
      clientId: 'ce6db4d7974daf061dccdd21ba9add14',
    },
    OAuthEnabled: true,
    requiresVerification: false,
    externalRedirectUrl: EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP],
  },
};
