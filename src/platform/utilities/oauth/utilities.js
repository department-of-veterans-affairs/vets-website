import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';
import {
  AUTH_EVENTS,
  EXTERNAL_APPS,
  GA,
  SIGNUP_TYPES,
} from 'platform/user/authentication/constants';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import {
  ALL_STATE_AND_VERIFIERS,
  API_SIGN_IN_SERVICE_URL,
  CLIENT_IDS,
  COOKIES,
  OAUTH_ALLOWED_PARAMS,
  OAUTH_ENDPOINTS,
  OAUTH_KEYS,
} from './constants';
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
  if (window.location.search.includes(OAUTH_KEYS.STATE)) return null;
  const storage = localStorage;

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
    storage.setItem(OAUTH_KEYS.STATE, state);
    storage.setItem(OAUTH_KEYS.CODE_VERIFIER, codeVerifier);
  }

  return { state, codeVerifier };
};

export const removeStateAndVerifier = () => {
  const storage = localStorage;

  Object.keys(storage)
    .filter(key => ALL_STATE_AND_VERIFIERS.includes(key))
    .forEach(key => {
      storage.removeItem(key);
    });
};

export const updateStateAndVerifier = csp => {
  const storage = localStorage;

  storage.setItem(OAUTH_KEYS.STATE, storage.getItem(`${csp}_signup_state`));
  storage.setItem(
    OAUTH_KEYS.CODE_VERIFIER,
    storage.getItem(`${csp}_signup_code_verifier`),
  );

  const signupTypesMap = [
    `logingov_signup_state`,
    `logingov_signup_code_verifier`,
    `idme_signup_state`,
    `idme_signup_code_verifier`,
  ];

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
  passedOptions = {},
  type = '',
  acr,
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
  const useType = passedOptions.isSignup
    ? type.slice(0, type.indexOf('_'))
    : type;

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
    [OAUTH_KEYS.ACR]:
      acr ||
      (passedOptions.isSignup
        ? oAuthOptions.acrSignup[type]
        : oAuthOptions.acr[type]),
    [OAUTH_KEYS.RESPONSE_TYPE]: OAUTH_ALLOWED_PARAMS.CODE,
    ...(isDefaultOAuth && { [OAUTH_KEYS.STATE]: state }),
    ...(passedQueryParams.gaClientId && {
      [GA.queryParams.sis]: passedQueryParams.gaClientId,
    }),
    [OAUTH_KEYS.CODE_CHALLENGE]: codeChallenge,
    [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: OAUTH_ALLOWED_PARAMS.S256,
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ type: useType }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  recordEvent({ event: `login-attempted-${type}-oauth-${clientId}` });

  return url.toString();
}

export const getCV = () => {
  const storage = localStorage;
  const codeVerifier = storage.getItem(OAUTH_KEYS.CODE_VERIFIER);
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
    [OAUTH_KEYS.GRANT_TYPE]: OAUTH_ALLOWED_PARAMS.AUTH_CODE,
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent(CLIENT_IDS.WEB),
    [OAUTH_KEYS.REDIRECT_URI]: encodeURIComponent(redirectUri),
    [OAUTH_KEYS.CODE]: code,
    [OAUTH_KEYS.CODE_VERIFIER]: codeVerifier,
  };

  const url = new URL(
    API_SIGN_IN_SERVICE_URL({ endpoint: OAUTH_ENDPOINTS.TOKEN }),
  );

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  return url;
}

export const requestToken = async ({ code, redirectUri, csp }) => {
  const url = buildTokenRequest({
    code,
    redirectUri,
  });

  if (!url) return null;

  const response = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
  });

  recordEvent({
    event: response.ok
      ? `login-success-${csp}-oauth-tokenexchange`
      : `login-failure-${csp}-oauth-tokenexchange`,
  });

  if (response.ok) {
    removeStateAndVerifier();
  }

  return response;
};

export const refresh = async () => {
  const url = new URL(
    API_SIGN_IN_SERVICE_URL({ endpoint: OAUTH_ENDPOINTS.REFRESH }),
  );

  return fetch(url.href, {
    method: 'POST',
    credentials: 'include',
  });
};

export const infoTokenExists = () => {
  return document.cookie.includes(COOKIES.INFO_TOKEN);
};

export const formatInfoCookie = cookieStringRaw => {
  const decoded = cookieStringRaw.includes('%')
    ? decodeURIComponent(cookieStringRaw)
    : cookieStringRaw;
  return decoded.split(',+:').reduce((obj, cookieString) => {
    const [key, value] = cookieString.replace(/{:|}/g, '').split('=>');
    const formattedValue = value.replaceAll('++00:00', '').replaceAll('+', ' ');
    return { ...obj, [key]: new Date(formattedValue) };
  }, {});
};

export const getInfoToken = () => {
  if (!infoTokenExists()) return null;

  return document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((_, [cookieKey, cookieValue]) => ({
      ..._,
      ...(cookieKey.includes(COOKIES.INFO_TOKEN) && {
        ...formatInfoCookie(decodeURIComponent(cookieValue)),
      }),
    }));
};

export const removeInfoToken = () => {
  if (!infoTokenExists()) return null;

  const updatedCookie = document.cookie.split(';').reduce((_, cookie) => {
    let tempCookieString = _;
    if (!cookie.includes(COOKIES.INFO_TOKEN)) {
      tempCookieString += `${cookie};`.trim();
    }
    return tempCookieString;
  }, '');
  document.cookie = updatedCookie;
  return undefined;
};

export const checkOrSetSessionExpiration = response => {
  const sessionExpirationSAML = response.headers.get('X-Session-Expiration');

  if (sessionExpirationSAML) {
    localStorage.setItem('sessionExpiration', sessionExpirationSAML);
    return true;
  }

  if (infoTokenExists()) {
    const {
      access_token_expiration: atExpiration,
      refresh_token_expiration: sessionExpirationOAuth,
    } = getInfoToken();

    localStorage.setItem('atExpires', atExpiration);
    localStorage.setItem('sessionExpiration', sessionExpirationOAuth);
    return true;
  }

  return false;
};

export const logoutUrlSiS = () => {
  return new URL(API_SIGN_IN_SERVICE_URL({ endpoint: 'logout' })).href;
};

export const logoutEvent = async (signInServiceName, wait = {}) => {
  const { duration = 500, shouldWait } = wait;
  const sleep = time => {
    return new Promise(resolve => setTimeout(resolve, time));
  };
  recordEvent({ event: `${AUTH_EVENTS.OAUTH_LOGOUT}-${signInServiceName}` });

  updateLoggedInStatus(false);

  if (shouldWait) {
    await sleep(duration);
    teardownProfileSession();
  } else {
    teardownProfileSession();
  }
};
