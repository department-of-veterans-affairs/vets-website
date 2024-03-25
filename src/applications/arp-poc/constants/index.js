import * as SIS from './sis';
import * as USIP from './usip';

export const SIGN_IN_URL = (function getSignInUrl() {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  return url;
})();

export const SIGN_OUT_URL = (function getSignOutUrl() {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(SIS.QUERY_PARAM_KEYS.CLIENT_ID, SIS.CLIENT_IDS.ARP);
  return url;
})();
