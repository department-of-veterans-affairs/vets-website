import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { HCA_ENROLLMENT_STATUSES } from './constants';
import {
  dismissedHCANotificationDate,
  isEnrollmentStatusLoading,
} from './selectors';

// flip the `false` to `true` to fake the endpoint when testing locally
// eslint-disable-next-line sonarjs/no-redundant-boolean
const simulateServerLocally = environment.isLocalhost() && false;

// action types related to calling /health_care_applications/enrollment_status
export const FETCH_ENROLLMENT_STATUS_STARTED =
  'FETCH_ENROLLMENT_STATUS_STARTED';
export const FETCH_ENROLLMENT_STATUS_SUCCEEDED =
  'FETCH_ENROLLMENT_STATUS_SUCCEEDED';
export const FETCH_ENROLLMENT_STATUS_FAILED = 'FETCH_ENROLLMENT_STATUS_FAILED';

// action types related to calling GET /notifications/dismissed_statuses
export const FETCH_DISMISSED_HCA_NOTIFICATION_STARTED =
  'FETCH_DISMISSED_HCA_NOTIFICATION_STARTED';
export const FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED =
  'FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED';
export const FETCH_DISMISSED_HCA_NOTIFICATION_FAILED =
  'FETCH_DISMISSED_HCA_NOTIFICATION_FAILED';

export const SET_DISMISSED_HCA_NOTIFICATION = 'SET_DISMISSED_HCA_NOTIFICATION';

export const SHOW_HCA_REAPPLY_CONTENT = 'SHOW_HCA_REAPPLY_CONTENT';

export function showReapplyContent() {
  return { type: SHOW_HCA_REAPPLY_CONTENT };
}

// fake a 404 response from /health_care_applications/enrollment_status
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

/* eslint-disable no-unused-vars */
// Disabling ESLint because it's nice to be able to use this function during
// development and local testing
// fake a 500 response from /health_care_applications/enrollment_status
function callFake500(dispatch) {
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    dispatch({
      type: FETCH_ENROLLMENT_STATUS_FAILED,
      errors: [{ code: '500' }],
    });
  });
}
/* eslint-enable no-unused-vars */

// fake a 200 call to /health_care_applications/enrollment_status
function callFakeSuccess(dispatch, status = HCA_ENROLLMENT_STATUSES.enrolled) {
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    dispatch({
      type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
      data: {
        applicationDate: '2019-04-24T00:00:00.000-06:00',
        enrollmentDate: '2019-04-30T00:00:00.000-06:00',
        preferredFacility: '463 - CHEY6',
        parsedStatus: status,
        effectiveDate: '2019-04-25T00:00:00.000-06:00',
      },
    });
  });
}

// actually call the /health_care_applications/enrollment_status endpoint
function callAPI(dispatch, formData = {}) {
  const baseUrl = `/health_care_applications/enrollment_status`;

  const url = appendQuery(baseUrl, {
    'userAttributes[veteranDateOfBirth]': formData.dob,
    'userAttributes[veteranFullName][first]': formData.firstName,
    'userAttributes[veteranFullName][last]': formData.lastName,
    'userAttributes[veteranSocialSecurityNumber]': formData.ssn,
  });

  return apiRequest(url)
    .then(data => dispatch({ type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, data }))
    .catch(({ errors }) =>
      dispatch({ type: FETCH_ENROLLMENT_STATUS_FAILED, errors }),
    );
}

// make either a mocked or real call to the
// /health_care_applications/enrollment_status endpoint, depending on the value
// of the `simulateServerLocally` flag
export function getEnrollmentStatus(formData) {
  return (dispatch, getState) => {
    if (isEnrollmentStatusLoading(getState())) {
      return null;
    }
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
        return callFake404(dispatch);
      }
      return callFakeSuccess(dispatch, HCA_ENROLLMENT_STATUSES.enrolled);
    }
    return callAPI(dispatch, formData);
  };
}

export function getDismissedHCANotification() {
  return dispatch => {
    dispatch({ type: FETCH_DISMISSED_HCA_NOTIFICATION_STARTED });
    const url = `/notifications/dismissed_statuses/form_10_10ez`;

    return apiRequest(url)
      .then(response =>
        dispatch({
          type: FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
          response,
        }),
      )
      .catch(({ errors }) =>
        dispatch({ type: FETCH_DISMISSED_HCA_NOTIFICATION_FAILED, errors }),
      );
  };
}

export function setDismissedHCANotification(status, statusEffectiveAt) {
  return (dispatch, getState) => {
    const hasPreviouslyDismissedNotification = !!dismissedHCANotificationDate(
      getState(),
    );
    dispatch({
      type: SET_DISMISSED_HCA_NOTIFICATION,
      data: statusEffectiveAt,
    });
    if (hasPreviouslyDismissedNotification) {
      return apiRequest('/notifications/dismissed_statuses/form_10_10ez', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          statusEffectiveAt,
        }),
      });
    }
    return apiRequest('/notifications/dismissed_statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'form_10_10ez',
        status,
        statusEffectiveAt,
      }),
    });
  };
}
