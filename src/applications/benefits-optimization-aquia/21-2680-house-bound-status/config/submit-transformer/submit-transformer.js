/**
 * @fileoverview Submit transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/submit-transformer
 */

import { filterViewFields } from 'platform/forms-system/src/js/helpers';

/**
 * Recursively removes deprecated fields (suffix, isMilitary) from form data
 * @param {Object} obj - The object to clean
 * @returns {Object} A new object with deprecated fields removed
 */
function removeDeprecatedFields(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeDeprecatedFields(item));
  }

  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (key !== 'suffix' && key !== 'isMilitary') {
      cleaned[key] = removeDeprecatedFields(obj[key]);
    }
  });

  return cleaned;
}

/**
 * Transforms form data before submission to the backend API
 *
 * Transformations applied:
 * - Removes UI-only fields (prefixed with 'view:')
 * - Removes deprecated fields (suffix, isMilitary) and stale data from old form versions
 * - Copies veteran information to claimant fields when veteran is the claimant
 * - Removes stale hospitalization details when user changes answer to 'no'
 *
 * @param {Object} _formConfig - The form configuration object (unused)
 * @param {Object} formData - The form data collected from the user
 * @returns {string} JSON string of the transformed form data
 */
export function submitTransformer(_formConfig, formData) {
  let transformedData = filterViewFields(formData);
  transformedData = removeDeprecatedFields(transformedData);

  // Remove duplicate and stale fields from old form versions
  delete transformedData.veteran;
  delete transformedData.veteranIdentification;
  delete transformedData.signature;
  delete transformedData.certificationChecked;
  delete transformedData.agreed;
  delete transformedData.statementOfTruthSignature;
  delete transformedData.statementOfTruthCertified;

  /**
   * When veteran is the claimant, copy veteran information to claimant fields.
   * Backend requires complete claimant data even though user doesn't fill separate pages.
   * Note: claimantContact is intentionally not copied as veteran pages don't collect it.
   */
  const isVeteranClaimant =
    transformedData.claimantRelationship?.relationship === 'veteran';

  if (isVeteranClaimant) {
    const veteranName =
      transformedData.veteranInformation?.veteranFullName || {};
    const veteranDob = transformedData.veteranInformation?.veteranDob || '';
    const veteranSsn = transformedData.veteranInformation?.veteranSsn || '';
    const veteranAddr = transformedData.veteranAddress?.veteranAddress || {};

    transformedData.claimantInformation = {
      claimantFullName: {
        first: veteranName.first || '',
        middle: veteranName.middle || '',
        last: veteranName.last || '',
      },
      claimantDob: veteranDob,
    };

    transformedData.claimantSsn = {
      claimantSsn: veteranSsn,
    };

    transformedData.claimantAddress = {
      claimantAddress: {
        street: veteranAddr.street || '',
        street2: veteranAddr.street2 || '',
        street3: veteranAddr.street3 || '',
        city: veteranAddr.city || '',
        state: veteranAddr.state || '',
        postalCode: veteranAddr.postalCode || '',
        country: veteranAddr.country || 'USA',
      },
    };
  }

  /**
   * Remove stale hospitalization details when user changes answer to 'no'.
   * Keeps hospitalizationStatus field but removes date and facility data.
   */
  const isCurrentlyHospitalized =
    transformedData.hospitalizationStatus?.isCurrentlyHospitalized === true;

  if (!isCurrentlyHospitalized) {
    delete transformedData.hospitalizationDate;
    delete transformedData.hospitalizationFacility;
  }

  return JSON.stringify(transformedData);
}
