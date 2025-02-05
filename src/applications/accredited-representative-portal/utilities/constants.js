import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  AUTH_PARAMS as USIP_QUERY_PARAMS,
  EXTERNAL_APPS as USIP_APPLICATIONS,
} from 'platform/user/authentication/constants';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';

import {
  API_SIGN_IN_SERVICE_URL as SIS_API_URL,
  OAUTH_KEYS as SIS_QUERY_PARAM_KEYS,
} from '~/platform/utilities/oauth/constants';

const USIP_PATH = '/sign-in';
const USIP_BASE_URL = environment.BASE_URL;

const BASE_RETURN_URL =
  externalApplicationsConfig[USIP_APPLICATIONS.ARP].externalRedirectUrl;

export const getSignInUrl = ({ returnUrl } = {}) => {
  const url = new URL(USIP_PATH, USIP_BASE_URL);
  url.searchParams.set(USIP_QUERY_PARAMS.application, USIP_APPLICATIONS.ARP);
  url.searchParams.set(USIP_QUERY_PARAMS.OAuth, true);

  if (returnUrl) {
    const returnUrlSuffix = new URL(returnUrl).href.replace(
      BASE_RETURN_URL,
      '',
    );

    url.searchParams.set(USIP_QUERY_PARAMS.to, returnUrlSuffix);
  }

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
