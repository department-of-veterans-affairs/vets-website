/**
 * @module utils/patientName
 * @description Utilities for extracting patient name from form data
 * VA Form 21-0779 - Request for Nursing Home Information
 */

import { isPatientVeteran } from './patientType';

/**
 * Helper function to get patient's name from form data
 * @param {Object} formData - The form data
 * @returns {string} The patient's name or default text
 */
export const getPatientName = formData => {
  // Defensive: Always check if formData is valid before accessing properties
  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return 'the patient';
  }

  const isVeteran = isPatientVeteran(formData);

  // If patient is veteran, use veteran's name
  if (isVeteran) {
    const veteranInfo = formData.veteranPersonalInfo || {};
    const fullName = veteranInfo.fullName || {};
    const hasName = fullName.first || fullName.last;

    if (hasName) {
      const firstName = fullName.first || '';
      const middleName = fullName.middle || '';
      const lastName = fullName.last || '';

      // Build full name with middle name if present
      const fullNameStr = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

      return fullNameStr.trim();
    }
  } else {
    // If patient is spouse/parent, use claimant's name
    const claimantInfo = formData.claimantPersonalInfo || {};
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
  }

  return 'the patient';
};
