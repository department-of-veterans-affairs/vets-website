import * as Sentry from '@sentry/browser';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities';

export const FETCH_ENROLLMENT_STATUS_STARTED =
  'FETCH_ENROLLMENT_STATUS_STARTED';
export const FETCH_ENROLLMENT_STATUS_SUCCEEDED =
  'FETCH_ENROLLMENT_STATUS_SUCCEEDED';
export const FETCH_ENROLLMENT_STATUS_FAILED = 'FETCH_ENROLLMENT_STATUS_FAILED';

export const fetchEnrollmentStatusStarted = () => ({
  type: FETCH_ENROLLMENT_STATUS_STARTED,
});

export const fetchEnrollmentStatusSucceeded = data => ({
  type: FETCH_ENROLLMENT_STATUS_SUCCEEDED,
  data,
});

export const fetchEnrollmentStatusFailed = () => ({
  type: FETCH_ENROLLMENT_STATUS_FAILED,
});

export const fetchEnrollmentStatus = () => dispatch => {
  dispatch(fetchEnrollmentStatusStarted);
  const apiVersion = { apiVersion: 'v0' };
  return apiRequest(`/health_care_applications/enrollment_status`, apiVersion)
    .then(data => dispatch(fetchEnrollmentStatusSucceeded(data)))
    .catch(err => {
      Sentry.captureException(err);
      return dispatch(fetchEnrollmentStatusFailed());
    });
};
