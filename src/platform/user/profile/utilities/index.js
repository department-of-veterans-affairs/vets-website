import recordEvent from '../../../monitoring/record-event';
import camelCaseObjectKeys from '../../../utilities/data/camelCaseObjectKeys';
import conditionalStorage from '../../../utilities/storage/conditionalStorage';
import { isVet360Configured, mockContactInformation } from '../../../../applications/personalization/profile360/vet360/util/local-vet360';

export function mapRawUserDataToState(json) {
  const {
    data: {
      attributes: {
        in_progress_forms: savedForms,
        prefills_available: prefillsAvailable,
        profile: {
          authn_context: authnContext,
          birth_date: dob,
          email,
          first_name: first,
          gender,
          last_name: last,
          loa,
          middle_name: middle,
          multifactor,
          verified
        },
        services,
        va_profile: {
          status
        },
        vet360_contact_information: vet360ContactInformation,
        veteran_status: {
          is_veteran: isVeteran,
          status: veteranStatus,
          served_in_military: servedInMilitary,
        },
      }
    }
  } = json;

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
      last
    },
    verified,
    vet360: isVet360Configured() ? camelCaseObjectKeys(vet360ContactInformation) : camelCaseObjectKeys(mockContactInformation),
    veteranStatus: {
      isVeteran,
      veteranStatus,
      servedInMilitary
    }
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
