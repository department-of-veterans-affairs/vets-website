import environment from 'platform/utilities/environment';
import {
  API_SIGN_IN_SERVICE_URL,
  EXTERNAL_APPS,
  GA,
  SIGNUP_TYPES,
} from 'platform/user/authentication/constants';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import { OAUTH_KEYS, CLIENT_IDS } from './constants';
import * as oauthCrypto from './crypto';

export async function pkceChallengeFromVerifier(v) {
  if (!v || !v.length) return null;
  const hashed = await oauthCrypto.sha256(v);
  return { codeChallenge: oauthCrypto.base64UrlEncode(hashed) };
}

export const saveStateAndVerifier = type => {
  /*
    Ensures saved state is not overwritten if location has state parameter.
  */
  if (window.location.search.includes('state')) return null;
  const storage = window.sessionStorage;

  // Create and store a random "state" value
  const state = oauthCrypto.generateRandomString(28);

  // Create and store a new PKCE code_verifier (the plaintext random secret)
  const codeVerifier = oauthCrypto.generateRandomString(64);

  // Sign up/Create account
  if (Object.values(SIGNUP_TYPES).includes(type)) {
    storage.setItem(`${type}_state`, state);
    storage.setItem(`${type}_code_verifier`, codeVerifier);
  } else {
    // Sign in
    storage.setItem(`state`, state);
    storage.setItem(`code_verifier`, codeVerifier);
  }

  return { state, codeVerifier };
};

export const removeStateAndVerifier = () => {
  const storage = window.sessionStorage;

  storage.removeItem('state');
  storage.removeItem('code_verifier');
};

export const updateStateAndVerifier = csp => {
  const storage = window.sessionStorage;

  storage.setItem(`state`, storage.getItem(`${csp}_signup_state`));
  storage.setItem(
    `code_verifier`,
    storage.getItem(`${csp}_signup_code_verifier`),
  );

  const signupTypesMap = Object.values(SIGNUP_TYPES).flatMap(type => [
    `${type}_state`,
    `${type}_code_verifier`,
  ]);

  Object.keys(storage)
    .filter(key => signupTypesMap.includes(key))
    .forEach(key => {
      storage.removeItem(key);
    });
};

/**
 *
 * @param {String} type
 */
export async function createOAuthRequest({
  application = '',
  clientId,
  config,
  passedQueryParams = {},
  type = '',
}) {
  const isDefaultOAuth = !application || clientId === CLIENT_IDS.WEB;
  const isMobileOAuth =
    [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE, EXTERNAL_APPS.VA_OCC_MOBILE].includes(
      application,
    ) || clientId === CLIENT_IDS.MOBILE;
  const { oAuthOptions } =
    config ??
    (externalApplicationsConfig[application] ||
      externalApplicationsConfig.default);

  /*
    Web - Generate state & codeVerifier if default oAuth
  */
  const { state, codeVerifier } = isDefaultOAuth && saveStateAndVerifier(type);

  /*
    Mobile - Use passed code_challenge
    Web - Generate code_challenge
  */
  const { codeChallenge } =
    isMobileOAuth && passedQueryParams
      ? passedQueryParams
      : await pkceChallengeFromVerifier(codeVerifier);

  // Build the authorization URL query params from config
  const oAuthParams = {
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent(
      clientId || oAuthOptions.clientId,
    ),
    [OAUTH_KEYS.ACR]: oAuthOptions.acr,
    [OAUTH_KEYS.RESPONSE_TYPE]: 'code',
    ...(isDefaultOAuth && { [OAUTH_KEYS.STATE]: state }),
    ...(passedQueryParams.gaClientId && {
      [GA.queryParams.sis]: passedQueryParams.gaClientId,
    }),
    [OAUTH_KEYS.CODE_CHALLENGE]: codeChallenge,
    [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: 'S256',
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ type }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  // Redirect to the authorization server
  return url.toString();
}

export const getCV = () => {
  const codeVerifier = sessionStorage.getItem('code_verifier');
  return { codeVerifier };
};

export function buildTokenRequest({
  code,
  redirectUri = `${environment.BASE_URL}`,
} = {}) {
  const { codeVerifier } = getCV();

  if (!code || !codeVerifier) return null;

  // Build the authorization URL
  const oAuthParams = {
    [OAUTH_KEYS.GRANT_TYPE]: 'authorization_code',
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent('web'),
    [OAUTH_KEYS.REDIRECT_URI]: encodeURIComponent(redirectUri),
    [OAUTH_KEYS.CODE]: code,
    [OAUTH_KEYS.CODE_VERIFIER]: codeVerifier,
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ endpoint: 'token' }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  return url;
}

export const requestToken = async ({ code, redirectUri }) => {
  const url = buildTokenRequest({
    code,
    redirectUri,
  });

  if (!url) return null;

  const response = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    removeStateAndVerifier();
  }

  return response;
};
