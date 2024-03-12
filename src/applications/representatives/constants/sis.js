// TODO:
// 1. Choose between `choice-a` and `choice-b`
// 1. Consolidate exports
// 1. Remove comments about choosing

// Used by both `choice-a` and `choice-b`
export { CLIENT_IDS } from '~/platform/utilities/oauth/constants';

// Only used by `choice-a`
export {
  API_SIGN_IN_SERVICE_URL as API_URL,
  OAUTH_KEYS as QUERY_PARAM_KEYS,
} from '~/platform/utilities/oauth/constants';

// Only used by `choice-b`
export { COOKIES } from '~/platform/utilities/oauth/constants';
export {
  logoutUrlSiS as logoutUrl,
} from '~/platform/utilities/oauth/utilities';
