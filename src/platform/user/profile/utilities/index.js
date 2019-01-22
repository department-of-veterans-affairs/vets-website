import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import recordEvent from '../../../monitoring/record-event';
import get from '../../../utilities/data/get';
import localStorage from '../../../utilities/storage/localStorage';

import {
  isVet360Configured,
  mockContactInformation,
} from '../../../../applications/personalization/profile360/vet360/util/local-vet360';

export function mapRawUserDataToState(json) {
  const {
    data: {
      attributes: {
        inProgressForms: savedForms,
        prefillsAvailable,
        profile: {
          authnContext,
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
    errors,
  } = camelCaseKeysRecursive(json);

  const userState = {
    accountType: loa.current,
    authnContext,
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

  if (veteranStatus === null) {
    const errorStatus = errors.find(error => error.service === 'EMIS').status;
    userState.veteranStatus.veteranStatus = errorStatus;
  } else {
    userState.isVeteran = veteranStatus.isVeteran;
    userState.veteranStatus = {
      isVeteran: veteranStatus.isVeteran,
      veteranStatus,
      servedInMilitary: veteranStatus.servedInMilitary,
    };
  }

  if (vaProfile === null) {
    const errorStatus = errors.find(error => error.service === 'MVI').status;
    userState.status = errorStatus;
  } else {
    userState.status = vaProfile.status;
  }

  // This one is checking userState because there's no extra mapping and it's
  // easier to leave the mocking code the way it is
  if (userState.vet360 === null) {
    const errorStatus = errors.find(error => error.service === 'Vet360').status;
    userState.vet360 = { status: errorStatus };
  }

  return userState;
}

// Flag to indicate an active session for initial page loads.
// It's distinct from the currentlyLoggedIn state, which
// serves as confirmation that the user is logged in and
// as a trigger to properly update any components that subscribe to it.
export const hasSession = () => localStorage.getItem('hasSession');

export function setupProfileSession(payload) {
  localStorage.setItem('hasSession', true);
  const userData = get('data.attributes.profile', payload, {});
  const { firstName, authnContext, loa } = userData;
  const loginPolicy = authnContext || 'idme';

  // Since localStorage coerces everything into String,
  // this avoids setting the first name to the string 'null'.
  if (firstName) localStorage.setItem('userFirstName', firstName);

  // Report success for the login method.
  recordEvent({ event: `login-success-${loginPolicy}` });

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
}
