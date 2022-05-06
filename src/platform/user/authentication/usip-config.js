import { EXTERNAL_APPS, EXTERNAL_LINKS } from './constants';

export const externalApplicationsConfig = {
  default: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
      mhv: false,
      dslogon: false,
    },
    allowedSignUpProviders: {
      logingov: true,
      idme: true,
    },
    queryParams: {
      allowSkipDupe: false,
      allowCodeChallenge: false,
      allowCodeChallengeMethod: false,
      allowOAuth: false,
      allowPostLogin: true,
    },
  },
  [EXTERNAL_APPS.MHV]: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
      mhv: true,
      dslogon: true,
    },
    allowedSignUpProviders: {
      logingov: true,
      idme: true,
    },
    queryParams: {
      allowSkipDupe: true,
      allowCodeChallenge: false,
      allowCodeChallengeMethod: false,
      allowOAuth: false,
      allowPostLogin: true,
    },
    externalLinks: EXTERNAL_LINKS.MHV,
  },
  [EXTERNAL_APPS.MY_VA_HEALTH]: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
      mhv: true,
      dslogon: true,
    },
    allowedSignUpProviders: {
      logingov: true,
      idme: true,
    },
    queryParams: {
      allowSkipDupe: true,
      allowCodeChallenge: false,
      allowCodeChallengeMethod: false,
      allowOAuth: false,
      allowPostLogin: false,
    },
    externalLinks: {
      staging: 'https://staging-patientportal.myhealth.va.gov',
      prod: 'https://patientportal.myhealth.va.gov',
    },
  },
  [EXTERNAL_APPS.EBENEFITS]: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
      mhv: true,
      dslogon: true,
    },
    allowedSignUpProviders: {
      logingov: true,
      idme: true,
    },
    queryParams: {
      allowSkipDupe: false,
      allowCodeChallenge: false,
      allowCodeChallengeMethod: false,
      allowOAuth: false,
      allowPostLogin: false,
    },
    externalLinks: EXTERNAL_LINKS.EBENEFITS,
  },
  [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
      mhv: true,
      dslogon: true,
    },
    allowedSignUpProviders: {
      logingov: true,
      idme: true,
    },
    queryParams: {
      allowSkipDupe: false,
      allowCodeChallenge: true,
      allowCodeChallengeMethod: true,
      allowOAuth: true,
      allowPostLogin: false,
    },
    externalLinks: EXTERNAL_LINKS.VA_FLAGSHIP_MOBILE,
  },
  [EXTERNAL_APPS.VA_OCC_MOBILE]: {
    allowedSignInProviders: {
      logingov: true,
      idme: true,
      mhv: true,
      dslogon: true,
    },
    allowedSignUpProviders: {
      logingov: true,
      idme: true,
    },
    queryParams: {
      allowSkipDupe: false,
      allowCodeChallenge: true,
      allowCodeChallengeMethod: true,
      allowOAuth: true,
      allowPostLogin: false,
    },
    externalLinks: EXTERNAL_LINKS.VA_OCC_MOBILE,
  },
};
