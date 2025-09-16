import * as Sentry from '@sentry/browser';
import {
  EXTERNAL_APPS,
  ARP_APPS,
  EXTERNAL_REDIRECTS,
  CSP_IDS,
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
import { isBefore, parseISO } from 'date-fns';

export const checkReturnUrl = passedUrl => {
  return (
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.SMHD]) ||
    passedUrl.includes(EXTERNAL_REDIRECTS[ARP_APPS.FORM21A])
  );
};

export const emailNeedsConfirmation = ({
  isEmailInterstitialEnabled,
  loginType,
  userAttributes,
}) => {
  return (
    isEmailInterstitialEnabled &&
    [CSP_IDS.LOGIN_GOV, CSP_IDS.ID_ME].includes(loginType) &&
    userAttributes.profile?.verified &&
    userAttributes.vaProfile?.vaPatient &&
    userAttributes.vaProfile?.facilities?.length > 0 &&
    isBefore(
      parseISO(userAttributes.vet360ContactInformation?.email?.updatedAt),
      new Date('2025-03-01'),
    )
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
  code,
  state,
  csp,
  generateOAuthError,
}) => {
  // Verify the state matches in storage
  if (
    !localStorage.getItem(OAUTH_KEYS.STATE) ||
    localStorage.getItem(OAUTH_KEYS.STATE) !== state
  ) {
    generateOAuthError({
      oauthErrorCode: AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode,
      event: OAUTH_ERRORS.OAUTH_STATE_MISMATCH,
    });
  } else {
    // Matches - requestToken exchange
    const response = await requestToken({ code, csp });

    if (!response.ok) {
      const data = await response?.json();
      const oauthErrorCode = OAUTH_ERROR_RESPONSES[(data?.errors)];
      const event = OAUTH_EVENTS[(data?.errors)] ?? OAUTH_EVENTS.ERROR_DEFAULT;
      generateOAuthError({ oauthErrorCode, event });
    }
  }
};
