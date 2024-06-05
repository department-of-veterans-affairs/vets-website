import {
  HCA_NULL_STATUSES,
  HCA_ENROLLMENT_STATUSES,
  HCA_APPLY_ALLOWED_STATUSES,
} from '../constants';

/**
 * Map state values to create selector for enrollment status properties
 * @param {Object} state - the current state values
 * @returns {Object} - user properties to use in init method
 */
export const selectEnrollmentStatus = state => {
  const { hcaEnrollmentStatus } = state;
  const { statusCode } = hcaEnrollmentStatus;
  return {
    isEnrolledInESR: statusCode === HCA_ENROLLMENT_STATUSES.enrolled,
    hasApplyStatus: HCA_APPLY_ALLOWED_STATUSES.has(statusCode),
    vesRecordFound: !HCA_NULL_STATUSES.has(statusCode),
    ...hcaEnrollmentStatus,
  };
};
