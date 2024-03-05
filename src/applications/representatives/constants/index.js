import * as USIP from './usip';

export const SIGN_IN_URL = (function getSignInUrl() {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  return url;
})();
