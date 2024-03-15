import { HCA_ENROLLMENT_STATUSES } from '../constants';

/**
 * Map state values to create selector for enrollment status properties
 * @param {Object} state - the current state values
 * @returns {Object} - user properties to use in init method
 */
export const selectEnrollmentStatus = state => {
  const { hcaEnrollmentStatus } = state;
  const { enrollmentStatus } = hcaEnrollmentStatus;
  return {
    isEnrolledInESR: enrollmentStatus === HCA_ENROLLMENT_STATUSES.enrolled,
    ...hcaEnrollmentStatus,
  };
};
