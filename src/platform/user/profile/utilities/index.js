import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import recordEvent from '../../../monitoring/record-event';
import conditionalStorage from '../../../utilities/storage/conditionalStorage';
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
        vaProfile: { status },
        vet360ContactInformation,
        veteranStatus: { isVeteran, status: veteranStatus, servedInMilitary },
      },
    },
  } = camelCaseKeysRecursive(json);

  return {
    accountType: loa.current,
    authnContext,
    dob,
    email,
    gender,
    isVeteran,
    loa,
    multifactor,
    prefillsAvailable,
    savedForms,
    services,
    status,
    userFullName: {
      first,
      middle,
      last,
    },
    verified,
    vet360: isVet360Configured()
      ? vet360ContactInformation
      : mockContactInformation,
    veteranStatus: {
      isVeteran,
      veteranStatus,
      servedInMilitary,
    },
  };
}

export function setupProfileSession(payload) {
  const userData = payload.data.attributes.profile;
  // Since sessionStorage/localStorage coerces everything into String,
  // this conditional avoids setting the first name to the string 'null'.
  if (userData.first_name) {
    conditionalStorage().setItem('userFirstName', userData.first_name);
  }
  // Report out the current level of assurance for the user
  recordEvent({ event: `login-loa-current-${userData.loa.current}` });
}

export function teardownProfileSession() {
  for (const key of ['entryTime', 'userToken', 'userFirstName']) {
    conditionalStorage().removeItem(key);
  }
}
