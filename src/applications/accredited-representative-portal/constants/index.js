import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { arpDevClientId } from 'platform/user/authentication/config/dev.config';
import { arpStagingClientId } from 'platform/user/authentication/config/staging.config';
import { arpProdClientId } from 'platform/user/authentication/config/prod.config';
import * as USIP from './usip';
import * as SIS from './sis';

export const SIGN_IN_URL = (() => {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPLICATIONS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  return url;
})();

const getArpClientId = () => {
  if (environment.isProduction()) return arpProdClientId;
  if (environment.isStaging()) return arpStagingClientId;
  if (environment.isDev()) return arpDevClientId;
  return 'arp'; // NOTE: this is the default ARP Client ID
};

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(SIS.QUERY_PARAM_KEYS.CLIENT_ID, getArpClientId());
  return url;
})();
