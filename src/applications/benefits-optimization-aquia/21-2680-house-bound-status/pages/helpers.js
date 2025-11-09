/**
 * @module config/form/pages/helpers
 * @description Shared helper functions for form page configurations
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

/**
 * Helper function to get claimant's name from form data
 * @param {Object} formData - The form data
 * @returns {string} The claimant's name or default text
 */
export const getClaimantName = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'the claimant';
  }

  const claimantInfo = formData.claimantInformation || {};
  const claimantFullName = claimantInfo.claimantFullName || {};
  const hasName = claimantFullName.first || claimantFullName.last;

  if (hasName) {
    const firstName = claimantFullName.first || '';
    const middleName = claimantFullName.middle || '';
    const lastName = claimantFullName.last || '';

    // Build full name with middle name if present
    const fullName = middleName
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;

    return fullName.trim();
  }

  return 'the claimant';
};

/**
 * Helper function to get veteran's name from form data
 * @param {Object} formData - The form data
 * @returns {string} The veteran's name or default text
 */
export const getVeteranName = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'the Veteran';
  }

  const veteranInfo = formData.veteranInformation || {};
  const veteranFullName = veteranInfo.veteranFullName || {};
  const hasName = veteranFullName.first || veteranFullName.last;

  if (hasName) {
    const firstName = veteranFullName.first || '';
    const middleName = veteranFullName.middle || '';
    const lastName = veteranFullName.last || '';

    // Build full name with middle name if present
    const fullName = middleName
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;

    return fullName.trim();
  }

  return 'the Veteran';
};

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
