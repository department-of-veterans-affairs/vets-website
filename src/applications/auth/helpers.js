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

  // Has no email address
  const hasNoEmailAddress = !vet360ContactInformation?.email?.emailAddress;

  // Confirmation Date is null, undefined, or empty
  const confirmationDate = vet360ContactInformation?.email?.confirmationDate;
  const hasNoConfirmationDate = !confirmationDate;

  // Confirmation Date is before March 1, 2025
  const confirmationDateIsBefore = !hasNoConfirmationDate
    ? isBefore(parseISO(confirmationDate), beforeDate)
    : false;

  // Updated Date is null, undefined, or empty
  const updatedAt = vet360ContactInformation?.email?.updatedAt;
  const hasNoUpdatedDate = !updatedAt;

  // Updated Date is before March 1, 2025
  const updatedDateIsBefore = !hasNoUpdatedDate
    ? isBefore(parseISO(updatedAt), beforeDate)
    : false;

  return (
    [CSP_IDS.LOGIN_GOV, CSP_IDS.ID_ME].includes(loginType) &&
    profile?.verified && // Verified User
    vaProfile?.vaPatient && // VA Patient
    vaProfile?.facilities?.length > 0 && // Assigned to a facility
    (hasNoEmailAddress ||
      ((hasNoConfirmationDate || confirmationDateIsBefore) &&
        (hasNoUpdatedDate || updatedDateIsBefore))) // Need confirmation if BOTH dates are old/missing
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

export const checkPortalRequirements = ({
  isPortalNoticeInterstitialEnabled,
  userAttributes,
  provisioned,
}) => {
  const { vaPatient = false, facilities = [] } =
    userAttributes?.vaProfile || {};
  const redirectElligible =
    isPortalNoticeInterstitialEnabled && provisioned && vaPatient;

  const activeFacilities = ['692'];
  const approvedFacilities = [
    ...activeFacilities,
    '653',
    '687',
    '757',
    '668',
    '556',
  ];

  const hasApprovedFacility = facilities.some(facility =>
    approvedFacilities.includes(facility.facilityId),
  );
  const hasActiveFacility = facilities.some(facility =>
    activeFacilities.includes(facility.facilityId),
  );

  return {
    needsPortalNotice: redirectElligible && hasActiveFacility,
    needsMyHealth: redirectElligible && !hasApprovedFacility,
  };
};

export const parseAssuranceLevel = url => {
  if (typeof url !== 'string') return undefined;

  const match = url.match(/\/(loa|ial)\/(\d+)\/?$/i);
  if (!match) return undefined;

  const [, type, level] = match;
  return `${type.toLowerCase()}${level}`;
};
