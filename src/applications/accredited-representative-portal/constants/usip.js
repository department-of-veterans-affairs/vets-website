import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const PATH = '/sign-in';
export const { BASE_URL } = environment;

export {
  AUTH_PARAMS as QUERY_PARAMS,
  EXTERNAL_APPS as APPLICATIONS,
} from 'platform/user/authentication/constants';
