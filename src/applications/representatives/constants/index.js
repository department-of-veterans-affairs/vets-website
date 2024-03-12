import * as SIS from './sis';
import * as USIP from './usip';

export const SIGN_IN_URL = (function getSignInUrl() {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  return url;
})();

// TODO:
// 1. Choose between `choice-a` and `choice-b`
// 1. Rename choice to `SIGN_OUT_URL`
// 1. Remove comments about choosing

// `choice-a`
// RRO: Straightforwardly set URL query params
// CON: Duplicates a tiny bit of code from `~/platform/utilities/oauth/utilities`
export const SIGN_OUT_URL_A = (function getSignOutUrl() {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(SIS.QUERY_PARAM_KEYS.CLIENT_ID, SIS.CLIENT_IDS.ARP);
  return url;
})();

// `choice-b`
// RRO: Reuses code from `~/platform/utilities/oauth/utilities`
// CON: Weirdly needs to set `sessionStorage`
export const SIGN_OUT_URL_B = (function getSignOutUrl() {
  sessionStorage.setItem(SIS.COOKIES.CI, SIS.CLIENT_IDS.ARP);
  return new URL(SIS.logoutUrl());
})();
