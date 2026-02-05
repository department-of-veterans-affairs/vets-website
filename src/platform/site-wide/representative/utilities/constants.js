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

const ARP_SIGN_IN_URL = '/representative/sign-in';
const USIP_BASE_URL = environment.BASE_URL;

export const getSignInUrl = ({ returnUrl } = {}) => {
  const signInPath = ARP_SIGN_IN_URL;
  const url = new URL(signInPath, USIP_BASE_URL);
  url.searchParams.set(USIP_QUERY_PARAMS.application, USIP_APPLICATIONS.ARP);
  url.searchParams.set(USIP_QUERY_PARAMS.OAuth, true);
  if (returnUrl) {
    url.searchParams.set(USIP_QUERY_PARAMS.to, returnUrl);
  }
  return url;
};

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS_API_URL({ endpoint: 'logout' }));
  url.searchParams.set(
    SIS_QUERY_PARAM_KEYS.CLIENT_ID,
    externalApplicationsConfig[USIP_APPLICATIONS.ARP].oAuthOptions.clientId,
  );

  return url;
})();

export const NAV_MOBILE_DROPDOWN = [
  {
    LABEL: 'Dashboard',
    URL: '/dashboard',
    TEST_ID: 'user-nav-profile-link',
  },
];

export const NAV_MENU_DROPDOWN = [
  {
    LABEL: 'Find Claimant',
    URL: '/find-claimant',
    ICON: 'search',
    TEST_ID: 'user-nav-claimant-search-link',
  },
  {
    LABEL: 'Representation Requests',
    URL: '/representation-requests',
    TEST_ID: 'user-nav-representation-requests-link',
  },
  {
    LABEL: 'Submissions',
    URL: '/submissions',
    TEST_ID: 'submissions-link',
  },
];
