/**
 * @fileoverview Submit transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/submit-transformer
 *
 * This module transforms form data before submission to the backend API.
 *
 * Key transformations:
 * 1. When the claimant is the veteran, copies veteran information to claimant fields
 *    to ensure the backend receives complete data
 * 2. When not currently hospitalized, removes any stale hospitalization details
 *    (handles case where user entered details then changed answer to 'no')
 */

import { filterViewFields } from 'platform/forms-system/src/js/helpers';

/**
 * Removes deprecated fields from form data that were removed from the form
 * These include: suffix (from names) and isMilitary (from addresses)
 *
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
    // Skip deprecated fields
    if (key !== 'suffix' && key !== 'isMilitary') {
      cleaned[key] = removeDeprecatedFields(obj[key]);
    }
  });

  return cleaned;
}

/**
 * Transforms form data before submission
 *
 * This transformer performs several key transformations:
 * 1. Removes UI-only fields (prefixed with 'view:')
 * 2. Removes stale/duplicate fields from old form versions
 * 3. When the veteran is filing for themselves (claimantRelationship === 'veteran'),
 *    copies veteran information to claimant fields
 * 4. When hospitalization status is 'no', removes any stale hospitalization details
 *    (handles case where user entered details then changed answer to 'no')
 *
 * @param {Object} formConfig - The form configuration object
 * @param {Object} formData - The form data collected from the user
 * @returns {Object} The transformed form data ready for submission
 *
 * @example
 * const transformed = submitTransformer(formConfig, {
 *   relationship: 'veteran',
 *   veteranInformation: {
 *     veteranFullName: { first: 'John', last: 'Doe' },
 *     veteranDob: '1980-01-01',
 *     veteranSsn: '123-45-6789'
 *   },
 *   veteranAddress: {
 *     veteranAddress: { street: '123 Main St', city: 'Springfield', ... }
 *   },
 *   hospitalizationStatus: {
 *     isCurrentlyHospitalized: false
 *   },
 *   hospitalizationDate: { date: '2024-01-01' } // Will be removed
 * });
 * // transformed.claimantInformation will be populated with veteran's data
 * // transformed.hospitalizationDate and hospitalizationFacility will be removed
 */
export function submitTransformer(_formConfig, formData) {
  // First, remove all view: prefixed fields using platform helper
  let transformedData = filterViewFields(formData);

  // Remove deprecated fields (suffix, isMilitary) that were removed from the form
  transformedData = removeDeprecatedFields(transformedData);

  // Clean up duplicate/unnecessary data before submission
  // Remove the 'veteran' object added by platform (duplicates veteranInformation)
  delete transformedData.veteran;

  // Remove stale/duplicate data that causes API parsing errors
  delete transformedData.veteranIdentification; // Stale data not in form config
  delete transformedData.signature; // Old signature pattern
  delete transformedData.certificationChecked; // Old certification pattern
  delete transformedData.agreed; // Old agreement field
  delete transformedData.statementOfTruthSignature; // Statement of truth signature
  delete transformedData.statementOfTruthCertified; // Statement of truth checkbox

  // If the veteran is the claimant, copy veteran information to claimant fields
  // This ensures the backend receives complete claimant data even though
  // the user didn't fill out separate claimant pages
  // Note: claimantRelationship is nested due to sectionName in PageTemplate
  const isVeteranClaimant =
    transformedData.claimantRelationship?.relationship === 'veteran';

  if (isVeteranClaimant) {
    const veteranName =
      transformedData.veteranInformation?.veteranFullName || {};
    const veteranDob = transformedData.veteranInformation?.veteranDob || '';
    const veteranSsn = transformedData.veteranInformation?.veteranSsn || '';
    const veteranAddr = transformedData.veteranAddress?.veteranAddress || {};

    // Copy veteran information to claimant fields
    transformedData.claimantInformation = {
      claimantFullName: {
        first: veteranName.first || '',
        middle: veteranName.middle || '',
        last: veteranName.last || '',
        // Note: suffix field removed from form
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
        // Note: isMilitary field removed from form
      },
    };

    // Note: claimantContact (phone/email) intentionally left as-is
    // The veteran pages don't collect contact information, so if the veteran
    // is the claimant, contact info should come from claimantContact if present
  }

  // If not currently hospitalized, remove any stale hospitalization details
  // This handles the case where the user entered hospital information,
  // then went back and changed their answer to 'no'
  const isCurrentlyHospitalized =
    transformedData.hospitalizationStatus?.isCurrentlyHospitalized === true;

  if (!isCurrentlyHospitalized) {
    // Keep hospitalizationStatus (contains the false answer)
    // Remove hospitalizationDate and hospitalizationFacility
    delete transformedData.hospitalizationDate;
    delete transformedData.hospitalizationFacility;
  }

  return transformedData;
}
