import * as Sentry from '@sentry/browser';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities';

export const FETCH_ENROLLMENT_STATUS_BEGIN = 'FETCH_ENROLLMENT_STATUS_BEGIN';
export const FETCH_ENROLLMENT_STATUS_ERROR = 'FETCH_ENROLLMENT_STATUS_ERROR';
export const FETCH_ENROLLMENT_STATUS_SUCCESS =
  'FETCH_ENROLLMENT_STATUS_SUCCESS';

export const fetchEnrollmentStatusBegin = () => ({
  type: FETCH_ENROLLMENT_STATUS_BEGIN,
});

export const fetchEnrollmentStatusError = payload => ({
  type: FETCH_ENROLLMENT_STATUS_ERROR,
  payload,
});

export const fetchEnrollmentStatusSuccess = payload => ({
  type: FETCH_ENROLLMENT_STATUS_SUCCESS,
  payload,
});

export const fetchEnrollmentStatus = () => dispatch => {
  dispatch(fetchEnrollmentStatusBegin);
  const apiVersion = { apiVersion: 'v0' };
  return apiRequest(`/health_care_applications/enrollment_status`, apiVersion)
    .then(data => dispatch(fetchEnrollmentStatusSuccess(data)))
    .catch(err => {
      Sentry.captureException(err);
      return dispatch(fetchEnrollmentStatusError(err));
    });
};
