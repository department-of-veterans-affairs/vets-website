import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  AUTH_PARAMS as USIP_QUERY_PARAMS,
  EXTERNAL_APPS as USIP_APPLICATIONS,
} from 'platform/user/authentication/constants';

import {
  API_SIGN_IN_SERVICE_URL as SIS_API_URL,
  OAUTH_KEYS as SIS_QUERY_PARAM_KEYS,
} from '~/platform/utilities/oauth/constants';

const ARP_SIGN_IN_URL = '/representative/sign-in';
const USIP_BASE_URL = environment.BASE_URL;

export const getSignInUrl = ({ __useNewLogin = false } = {}) => {
  const url = new URL(ARP_SIGN_IN_URL, USIP_BASE_URL);
  url.searchParams.set(USIP_QUERY_PARAMS.application, USIP_APPLICATIONS.ARP);
  url.searchParams.set(USIP_QUERY_PARAMS.OAuth, true);
  url.searchParams.set(USIP_QUERY_PARAMS.to, '/poa-requests');
  return url;
};

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS_API_URL({ endpoint: 'logout' }));
  url.searchParams.set(
    SIS_QUERY_PARAM_KEYS.CLIENT_ID,
    sessionStorage.getItem('ci'),
  );

  return url;
})();
