export const OAUTH_KEYS = {
  CLIENT_ID: 'client_id',
  CODE_CHALLENGE: 'code_challenge',
  CODE_CHALLENGE_METHOD: 'code_challenge_method',
  REDIRECT_URI: 'redirect_uri',
  RESPONSE_TYPE: 'response_type',
  SCOPE: 'scope',
  STATE: 'state',
  GRANT_TYPE: 'grant_type',
  CODE: 'code',
  CODE_VERIFIER: 'code_verifier',
};

const generateOAuthKeysWithout = array =>
  Object.keys(OAUTH_KEYS).reduce((acc, cv) => {
    let tempAcc = acc;
    if (!array.includes(cv)) {
      tempAcc = { ...acc, [cv]: OAUTH_KEYS[cv] };
    }
    return tempAcc;
  }, {});

export const AUTHORIZE_KEYS = generateOAuthKeysWithout([
  'GRANT_TYPE',
  'CODE_VERIFIER',
  'CODE',
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
