import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import recordEvent from '../../../monitoring/record-event';
import {
  authnSettings,
  setRavenLoginType,
  clearRavenLoginType,
} from '../../authentication/utilities';
import get from '../../../utilities/data/get';
import localStorage from '../../../utilities/storage/localStorage';

import {
  isVet360Configured,
  mockContactInformation,
} from '../../../../applications/personalization/profile360/vet360/util/local-vet360';

const commonServices = {
  EMIS: 'EMIS',
  MVI: 'MVI',
  Vet360: 'Vet360',
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
      },
    },
    meta,
  } = camelCaseKeysRecursive(json);

  const userState = {
    accountType: loa.current,
    signIn,
    dob,
    email,
    gender,
    loa,
    multifactor,
    prefillsAvailable,
    savedForms,
    services,
    userFullName: {
      first,
      middle,
      last,
    },
    verified,
    vet360: isVet360Configured()
      ? vet360ContactInformation
      : mockContactInformation,
  };

  if (meta && veteranStatus === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.EMIS,
    ).status;
    userState.veteranStatus = getErrorStatusDesc(errorStatus);
  } else {
    userState.isVeteran = veteranStatus.isVeteran;
    userState.veteranStatus = {
      isVeteran: veteranStatus.isVeteran,
      veteranStatus,
      servedInMilitary: veteranStatus.servedInMilitary,
    };
  }

  if (meta && vaProfile === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.MVI,
    ).status;
    userState.status = getErrorStatusDesc(errorStatus);
  } else {
    userState.status = vaProfile.status;
  }

  // This one is checking userState because there's no extra mapping and it's
  // easier to leave the mocking code the way it is
  if (meta && userState.vet360 === null) {
    const errorStatus = meta.errors.find(
      error => error.externalService === commonServices.Vet360,
    ).status;
    userState.vet360 = { status: getErrorStatusDesc(errorStatus) };
  }

  return userState;
}

// Flag to indicate an active session for initial page loads.
// It's distinct from the currentlyLoggedIn state, which
// serves as confirmation that the user is logged in and
// as a trigger to properly update any components that subscribe to it.
export const hasSession = () => localStorage.getItem('hasSession');

function compareLoginPolicy(loginPolicy) {
  let attemptedLoginPolicy = sessionStorage.getItem(
    authnSettings.PENDING_LOGIN_TYPE,
  );

  attemptedLoginPolicy =
    attemptedLoginPolicy === 'mhv' ? 'myhealthevet' : attemptedLoginPolicy;

  if (loginPolicy !== attemptedLoginPolicy) {
    recordEvent({
      event: `login-mismatch-${attemptedLoginPolicy}-${loginPolicy}`,
    });
  }
}

export function setupProfileSession(payload) {
  localStorage.setItem('hasSession', true);
  const userData = get('data.attributes.profile', payload, {});
  const { firstName, signIn, loa } = userData;

  const loginPolicy = get('serviceName', signIn, null);
  compareLoginPolicy(loginPolicy);

  // Since localStorage coerces everything into String,
  // this avoids setting the first name to the string 'null'.
  if (firstName) localStorage.setItem('userFirstName', firstName);

  if (sessionStorage.getItem(authnSettings.REGISTRATION_PENDING)) {
    // Record GA success event for the register method.
    recordEvent({ event: `register-success-${loginPolicy}` });
    sessionStorage.removeItem('registrationPending');
  } else {
    // Report GA success event for the login method.
    recordEvent({ event: `login-success-${loginPolicy}` });
  }

  sessionStorage.removeItem(authnSettings.PENDING_LOGIN_TYPE);

  // Set Sentry Tag so we can associate errors with the login policy
  setRavenLoginType(loginPolicy);

  // Report out the current level of assurance for the user.
  if (loa && loa.current) {
    recordEvent({ event: `login-loa-current-${loa.current}` });
  }
}

export function teardownProfileSession() {
  // Legacy keys (entryTime, userToken) can be removed
  // after session cookie is fully in place.
  const sessionKeys = ['hasSession', 'userFirstName', 'entryTime', 'userToken'];

  for (const key of sessionKeys) {
    localStorage.removeItem(key);
  }

  clearRavenLoginType();
}
