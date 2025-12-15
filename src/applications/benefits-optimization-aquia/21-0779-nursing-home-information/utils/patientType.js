/**
 * @module utils/patientType
 * @description Utilities for determining patient type in form data
 * VA Form 21-0779 - Request for Nursing Home Information
 */

/**
 * Helper function to check if the patient is the veteran
 * @param {Object} formData - The form data
 * @returns {boolean} True if patient is the veteran
 */
export const isPatientVeteran = formData => {
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return false;
  }
  return formData.claimantQuestion?.patientType === 'veteran';
};

/**
 * Helper function to check if the patient is spouse, parent, or child (not the veteran)
 * @param {Object} formData - The form data
 * @returns {boolean} True if patient is spouse, parent, or child (not veteran)
 */
export const isPatientSpouseOrParentOrChild = formData => {
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return false;
  }
  const patientType = formData.claimantQuestion?.patientType;
  return (
    patientType === 'spouse' ||
    patientType === 'parent' ||
    patientType === 'child'
  );
};
