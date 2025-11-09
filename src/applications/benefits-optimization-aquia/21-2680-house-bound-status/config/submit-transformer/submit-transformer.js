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

/**
 * Transforms form data before submission
 *
 * This transformer performs two key transformations:
 * 1. When the veteran is filing for themselves (claimantRelationship === 'veteran'),
 *    copies veteran information to claimant fields
 * 2. When hospitalization status is 'no', removes any stale hospitalization details
 *    (handles case where user entered details then changed answer to 'no')
 *
 * @param {Object} formConfig - The form configuration object
 * @param {Object} formData - The form data collected from the user
 * @returns {Object} The transformed form data ready for submission
 *
 * @example
 * const transformed = submitTransformer(formConfig, {
 *   relationship: 'veteran',
 *   veteranIdentification: {
 *     veteranFullName: { first: 'John', last: 'Doe' },
 *     veteranDOB: '1980-01-01',
 *     veteranSSN: '123-45-6789'
 *   },
 *   veteranAddress: {
 *     veteranAddress: { street: '123 Main St', city: 'Springfield', ... }
 *   },
 *   hospitalizationStatus: {
 *     isCurrentlyHospitalized: 'no'
 *   },
 *   hospitalizationDate: { date: '2024-01-01' } // Will be removed
 * });
 * // transformed.claimantInformation will be populated with veteran's data
 * // transformed.hospitalizationDate and hospitalizationFacility will be removed
 */
export function submitTransformer(_formConfig, formData) {
  const transformedData = { ...formData };

  // Clean up duplicate/unnecessary data before submission
  // Remove the 'veteran' object added by platform (duplicates veteranIdentification)
  delete transformedData.veteran;

  // If the veteran is the claimant, copy veteran information to claimant fields
  // This ensures the backend receives complete claimant data even though
  // the user didn't fill out separate claimant pages
  // Note: claimantRelationship is nested due to sectionName in PageTemplate
  const isVeteranClaimant =
    transformedData.claimantRelationship?.relationship === 'veteran';

  if (isVeteranClaimant) {
    const veteranName =
      transformedData.veteranIdentification?.veteranFullName || {};
    const veteranDOB = transformedData.veteranIdentification?.veteranDOB || '';
    const veteranSSN = transformedData.veteranIdentification?.veteranSSN || '';
    const veteranAddr = transformedData.veteranAddress?.veteranAddress || {};

    // Copy veteran information to claimant fields
    transformedData.claimantInformation = {
      claimantFullName: {
        first: veteranName.first || '',
        middle: veteranName.middle || '',
        last: veteranName.last || '',
        suffix: veteranName.suffix || '',
      },
      claimantDOB: veteranDOB,
    };

    transformedData.claimantSSN = {
      claimantSSN: veteranSSN,
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
        isMilitary: veteranAddr.isMilitary || false,
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
    transformedData.hospitalizationStatus?.isCurrentlyHospitalized === 'yes';

  if (!isCurrentlyHospitalized) {
    // Keep hospitalizationStatus (contains the 'no' answer)
    // Remove hospitalizationDate and hospitalizationFacility
    delete transformedData.hospitalizationDate;
    delete transformedData.hospitalizationFacility;
  }

  return transformedData;
}
