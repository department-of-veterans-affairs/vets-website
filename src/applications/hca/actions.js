import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

const simulateServer = environment.isLocalhost();

export const FETCH_ENROLLMENT_STATUS_STARTED =
  'FETCH_ENROLLMENT_STATUS_STARTED';
export const FETCH_ENROLLMENT_STATUS_SUCCEEDED =
  'FETCH_ENROLLMENT_STATUS_SUCCEEDED';
export const FETCH_ENROLLMENT_STATUS_FAILED = 'FETCH_ENROLLMENT_STATUS_FAILED';
export const SHOW_HCA_REAPPLY_CONTENT = 'SHOW_HCA_REAPPLY_CONTENT';

export function showReapplyContent() {
  return { type: SHOW_HCA_REAPPLY_CONTENT };
}

export function getEnrollmentStatus(formData = {}) {
  return dispatch => {
    dispatch({ type: FETCH_ENROLLMENT_STATUS_STARTED });
    /*
    When hitting the API locally, we cannot get responses other than 500s from
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
       `dispatch({type: FETCH_ENROLLMENT_STATUS_FAILED, errors: [{ code: '404' }] });`
    */
    if (simulateServer) {
      new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }).then(() => {
        dispatch({
          type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
          data: {
            applicationDate: '2018-01-24T00:00:00.000-06:00',
            enrollmentDate: '2018-01-24T00:00:00.000-06:00',
            preferredFacility: '463 - CHEY6',
            parsedStatus: 'enrolled',
          },
        });
      });
    } else {
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
        data => dispatch({ type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, data }),
        ({ errors }) =>
          dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors }),
      );
    }
  };
}
