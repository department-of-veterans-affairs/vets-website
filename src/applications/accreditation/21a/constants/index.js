import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';

import * as SIS from './sis';
import * as USIP from './usip';

export const SIGN_IN_URL = (() => {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPLICATIONS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  return url;
})();

export const SIGN_IN_URL_21A = (() => {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(USIP.QUERY_PARAMS.application, USIP.APPLICATIONS.ARP);
  url.searchParams.set(USIP.QUERY_PARAMS.OAuth, true);
  url.searchParams.set(
    USIP.QUERY_PARAMS.to,
    `/accreditation/attorney-claims-agent-form-21a`,
  );
  return url;
})();

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(
    SIS.QUERY_PARAM_KEYS.CLIENT_ID,
    externalApplicationsConfig[USIP.APPLICATIONS.ARP].oAuthOptions.clientId,
  );
  return url;
})();

export const isProduction = () => {
  return window.Cypress || environment.isProduction();
};
