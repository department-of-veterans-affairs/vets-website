import * as Sentry from '@sentry/browser';
import {
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
} from 'platform/user/authentication/constants';
import {
  SENTRY_TAGS,
  getAuthError,
  AUTH_ERRORS,
} from 'platform/user/authentication/errors';
import {
  OAUTH_ERRORS,
  OAUTH_ERROR_RESPONSES,
  OAUTH_EVENTS,
  OAUTH_KEYS,
} from 'platform/utilities/oauth/constants';
import { requestToken } from 'platform/utilities/oauth/utilities';

export const checkReturnUrl = passedUrl => {
  return (
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.EBENEFITS]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP])
  );
};

export const generateSentryAuthError = ({
  error = {},
  loginType,
  authErrorCode,
  requestId,
}) => {
  const { message, errorCode: detailedErrorCode } = getAuthError(authErrorCode);
  Sentry.withScope(scope => {
    scope.setExtra('error', error);
    scope.setExtra(SENTRY_TAGS.REQUEST_ID, requestId);
    scope.setTag(SENTRY_TAGS.LOGIN_TYPE, loginType);
    scope.setTag(SENTRY_TAGS.ERROR_CODE, detailedErrorCode);
    Sentry.captureMessage(`Auth Error: ${detailedErrorCode} - ${message}`);
  });
};

export const handleTokenRequest = async ({
  code: authCode,
  state: authState,
  csp,
  generateOAuthError,
}) => {
  // Verify the state matches in storage
  if (
    !localStorage.getItem(OAUTH_KEYS.STATE) ||
    localStorage.getItem(OAUTH_KEYS.STATE) !== authState
  ) {
    generateOAuthError({
      oauthErrorCode: AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode,
      event: OAUTH_ERRORS.OAUTH_STATE_MISMATCH,
    });
  } else {
    // Matches - requestToken exchange
    try {
      await requestToken({ code: authCode, csp });
    } catch (error) {
      const { errors } = await error.json();
      const oauthErrorCode = OAUTH_ERROR_RESPONSES[errors];
      const event = OAUTH_EVENTS[errors] ?? OAUTH_EVENTS.ERROR_DEFAULT;
      generateOAuthError({ oauthErrorCode, event });
    }
  }
};
