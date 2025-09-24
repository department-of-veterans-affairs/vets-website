import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { EXTERNAL_APPS } from 'platform/user/authentication/constants';

// To keep isolated application status, this is hardcoded rather than cross-app
// imported from `login/manifest.json`.
// https://depo-platform-documentation.scrollhelp.site/developer-docs/how-to-add-your-application-to-the-allow-list
export const PATH = '/sign-in';
export const { BASE_URL } = environment;
export {
  AUTH_PARAMS as QUERY_PARAM_KEYS,
} from 'platform/user/authentication/constants';

const config = externalApplicationsConfig[EXTERNAL_APPS.ARP];
export const APPLICATIONS = {
  ARP: {
    SLUG: EXTERNAL_APPS.ARP,
    CLIENT_ID: config.oAuthOptions.clientId,
  },
};
