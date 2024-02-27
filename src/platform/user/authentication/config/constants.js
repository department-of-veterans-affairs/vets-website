/* eslint-disable camelcase */

export const defaultSignInProviders = {
  logingov: true,
  idme: true,
  dslogon: true,
  mhv: true,
};

export const defaultSignUpProviders = {
  logingov: true,
  idme: true,
};

export const defaultMobileQueryParams = {
  allowOAuth: true,
  allowPostLogin: false,
  allowRedirect: false,
};

export const defaultMobileOAuthOptions = {
  clientId: 'vamobile',
  acr: { idme: 'loa3', dslogon: 'loa3', mhv: 'loa3', logingov: 'ial2' },
  acrSignup: { idme_signup: 'loa3', logingov_signup: 'ial2' },
};

export const defaultWebOAuthOptions = {
  clientId: 'vaweb',
  acr: { idme: 'min', dslogon: 'min', mhv: 'min', logingov: 'min' },
  acrSignup: { idme_signup: 'min', logingov_signup: 'min' },
  acrVerify: { idme: 'loa3', logingov: 'ial2' },
};

export const arpWebOAuthOptions = {
  clientId: 'vaweb',
  acr: { idme: 'loa3', logingov: 'ial2' },
  acrSignup: { idme_signup: 'loa3', logingov_signup: 'ial2' },
};

export const OAuthEnabledApplications = [
  undefined /* default */,
  'vamobile',
  'arp',
];
