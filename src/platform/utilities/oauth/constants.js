export const OAUTH_KEYS = {
  CLIENT_ID: 'client_id',
  CODE_CHALLENGE: 'code_challenge',
  CODE_CHALLENGE_METHOD: 'code_challenge_method',
  REDIRECT_URI: 'redirect_uri',
  RESPONSE_TYPE: 'response_type',
  STATE: 'state',
  GRANT_TYPE: 'grant_type',
  CODE: 'code',
  CODE_VERIFIER: 'code_verifier',
  ACR: 'acr',
};

const generateOAuthKeysWithout = array =>
  Object.keys(OAUTH_KEYS).reduce(
    (acc, cv) => ({
      ...acc,
      ...(!array.includes(cv) && { [cv]: OAUTH_KEYS[cv] }),
    }),
    {},
  );

export const AUTHORIZE_KEYS_WEB = generateOAuthKeysWithout([
  'GRANT_TYPE',
  'CODE_VERIFIER',
  'CODE',
  'REDIRECT_URI',
]);

export const AUTHORIZE_KEYS_MOBILE = generateOAuthKeysWithout([
  'GRANT_TYPE',
  'CODE_VERIFIER',
  'CODE',
  'STATE',
  'REDIRECT_URI',
]);

export const TOKEN_KEYS = generateOAuthKeysWithout([
  'SCOPE',
  'RESPONSE_TYPE',
  'STATE',
  'CODE_CHALLENGE_METHOD',
  'CODE_CHALLENGE',
]);

export const OAUTH_ERRORS = {
  OAUTH_DEFAULT_ERROR: '201', // default
  OAUTH_STATE_MISMATCH: '202', // state mismatch
  OAUTH_INVALID_REQUEST: '203', // invalid request/missing param
  OAUTH_UNAUTHORIZED_CLIENT: '204', // client not registered
  OAUTH_ACCESS_DENIED: '205', // client not authorized
  OAUTH_RT_UNSUPPORTED: '206', // response type unsupported
};

export const OAUTH_ERROR_RESPONSES = {
  'Code is not valid': OAUTH_ERRORS.OAUTH_INVALID_REQUEST,
  default: OAUTH_ERRORS.OAUTH_DEFAULT_ERROR,
};

export const CLIENT_IDS = {
  WEB: 'web',
  MOBILE: 'mobile',
};
