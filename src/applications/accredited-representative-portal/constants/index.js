import * as SIS from './sis';
import * as USIP from './usip';

export const SIGN_IN_URL = (() => {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPLICATIONS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  return url;
})();
// test
export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(SIS.QUERY_PARAM_KEYS.CLIENT_ID, SIS.CLIENT_IDS.ARP);
  return url;
})();
