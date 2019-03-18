import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';

export const SUBMIT_ID_FORM_STARTED = 'SUBMIT_ID_FORM_STARTED';
export const SUBMIT_ID_FORM_SUCCEEDED = 'SUBMIT_ID_FORM_SUCCEEDED';
export const SUBMIT_ID_FORM_FAILED = 'SUBMIT_ID_FORM_FAILED';

export function submitIDForm(formData) {
  return dispatch => {
    dispatch({ type: SUBMIT_ID_FORM_STARTED });
    /*
    When hitting the API locally, we cannot get responses other than 404s from
    the endpoint. This is due to the endpoint's need to connect to MVI, which
    cannot easily been done locally. There are a few ways around this:
    1. Temporarily change the `baseUrl` to:
       'https://dev-api.va.gov/v0/health_care_applications/enrollment_status, so
       that we bypass the local APi. If you use the following user creds the
       backend will respond with a 200 and the expected response body:
       WESLEY
       FORD
       1986-05-06
       796043735
    2. You can add something like this `return render(json: { "parsed_status" =>
       'enrolled' })` to the first line of the enrollment_status method in
       vets-api: app/controllers/v0/health_care_applications_controller.rb#L25
    3. Instead of making the apiRequest here, you can immediately dispatch the
       action that corresponds to th condition you want to test:
       `dispatch({type: SUBMIT_ID_FORM_FAILED, errors: [{ code: '500' }] });`
    */
    const baseUrl = `/health_care_applications/enrollment_status`;

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
