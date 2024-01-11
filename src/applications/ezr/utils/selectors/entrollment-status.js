import { isProfileLoading } from 'platform/user/selectors';

/**
 * Map state values to create selector for enrollment status properties
 * @param {Object} state - the current state values
 * @returns {Object} - enrollment status properties to use in components
 */
export function selectEnrollmentStatus(state) {
  const {
    enrollmentStatus: {
      canSubmitFinancialInfo,
      hasServerError,
      loading,
      parsedStatus,
      preferredFacility,
    },
  } = state;
  return {
    isLoading: isProfileLoading(state) || loading,
    isEnrolledinESR: parsedStatus === 'enrolled',
    hasPreferredFacility: !!preferredFacility,
    canSubmitFinancialInfo,
    hasServerError,
  };
}
