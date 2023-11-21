import appendQuery from 'append-query';
import { apiRequest } from '~/platform/utilities/api';
import environment from '~/platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';
import { getData, isServerError, isClientError } from '../utilities';
import {
  DISABILITY_PREFIX,
  DISABILITY_RATING_ACTIONS,
  ENROLLMENT_STATUS_ACTIONS,
  HCA_ENROLLMENT_STATUSES,
} from '../constants/hca';
import {
  dismissedHCANotificationDate,
  isEnrollmentStatusLoading,
} from '../selectors/hca';

// NOTE: flip the `false` to `true` to fake the endpoint when testing locally
// eslint-disable-next-line sonarjs/no-redundant-boolean
const simulateServerLocally = environment.isLocalhost() && false;
const {
  FETCH_ENROLLMENT_STATUS_STARTED,
  FETCH_ENROLLMENT_STATUS_FAILED,
  FETCH_ENROLLMENT_STATUS_SUCCEEDED,
  RESET_ENROLLMENT_STATUS,
  FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
  FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
  FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
  SET_DISMISSED_HCA_NOTIFICATION,
  SHOW_HCA_REAPPLY_CONTENT,
} = ENROLLMENT_STATUS_ACTIONS;

/**
 * Provide a mocked 404 response when calling `/health_care_applications/enrollment_status`
 * @param {Function} dispatch - tells the enrollment status reducer what data
 * set to return
 */
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
/**
 * Provide a mocked 500 response when calling `/health_care_applications/enrollment_status`
 * NOTE: ESLint is disabled because it's nice to be able to use this function during
 * development and local testing
 * @param {Function} dispatch - tells the enrollment status reducer what data
 * set to return
 */
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

/**
 * Provide a mocked 200 response when calling `/health_care_applications/enrollment_status`
 * @param {Function} dispatch - tells the enrollment status reducer what data
 * set to return
 * @param {String} status - the enrollment status value returned from the server
 */
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

/**
 * Call the `/health_care_applications/enrollment_status` endpoint
 * @param {Function} dispatch - tells the enrollment status reducer what data
 * set to return
 * @param {Object} formData - data object from the ID form fields
 */
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

/**
 * Parse error details on failure of total disability rating fetch
 * @param {Object} response - object containing either an array of errors or a
 * single error object
 */
function getResponseError(response) {
  const { errors = null, error, status } = response;
  if (errors?.length) {
    const { code, detail } = errors[0];
    return { code, detail };
  }
  if (error) {
    return { code: status, detail: error };
  }
  return null;
}

/**
 * Action to fetch the current enrollment status based on the provided user data
 * NOTE: based on the value of the `simulateServerLocally` variable, the API call will
 * either be mocked or real.
 * @param {Object} formData - data object from the ID form fields
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
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
    1. Confirm that `simulateServerLocally` evals to `true` and then
       optionally adjust what the `callFake404` and/or `callFakeSuccess`
       functions return.
    2. Temporarily change the `baseUrl` to:
       'https://dev-platform-api.va.gov/v0/health_care_applications/enrollment_status, so
       that we bypass the local API. If you use the following user creds the
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
      if (formData?.firstName?.toLowerCase() === 'pat') {
        return callFake404(dispatch);
      }
      return callFakeSuccess(dispatch, HCA_ENROLLMENT_STATUSES.enrolled);
    }
    return callAPI(dispatch, formData);
  };
}

/**
 * Action to reset the enrollment status state to its initial value
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
export function resetEnrollmentStatus() {
  return dispatch => {
    dispatch({ type: RESET_ENROLLMENT_STATUS });
  };
}

/**
 * Action to fetch dismissed enrollment status notifications
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
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

/**
 * Action to set dismissed enrollment status notifications
 * @param {String} status - current enrollment status value
 * @param {Number} statusEffectiveAt - timestamp for effective date
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for enrollment status
 */
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

/**
 * Action to fetch users total disability rating
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for disability rating
 */
export function fetchTotalDisabilityRating() {
  const {
    FETCH_TOTAL_RATING_STARTED,
    FETCH_TOTAL_RATING_FAILED,
    FETCH_TOTAL_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;
  return async dispatch => {
    dispatch({ type: FETCH_TOTAL_RATING_STARTED });
    const response = await getData('/health_care_applications/rating_info');
    const error = getResponseError(response);

    if (error) {
      const errorCode = error.code;
      if (isServerError(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': `${errorCode} internal error`,
        });
      } else if (isClientError(errorCode)) {
        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': `${errorCode} no combined rating found`,
        });
      }
      dispatch({
        type: FETCH_TOTAL_RATING_FAILED,
        error,
      });
    } else {
      recordEvent({ event: `${DISABILITY_PREFIX}-combined-load-success` });
      dispatch({
        type: FETCH_TOTAL_RATING_SUCCEEDED,
        response,
      });
    }
  };
}

/**
 * Declare action type to determine if users can be shown content on how to reapply for benefits
 * @returns {Object} - object containing the constant string to use in a fetch action
 */
export function showReapplyContent() {
  return { type: SHOW_HCA_REAPPLY_CONTENT };
}
