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
  INVALID_REQUEST: 'invalid_request',
  UNAUTHORIZED_CLIENT: 'unauthorized_client',
  ACCESS_DENIED: 'access_denied',
  RESPONSE_TYPE_UNSUPPORTED: 'unsupported_response_type',
  SERVER_ERROR: 'server_error',
  UNAVAILBLE: 'unavailable',
};
