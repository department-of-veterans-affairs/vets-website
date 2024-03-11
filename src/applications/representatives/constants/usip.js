import environment from '@department-of-veterans-affairs/platform-utilities/environment';

// To keep isolated application status, this is hardcoded rather than cross-app
// imported from `login/manifest.json`.
// https://depo-platform-documentation.scrollhelp.site/developer-docs/how-to-add-your-application-to-the-allow-list
export const PATH = '/sign-in';
export const { BASE_URL } = environment;

export {
  AUTH_PARAMS as QUERY_PARAMS,
  EXTERNAL_APPS as APPS,
} from 'platform/user/authentication/constants';
