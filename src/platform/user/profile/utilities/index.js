import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  setSentryLoginType,
  clearSentryLoginType,
} from '../../authentication/utilities';
import localStorage from '~/platform/utilities/storage/localStorage';

import { ssoKeepAliveSession } from '~/platform/utilities/sso';

import {
  isVAProfileServiceConfigured,
  mockContactInformation,
} from '@@vap-svc/util/local-vapsvc';

const commonServices = {
  EMIS: 'EMIS',
  MVI: 'MVI',
  VA_PROFILE: 'Vet360',
};

function getErrorStatusDesc(code) {
  if (code === 404) {
    return 'NOT_FOUND';
  }

  if (code === 401) {
    return 'NOT_AUTHORIZED';
  }

  return 'SERVER_ERROR';
}

export function mapRawUserDataToState(json) {
  const {
    data: {
      attributes: {
        inProgressForms: savedForms,
        prefillsAvailable,
        profile: {
          signIn,
          birthDate: dob,
          email,
          firstName: first,
          gender,
          lastName: last,
          loa,
          middleName: middle,
          multifactor,
          verified,
        },
        services,
        vaProfile,
        vet360ContactInformation,
        veteranStatus,
        session,
      },
    },
    meta,
  } = camelCaseKeysRecursive(json);

  const userState = {
    accountType: loa.current,
    dob,
    email,
    gender,
    isCernerPatient: vaProfile?.isCernerPatient,
    loa,
    multifactor,
    prefillsAvailable,
    savedForms,
    services,
    signIn,
    userFullName: {
      first,
      middle,
      last,
    },
    verified,
    vapContactInfo: isVAProfileServiceConfigured()
      ? vet360ContactInformation
      : mockContactInformation,
    session,
    veteranStatus: {},
  };

  if (meta && veteranStatus === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.EMIS,
    ).status;
    userState.veteranStatus.status = getErrorStatusDesc(errorStatus);
  } else {
    userState.veteranStatus = { ...veteranStatus };
  }

  if (meta && vaProfile === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.MVI,
    ).status;
    userState.status = getErrorStatusDesc(errorStatus);
  } else {
    userState.status = vaProfile.status;
    if (vaProfile.facilities) {
      userState.facilities = vaProfile.facilities;
    }
    userState.vaPatient = vaProfile.vaPatient;
    userState.mhvAccountState = vaProfile.mhvAccountState;
  }

  // This one is checking userState because there's no extra mapping and it's
  // easier to leave the mocking code the way it is
  if (meta && userState.vapContactInfo === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.VA_PROFILE,
    ).status;
    userState.vapContactInfo = { status: getErrorStatusDesc(errorStatus) };
  }

  return userState;
}

// Flag to indicate an active session for initial page loads.
// It's distinct from the currentlyLoggedIn state, which
// serves as confirmation that the user is logged in and
// as a trigger to properly update any components that subscribe to it.
export const hasSession = () => localStorage.getItem('hasSession');

// hasSessionSSO will only ever be true or false.
// Wrapping in JSON.parse enables making boolean checks with this function call.
export const hasSessionSSO = () =>
  JSON.parse(localStorage.getItem('hasSessionSSO'));

export function setupProfileSession(userProfile) {
  const { firstName, signIn } = userProfile;
  const loginType = signIn?.serviceName || null;
  localStorage.setItem('hasSession', true);
  if (signIn?.ssoe) {
    ssoKeepAliveSession();
  }

  // Since localStorage coerces everything into String,
  // this avoids setting the first name to the string 'null'.
  if (firstName) localStorage.setItem('userFirstName', firstName);

  // Set Sentry Tag so we can associate errors with the login policy
  setSentryLoginType(loginType);
}

export function teardownProfileSession() {
  // Legacy keys (entryTime, userToken) can be removed
  // after session cookie is fully in place.
  const sessionKeys = [
    'hasSession',
    'userFirstName',
    'sessionExpiration',
    'hasSessionSSO',
    'sessionExpirationSSO',
  ];
  for (const key of sessionKeys) localStorage.removeItem(key);
  sessionStorage.removeItem('shouldRedirectExpiredSession');
  clearSentryLoginType();
}
