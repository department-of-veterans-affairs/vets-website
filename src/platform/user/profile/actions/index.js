import recordEvent from '../../../monitoring/record-event';
import { removeFormApi } from '../../../../applications/common/schemaform/save-in-progress/api';
import { updateLoggedInStatus } from '../../authentication/actions';
import environment from '../../../utilities/environment';

export const UPDATE_PROFILE_FIELDS = 'UPDATE_PROFILE_FIELDS';
export const PROFILE_LOADING_FINISHED = 'PROFILE_LOADING_FINISHED';
export const REMOVING_SAVED_FORM = 'REMOVING_SAVED_FORM';
export const REMOVING_SAVED_FORM_SUCCESS = 'REMOVING_SAVED_FORM_SUCCESS';
export const REMOVING_SAVED_FORM_FAILURE = 'REMOVING_SAVED_FORM_FAILURE';
export const UPDATE_VET360_PROFILE_FIELD = 'UPDATE_VET360_PROFILE_FIELD';

export * from './mhv';

export function updateProfileFields(newState) {
  return {
    type: UPDATE_PROFILE_FIELDS,
    newState
  };
}

export function profileLoadingFinished() {
  return {
    type: PROFILE_LOADING_FINISHED
  };
}

export function getProfile() {
  return (dispatch) => {
    fetch(`${environment.API_URL}/v0/user`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Token token=${sessionStorage.userToken}`
      })
    }).then(response => {
      if (response.ok) return response.json();
      const error = new Error(response.statusText);
      error.status = response.status;
      throw error;
    }).then(json => {
      const userData = json.data.attributes.profile;
      // sessionStorage coerces everything into String. this if-statement
      // is to prevent the firstname being set to the string 'Null'
      if (userData.first_name) {
        sessionStorage.setItem('userFirstName', userData.first_name);
      }
      // Report out the current level of assurance for the user
      recordEvent({ event: `login-loa-current-${userData.loa.current}` });
      dispatch(updateProfileFields({
        savedForms: json.data.attributes.in_progress_forms,
        prefillsAvailable: json.data.attributes.prefills_available,
        accountType: userData.loa.current,
        email: userData.email,
        userFullName: {
          first: userData.first_name,
          middle: userData.middle_name,
          last: userData.last_name,
        },
        // vet360: TODO: camelcaseObject(json.data.attributes.vet360_contact_information)
        // vet360: json.data.attributes.vet360_contact_information,
        vet360: {
          mobilePhone: {
            areaCode: '503',
            countryCode: '1',
            createdAt: '2018-04-21T20:09:50Z',
            effectiveEndDate: '2018-04-21T20:09:50Z',
            effectiveStartDate: '2018-04-21T20:09:50Z',
            extension: '0000',
            id: 123,
            isInternational: false,
            isTextable: true,
            isTty: true,
            isVoicemailable: true,
            phoneNumber: '5551234',
            phoneType: 'MOBILE',
            sourceDate: '2018-04-21T20:09:50Z',
            updatedAt: '2018-04-21T20:09:50Z'
          },
          homePhone: {
            areaCode: '503',
            countryCode: '1',
            createdAt: '2018-04-21T20:09:50Z',
            effectiveEndDate: '2018-04-21T20:09:50Z',
            effectiveStartDate: '2018-04-21T20:09:50Z',
            extension: '0000',
            id: 123,
            isInternational: false,
            isTextable: true,
            isTty: true,
            isVoicemailable: true,
            phoneNumber: '222222',
            phoneType: 'HOME',
            sourceDate: '2018-04-21T20:09:50Z',
            updatedAt: '2018-04-21T20:09:50Z'
          },
          faxNumber: {},
          temporaryPhone: {
            areaCode: '503',
            countryCode: '1',
            createdAt: '2018-04-21T20:09:50Z',
            effectiveEndDate: '2018-04-21T20:09:50Z',
            effectiveStartDate: '2018-04-21T20:09:50Z',
            extension: '0000',
            id: 123,
            isInternational: false,
            isTextable: true,
            isTty: true,
            isVoicemailable: true,
            phoneNumber: '5555555',
            phoneType: 'MOBILE',
            sourceDate: '2018-04-21T20:09:50Z',
            updatedAt: '2018-04-21T20:09:50Z'
          },
          mailingAddress: {
            addressLine1: '1493 Martin Luther King Rd',
            addressLine2: 'string',
            addressLine3: 'string',
            addressPou: 'CORRESPONDENCE',
            addressType: 'domestic',
            city: 'Fulton',
            // country: 'United States of America',
            countryName: 'USA',
            countryCodeFips: 'US',
            countryCodeIso2: 'US',
            countryCodeIso3: 'USA',
            createdAt: '2018-04-21T20:09:50Z',
            effectiveEndDate: '2018-04-21T20:09:50Z',
            effectiveStartDate: '2018-04-21T20:09:50Z',
            id: 123,
            internationalPostalCode: '54321',
            province: 'string',
            sourceDate: '2018-04-21T20:09:50Z',
            // stateAbbr: 'NY',
            stateCode: 'NY',
            updatedAt: '2018-04-21T20:09:50Z',
            zipCode: '97062',
            zipCodeSuffix: '1234'
          },
        },
        authnContext: userData.authn_context,
        loa: userData.loa,
        multifactor: userData.multifactor,
        verified: userData.verified,
        gender: userData.gender,
        dob: userData.birth_date,
        status: json.data.attributes.va_profile.status,
        veteranStatus: json.data.attributes.veteran_status.status,
        isVeteran: json.data.attributes.veteran_status.is_veteran,
        services: json.data.attributes.services,
        mhv: {
          account: { state: json.data.attributes.mhv_account_state },
          terms: { accepted: json.data.attributes.health_terms_current }
        }
      }));
      dispatch(updateLoggedInStatus(true));
    }).catch(error => {
      if (error.status === 401) {
        for (const key of ['entryTime', 'userToken', 'userFirstName']) {
          sessionStorage.removeItem(key);
        }
      }
      dispatch(profileLoadingFinished());
    });
  };
}

export function removingSavedForm() {
  return {
    type: REMOVING_SAVED_FORM
  };
}

export function removingSavedFormSuccess() {
  return {
    type: REMOVING_SAVED_FORM_SUCCESS
  };
}

export function removingSavedFormFailure() {
  return {
    type: REMOVING_SAVED_FORM_FAILURE
  };
}

export function removeSavedForm(formId) {
  return dispatch => {
    dispatch(removingSavedForm());
    return removeFormApi(formId)
      .then(() => {
        dispatch({ type: REMOVING_SAVED_FORM_SUCCESS, formId });
        dispatch(getProfile());
      })
      .catch(() => dispatch(removingSavedFormFailure()));
  };
}
