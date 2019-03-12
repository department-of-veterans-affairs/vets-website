import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const SUBMIT_ID_FORM_STARTED = 'SUBMIT_ID_FORM_STARTED';
export const SUBMIT_ID_FORM_SUCCEEDED = 'SUBMIT_ID_FORM_SUCCEEDED';
export const SUBMIT_ID_FORM_FAILED = 'SUBMIT_ID_FORM_FAILED';

export function submitIDForm(formData) {
  return dispatch => {
    dispatch({ type: SUBMIT_ID_FORM_STARTED });

    // We need bypass the local API when running locally, so hit dev-api
    // directly. As an aside, if we want to get a 500 server error when testing
    // locally, reverse this check to make the app hit the local API instead.
    const urlPrefix = environment.isLocalhost()
      ? 'https://dev-api.va.gov/v0'
      : '';
    const baseUrl = `${urlPrefix}/health_care_applications/enrollment_status`;

    const url = appendQuery(baseUrl, {
      'userAttributes[gender]': formData.gender,
      'userAttributes[veteranDateOfBirth]': formData.dob,
      'userAttributes[veteranFullName][first]': formData.firstName,
      'userAttributes[veteranFullName][last]': formData.lastName,
      'userAttributes[veteranSocialSecurityNumber]': formData.ssn,
    });

    apiRequest(
      url,
      null,
      data => dispatch({ type: SUBMIT_ID_FORM_SUCCEEDED, data }),
      ({ errors }) => dispatch({ type: SUBMIT_ID_FORM_FAILED, errors }),
    );
  };
}
