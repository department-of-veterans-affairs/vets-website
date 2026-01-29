/* eslint-disable camelcase */
import { CLIENT_IDS } from '../../../utilities/oauth/constants';
import { EXTERNAL_APPS } from '../constants';

export const defaultSignInProviders = {
  idme: true,
  logingov: true,
};

export const defaultMobileQueryParams = {
  allowOAuth: true,
  allowPostLogin: false,
  allowRedirect: false,
};

export const defaultMobileOAuthOptions = {
  clientId: CLIENT_IDS.VAMOBILE,
  acr: { idme: 'loa3', logingov: 'ial2' },
  acrSignup: { idme_signup: 'loa3', logingov_signup: 'ial2' },
};

export const defaultWebOAuthOptions = {
  clientId: CLIENT_IDS.VAWEB,
  acr: { idme: 'min', logingov: 'min' },
  acrSignup: { idme_signup: 'min', logingov_signup: 'min' },
  acrVerify: { idme: 'loa3', logingov: 'ial2' },
};

export const arpWebOAuthOptions = {
  clientId: CLIENT_IDS.ARP,
  acr: { idme: 'loa3', logingov: 'ial2' },
  acrSignup: { idme_signup: 'loa3', logingov_signup: 'ial2' },
};

export const OAuthEnabledApplications = [
  undefined /* default */,
  EXTERNAL_APPS.VA_FLAGSHIP_MOBILE,
  EXTERNAL_APPS.ARP,
];
