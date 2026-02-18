/**
 * @module utils/medicaidStatus
 * @description Utilities for checking Medicaid coverage status
 * VA Form 21-0779 - Request for Nursing Home Information
 */

/**
 * Helper function to check if patient is currently covered by Medicaid
 * @param {Object} formData - The form data
 * @returns {boolean} True if patient is covered by Medicaid
 */
export const isMedicaidCovered = formData => {
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return false;
  }
  return formData.medicaidStatus?.currentlyCoveredByMedicaid === true;
};
