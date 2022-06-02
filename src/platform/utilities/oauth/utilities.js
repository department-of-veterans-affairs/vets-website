import environment from 'platform/utilities/environment';
import { OAUTH_KEYS } from './constants';
import * as oauthCrypto from './crypto';

export async function pkceChallengeFromVerifier(v) {
  const hashed = await oauthCrypto.sha256(v);
  return oauthCrypto.base64UrlEncode(hashed);
}

export const getConfig = (state, codeVerifier) => ({
  [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent('somelongid+somethingelse'),
  [OAUTH_KEYS.REDIRECT_URI]: encodeURIComponent(
    `${environment.BASE_URL}/auth/login/callback`,
  ),
  [OAUTH_KEYS.RESPONSE_TYPE]: 'code',
  [OAUTH_KEYS.SCOPE]: 'email',
  [OAUTH_KEYS.STATE]: state,
  [OAUTH_KEYS.CODE_CHALLENGE]: codeVerifier,
  [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: 'S256',
});

const generateAuthorizationEndpoint = csp =>
  new URL(`${environment.API_URL}/sign_in/${csp}/authorize`);

const saveStateAndVerifier = () => {
  /*
    Ensures saved state is not overwritten if location has
    state parameter.
  */
  if (window.location.search.includes('state')) return;
  const storage = window.sessionStorage;

  // Create and store a random "state" value
  const state = oauthCrypto.generateRandomString(28);

  // Create and store a new PKCE code_verifier (the plaintext random secret)
  const codeVerifier = oauthCrypto.generateRandomString(64);

  storage.setItem('state', state);
  storage.setItem('code_verifier', codeVerifier);
  // eslint-disable-next-line consistent-return
  return { state, codeVerifier };
};

/**
 *
 * @param {String} csp
 */
export async function createOAuthRequest(csp) {
  const { state, codeVerifier } = saveStateAndVerifier();
  // Hash and base64-urlencode the secret to use as the challenge
  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  // Build the authorization URL
  const config = getConfig(state, codeChallenge);

  const url = generateAuthorizationEndpoint(csp);
  Object.keys(config).forEach(param =>
    url.searchParams.append(param, config[param]),
  );

  // Redirect to the authorization server
  window.location = url;
}

export const alexOptions = {
  createOAuthRequest,
  getConfig,
  pkceChallengeFromVerifier,
  oauthCrypto,
};
