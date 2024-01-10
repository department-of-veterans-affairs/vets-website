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
    // As of 1/9/24, only users with certain enrollment statuses can access the EZR form
    isValidEnrollmentStatus: [
      'enrolled',
      'pending_mt',
      'pending_other',
    ].includes(parsedStatus),
    hasPreferredFacility: !!preferredFacility,
    canSubmitFinancialInfo,
    hasServerError,
  };
}
