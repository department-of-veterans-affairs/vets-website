import { apiRequest } from '~/platform/utilities/api';

export const FETCH_HCA_ENROLLMENT_STATUS_STARTED =
  'FETCH_HCA_ENROLLMENT_STATUS_STARTED';
export const FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED =
  'FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED';
export const FETCH_HCA_ENROLLMENT_STATUS_FAILED =
  'FETCH_HCA_ENROLLMENT_STATUS_FAILED';

export const fetchHcaEnrollmentStatusStarted = () => ({
  type: FETCH_HCA_ENROLLMENT_STATUS_STARTED,
});

export const fetchHcaEnrollmentStatusSucceeded = payload => ({
  type: FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED,
  payload,
});

export const fetchHcaEnrollmentStatusFailed = payload => ({
  type: FETCH_HCA_ENROLLMENT_STATUS_FAILED,
  payload,
});

export const fetchHcaEnrollmentStatus = () => dispatch => {
  dispatch(fetchHcaEnrollmentStatusStarted());
  return apiRequest('/health_care_applications/enrollment_status')
    .then(data => dispatch(fetchHcaEnrollmentStatusSucceeded(data)))
    .catch(err => dispatch(fetchHcaEnrollmentStatusFailed(err)));
};
