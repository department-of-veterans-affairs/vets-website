/**
 * @module utils/relationshipHelpers
 * @description Helper functions for determining claimant relationships
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

/**
 * Helper function to check if the claimant is the veteran
 * @param {Object} formData - The form data
 * @returns {boolean} True if claimant is the veteran
 */
export const isClaimantVeteran = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return false;
  }

  return formData.claimantRelationship?.relationship === 'veteran';
};

/**
 * Helper function to get claimant relationship type
 * @param {Object} formData - The form data
 * @returns {string} The relationship type (veteran, spouse, child, parent, or unknown)
 */
export const getClaimantRelationship = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'unknown';
  }

  return formData.claimantRelationship?.relationship || 'unknown';
};
