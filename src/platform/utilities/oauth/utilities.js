/* eslint-disable camelcase */
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import { updateLoggedInStatus } from 'platform/user/authentication/actions';
import {
  AUTH_EVENTS,
  EXTERNAL_APPS,
  GA,
  SIGNUP_TYPES,
  CSP_IDS,
} from 'platform/user/authentication/constants';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import {
  ALL_STATE_AND_VERIFIERS,
  API_SIGN_IN_SERVICE_URL,
  APPROVED_OAUTH_APPS,
  CLIENT_IDS,
  COOKIES,
  FORCED_VERIFICATION_ACRS,
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
  const isDefaultOAuth =
    APPROVED_OAUTH_APPS.includes(application) ||
    !application ||
    [CLIENT_IDS.VAWEB, CLIENT_IDS.VAMOCK].includes(clientId);
  const isMobileOAuth =
    [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE, EXTERNAL_APPS.VA_OCC_MOBILE].includes(
      application,
    ) || [CLIENT_IDS.VAMOBILE].includes(clientId);
  const { oAuthOptions } =
    config ??
    (externalApplicationsConfig[application] ||
      externalApplicationsConfig.default);
  const useType = passedOptions.isSignup
    ? type.slice(0, type.indexOf('_'))
    : type;

  const usedAcr =
    passedOptions?.forceVerify === 'required'
      ? FORCED_VERIFICATION_ACRS[type]
      : acr ?? oAuthOptions.acr[type];

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

  const usedClientId = clientId || oAuthOptions.clientId;
  // Build the authorization URL query params from config
  const oAuthParams = {
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent(usedClientId),
    [OAUTH_KEYS.ACR]: usedAcr,
    [OAUTH_KEYS.RESPONSE_TYPE]: OAUTH_ALLOWED_PARAMS.CODE,
    ...(isDefaultOAuth && { [OAUTH_KEYS.STATE]: state }),
    ...(passedQueryParams.gaClientId && {
      [GA.queryParams.sis]: passedQueryParams.gaClientId,
    }),
    [OAUTH_KEYS.CODE_CHALLENGE]: codeChallenge,
    [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: OAUTH_ALLOWED_PARAMS.S256,
    ...(passedQueryParams.operation && {
      [OAUTH_ALLOWED_PARAMS.OPERATION]: passedQueryParams.operation,
    }),
    ...(isMobileOAuth &&
      passedQueryParams.scope && {
        [OAUTH_ALLOWED_PARAMS.SCOPE]: passedQueryParams.scope,
      }),
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ type: useType }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  sessionStorage.setItem('ci', usedClientId);
  if (environment.isProduction() && !environment.isTest()) {
    recordEvent({ event: `login-attempted-${type}-oauth-${clientId}` });
  }
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

  const clientId = sessionStorage.getItem(COOKIES.CI) || CLIENT_IDS.VAWEB;

  // Build the authorization URL
  const oAuthParams = {
    [OAUTH_KEYS.GRANT_TYPE]: OAUTH_ALLOWED_PARAMS.AUTH_CODE,
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent(clientId),
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

  if (environment.isProduction() && !environment.isTest()) {
    recordEvent({
      event: response.ok
        ? `login-success-${csp}-oauth-tokenexchange`
        : `login-failure-${csp}-oauth-tokenexchange`,
    });
  }

  if (response.ok) {
    removeStateAndVerifier();
  }

  return response;
};

const activeRefreshRequests = new Map();
const refreshTimeout = 10000; // 10 seconds

export const refresh = async ({ type }) => {
  if (activeRefreshRequests.has(type)) {
    return activeRefreshRequests.get(type);
  }

  const requestPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), refreshTimeout);
    try {
      const url = new URL(
        API_SIGN_IN_SERVICE_URL({ endpoint: OAUTH_ENDPOINTS.REFRESH, type }),
      );
      return await fetch(url.href, {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
      activeRefreshRequests.delete(type);
    }
  })();

  activeRefreshRequests.set(type, requestPromise);

  return requestPromise;
};

export const infoTokenExists = () => {
  return document.cookie.includes(COOKIES.INFO_TOKEN);
};

export const formatInfoCookie = cookieStringRaw => {
  const parsedCookie = JSON.parse(cookieStringRaw);

  const access_token_expiration = new Date(
    parsedCookie.access_token_expiration,
  );

  const refresh_token_expiration = new Date(
    parsedCookie.refresh_token_expiration,
  );
  return { access_token_expiration, refresh_token_expiration };
};

export const getInfoToken = () => {
  if (!infoTokenExists()) return null;

  const cookie = `; ${document.cookie}`;
  const parts = cookie.split(`; ${COOKIES.INFO_TOKEN}=`);

  if (parts.length === 2) {
    const value = parts
      .pop()
      .split(';')
      .shift();
    return formatInfoCookie(decodeURIComponent(value));
  }

  return null;
};

export const getAccessTokenExpiration = () => {
  const info = getInfoToken();
  const exp = info?.access_token_expiration;

  if (!exp) return null;

  const expDate = exp instanceof Date ? exp : new Date(exp);
  if (Number.isNaN(expDate.getTime())) return null;

  return expDate;
};

export const msUntilAccessTokenExpiration = () => {
  const exp = getAccessTokenExpiration();
  if (!exp) return null;
  return exp.getTime() - Date.now();
};

export const isAccessTokenExpiringSoon = (thresholdSeconds = 30) => {
  if (!infoTokenExists()) return false;

  const msRemaining = msUntilAccessTokenExpiration();
  if (msRemaining === null) return false;

  return msRemaining <= thresholdSeconds * 1000;
};

export const refreshIfAccessTokenExpiringSoon = async ({
  thresholdSeconds = 30,
  type,
} = {}) => {
  if (!type) return false;
  if (!isAccessTokenExpiringSoon(thresholdSeconds)) return false;

  await refresh({ type });
  return true;
};

export const removeInfoToken = () => {
  if (!infoTokenExists()) return null;

  document.cookie = `${
    COOKIES.INFO_TOKEN
  }=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

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

export const logoutUrlSiS = ({ queryParams = {} } = {}) => {
  const url = new URL(API_SIGN_IN_SERVICE_URL({ endpoint: 'logout' }));
  const clientId = sessionStorage.getItem(COOKIES.CI);
  const { searchParams } = url;

  searchParams.append(
    OAUTH_KEYS.CLIENT_ID,
    clientId && Object.values(CLIENT_IDS).includes(clientId)
      ? clientId
      : CLIENT_IDS.VAWEB,
  );

  Object.entries(queryParams).forEach(([key, value]) => {
    searchParams.append(key, value);
  });

  return url.href;
};

export const logoutEvent = async (signInServiceName, wait = {}) => {
  const { duration = 500, shouldWait } = wait;
  const sleep = time => {
    return new Promise(resolve => setTimeout(resolve, time));
  };
  if (environment.isProduction() && !environment.isTest()) {
    recordEvent({ event: `${AUTH_EVENTS.OAUTH_LOGOUT}-${signInServiceName}` });
  }

  sessionStorage.removeItem('shouldRedirectExpiredSession');
  updateLoggedInStatus(false);

  if (shouldWait) {
    await sleep(duration);
    teardownProfileSession();
  } else {
    teardownProfileSession();
  }
};

export function createOktaOAuthRequest({
  clientId,
  codeChallenge,
  state,
  loginType,
}) {
  const oAuthParams = {
    [OAUTH_KEYS.CLIENT_ID]: encodeURIComponent(clientId),
    [OAUTH_KEYS.ACR]: CSP_IDS.LOGIN_GOV === loginType ? 'ial2' : 'loa3',
    [OAUTH_KEYS.STATE]: state,
    [OAUTH_KEYS.RESPONSE_TYPE]: OAUTH_ALLOWED_PARAMS.CODE,
    [OAUTH_KEYS.CODE_CHALLENGE]: codeChallenge,
    [OAUTH_KEYS.CODE_CHALLENGE_METHOD]: OAUTH_ALLOWED_PARAMS.S256,
  };

  const url = new URL(API_SIGN_IN_SERVICE_URL({ type: loginType }));

  Object.keys(oAuthParams).forEach(param =>
    url.searchParams.append(param, oAuthParams[param]),
  );

  sessionStorage.setItem('ci', clientId);
  if (environment.isProduction() && !environment.isTest()) {
    recordEvent({ event: `login-attempted-${loginType}-oauth-${clientId}` });
  }
  return url.toString();
}
