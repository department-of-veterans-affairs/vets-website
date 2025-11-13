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
  const beforeDate = new Date('2025-03-01');
  const {
    profile = {},
    vaProfile = {},
    vet360ContactInformation,
  } = userAttributes;

  if (isEmailInterstitialEnabled === false || !profile || !vaProfile) {
    return false;
  }

  // Confirmation Date is null
  const hasNoConfirmationDate =
    vet360ContactInformation?.email?.confirmationDate === null;

  // Confirmation Date is before March 1, 2025
  const confirmationDateIsBefore =
    hasNoConfirmationDate === false
      ? isBefore(
          parseISO(
            userAttributes.vet360ContactInformation?.email?.confirmationDate,
          ),
          beforeDate,
        )
      : false;

  return (
    [CSP_IDS.LOGIN_GOV, CSP_IDS.ID_ME].includes(loginType) &&
    profile?.verified && // Verified User
    vaProfile?.vaPatient && // VA Patient
    vaProfile?.facilities?.length > 0 && // Assigned to a facility
    (hasNoConfirmationDate || confirmationDateIsBefore) // Confirmation Date related
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
