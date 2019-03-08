import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';

export const SUBMIT_ID_FORM_STARTED = 'SUBMIT_ID_FORM_STARTED';
export const SUBMIT_ID_FORM_SUCCEEDED = 'SUBMIT_ID_FORM_SUCCEEDED';
export const SUBMIT_ID_FORM_FAILED = 'SUBMIT_ID_FORM_FAILED';

export function submitIDForm(formData) {
  return dispatch => {
    dispatch({ type: SUBMIT_ID_FORM_STARTED });

    const baseUrl = '/health_care_applications/enrollment_status';

    const url = appendQuery(baseUrl, {
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
