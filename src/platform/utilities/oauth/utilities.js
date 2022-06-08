import environment from 'platform/utilities/environment';
import { API_SIGN_IN_SERVICE_URL } from 'platform/user/authentication/constants';
import { OAUTH_KEYS } from './constants';
import * as oauthCrypto from './crypto';

export async function pkceChallengeFromVerifier(v) {
  if (!v || !v.length) return null;
  const hashed = await oauthCrypto.sha256(v);
  return oauthCrypto.base64UrlEncode(hashed);
}

export const saveStateAndVerifier = () => {
  /*
    Ensures saved state is not overwritten if location has state parameter.
  */
  if (window.location.search.includes('state')) return null;
  const storage = window.sessionStorage;

  // Create and store a random "state" value
  const state = oauthCrypto.generateRandomString(28);

  // Create and store a new PKCE code_verifier (the plaintext random secret)
  const codeVerifier = oauthCrypto.generateRandomString(64);

  storage.setItem('state', state);
  storage.setItem('code_verifier', codeVerifier);

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
  const oAuthParams = {
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent('web'),
    [OAUTH_KEYS.REDIRECT_URI]: encodeURIComponent(
      `${environment.BASE_URL}/auth/login/callback`,
    ),
    [OAUTH_KEYS.RESPONSE_TYPE]: 'code',
    [OAUTH_KEYS.SCOPE]: 'email',
    [OAUTH_KEYS.STATE]: state,
    [OAUTH_KEYS.CODE_CHALLENGE]: codeChallenge,
    [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: 'S256',
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ type: csp }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  // Redirect to the authorization server
  window.location = url;
}
