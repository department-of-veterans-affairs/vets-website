import environment from '@department-of-veterans-affairs/platform-utilities/environment';

// ```
// import manifest from 'applications/login/manifest.json';
// export const PATH = manifest.rootUrl;
// ```
// => No cross app imports allowed: representatives importing from login
export const PATH = '/sign-in';
export const { BASE_URL } = environment;

export {
  AUTH_PARAMS as QUERY_PARAMS,
  EXTERNAL_APPS as APPS,
} from 'platform/user/authentication/constants';
