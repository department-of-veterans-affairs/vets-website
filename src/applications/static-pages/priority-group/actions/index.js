import * as Sentry from '@sentry/browser';
import { apiRequest } from '~/platform/utilities/api';
import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import recordEvent from '~/platform/monitoring/record-event';
import { AUTH_EVENTS } from '~/platform/user/authentication/constants';

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

export const fetchEnrollmentStatus = () => async dispatch => {
  dispatch(fetchEnrollmentStatusBegin());
  const apiVersion = { apiVersion: 'v0' };
  const path = '/health_care_applications/enrollment_status';
  try {
    const response = await apiRequest(path, apiVersion);
    dispatch(fetchEnrollmentStatusSuccess(response));
  } catch (err) {
    Sentry.captureException(err);
    dispatch(fetchEnrollmentStatusError(err));
  }
};

export const handleSignInClick = () => dispatch => {
  recordEvent({ event: AUTH_EVENTS.LOGIN });
  dispatch(toggleLoginModal(true));
};
