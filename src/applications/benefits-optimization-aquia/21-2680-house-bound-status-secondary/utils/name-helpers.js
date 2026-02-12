/**
 * @module utils/name-helpers
 * @description Shared helper functions for form page configurations
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

/**
 * Extract the claimant's full name from form data
 * @param {Object} formData - The full form data object
 * @returns {string} The claimant's full name, or 'Claimant' as fallback
 */
export const getClaimantName = formData => {
  const first = formData?.fullName?.first || '';
  const last = formData?.fullName?.last || '';
  return first && last ? `${first} ${last}` : 'Claimant';
};
