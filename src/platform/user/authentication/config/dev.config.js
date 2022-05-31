import { EXTERNAL_APPS, EXTERNAL_REDIRECTS } from '../constants';
import {
  defaultSignUpProviders,
  defaultSignInProviders,
  defaultMobileQueryParams,
} from './constants';

export default {
  default: {
    allowedSignInProviders: { ...defaultSignInProviders },
    allowedSignUpProviders: { ...defaultSignUpProviders },
    isMobile: false,
    queryParams: {
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
