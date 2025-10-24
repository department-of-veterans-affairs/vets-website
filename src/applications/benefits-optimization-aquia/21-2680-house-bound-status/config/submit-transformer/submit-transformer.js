/**
 * @fileoverview Submit transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/submit-transformer
 *
 * This module transforms form data before submission to the backend API.
 * When the claimant is the veteran, this transformer copies the veteran's
 * information to the claimant fields to ensure the backend receives complete data.
 */

/**
 * Transforms form data before submission
 *
 * When the veteran is filing for themselves (claimantRelationship === 'veteran'),
 * this function copies the veteran's information to the claimant fields. This allows
 * the form to skip showing claimant-specific pages while still providing the backend
 * with the required claimant data.
 *
 * @param {Object} formConfig - The form configuration object
 * @param {Object} formData - The form data collected from the user
 * @returns {Object} The transformed form data ready for submission
 *
 * @example
 * const transformed = submitTransformer(formConfig, {
 *   claimantRelationship: 'veteran',
 *   veteranIdentification: {
 *     veteranFullName: { first: 'John', last: 'Doe' },
 *     veteranDOB: '1980-01-01',
 *     veteranSSN: '123-45-6789'
 *   },
 *   veteranAddress: {
 *     veteranAddress: { street: '123 Main St', city: 'Springfield', ... }
 *   }
 * });
 * // transformed.claimantInformation will be populated with veteran's data
 */
export function submitTransformer(_formConfig, formData) {
  const transformedData = { ...formData };

  // If the veteran is the claimant, copy veteran information to claimant fields
  // This ensures the backend receives complete claimant data even though
  // the user didn't fill out separate claimant pages
  // Note: claimantRelationship is nested due to sectionName in PageTemplate
  const isVeteranClaimant =
    transformedData.claimantRelationship?.claimantRelationship === 'veteran';

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

  return transformedData;
}
