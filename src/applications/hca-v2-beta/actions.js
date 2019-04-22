import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { HCA_ENROLLMENT_STATUSES } from './constants';

// flip the `false` to `true` to fake the endpoint when testing locally
const simulateServerLocally = environment.isLocalhost() && false;

export const FETCH_ENROLLMENT_STATUS_STARTED =
  'FETCH_ENROLLMENT_STATUS_STARTED';
export const FETCH_ENROLLMENT_STATUS_SUCCEEDED =
  'FETCH_ENROLLMENT_STATUS_SUCCEEDED';
export const FETCH_ENROLLMENT_STATUS_FAILED = 'FETCH_ENROLLMENT_STATUS_FAILED';
export const SHOW_HCA_REAPPLY_CONTENT = 'SHOW_HCA_REAPPLY_CONTENT';

export function showReapplyContent() {
  return { type: SHOW_HCA_REAPPLY_CONTENT };
}

function callFake404(dispatch) {
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    dispatch({
      type: FETCH_ENROLLMENT_STATUS_FAILED,
      errors: [{ code: '404' }],
    });
  });
}

function callFakeSuccess(dispatch, status = HCA_ENROLLMENT_STATUSES.enrolled) {
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
        parsedStatus: status,
      },
    });
  });
}

function callAPI(dispatch, formData = {}) {
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
    ({ errors }) => dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors }),
  );
}

export function getEnrollmentStatus(formData) {
  return dispatch => {
    dispatch({ type: FETCH_ENROLLMENT_STATUS_STARTED });
    /*
    When hitting the API locally, we cannot get responses other than 500s from
    the endpoint. This is due to the endpoint's need to connect to MVI, which
    cannot easily been done locally. There are a few ways around this, ordered
    from best to worst options. (Options 2 and 3 and really listed here to be
    informative):
    1. Confirm that `simulateServerLocally` on line 6 evals to `true` and then
       optionally adjust what the `callFake404` and/or `callFakeSuccess`
       functions return.
    2. Temporarily change the `baseUrl` to:
       'https://dev-api.va.gov/v0/health_care_applications/enrollment_status, so
       that we bypass the local APi. If you use the following user creds the
       backend will respond with a 200 and the expected response body:
       WESLEY
       FORD
       1986-05-06
       796043735
    3. You can add something like this `return render(json: { "parsed_status" =>
       'enrolled' })` to the first line of the enrollment_status method in
       vets-api: app/controllers/v0/health_care_applications_controller.rb#L25
    */
    if (simulateServerLocally) {
      if (
        formData &&
        formData.firstName &&
        formData.firstName.toLowerCase() === 'pat'
      ) {
        callFake404(dispatch);
      } else {
        callFakeSuccess(dispatch, HCA_ENROLLMENT_STATUSES.canceledDeclined);
      }
    } else {
      callAPI(dispatch, formData);
    }
  };
}
