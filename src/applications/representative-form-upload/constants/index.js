import * as SIS from './sis';
import * as USIP from './usip';

export const SIGN_IN_URL = (() => {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(
    USIP.QUERY_PARAM_KEYS.application,
    USIP.APPLICATIONS.ARP.SLUG,
  );
  url.searchParams.set(USIP.QUERY_PARAM_KEYS.OAuth, true);
  return url;
})();

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(
    SIS.QUERY_PARAM_KEYS.CLIENT_ID,
    USIP.APPLICATIONS.ARP.CLIENT_ID,
  );
  return url;
})();
