/**
 * @fileoverview Prefill transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/prefill-transformer
 *
 * This module transforms user profile data from the VA.gov user account into
 * structured form data that can be used to prefill the 21-2680 form.
 */

/**
 * Format date from YYYYMMDD to YYYY-MM-DD
 * @param {string} dobString - Date string in various formats
 * @returns {string} Formatted date string or empty string
 */
function formatDateOfBirth(dobString) {
  if (!dobString) return '';

  // Convert YYYYMMDD format to YYYY-MM-DD format
  if (/^\d{8}$/.test(dobString)) {
    return `${dobString.slice(0, 4)}-${dobString.slice(4, 6)}-${dobString.slice(
      6,
      8,
    )}`;
  }

  return dobString;
}

/**
 * Get mailing address from profile
 * @param {Object} profile - User profile object
 * @returns {Object} Formatted address object
 */
function getMailingAddress(profile) {
  const addressSource =
    profile.vapContactInfo?.mailingAddress ||
    profile.vaProfile?.vet360ContactInformation?.mailingAddress ||
    profile.vet360ContactInformation?.mailingAddress ||
    profile.mailingAddress ||
    {};

  if (Object.keys(addressSource).length === 0) {
    return {};
  }

  const zipCode = addressSource.zipCode || addressSource.postalCode || '';
  const zipSuffix = addressSource.zipCodeSuffix || '';

  return {
    street: addressSource.addressLine1 || '',
    street2: addressSource.addressLine2 || '',
    street3: addressSource.addressLine3 || '',
    city: addressSource.city || '',
    state: addressSource.stateCode || addressSource.state || '',
    country:
      addressSource.countryCodeIso3 || addressSource.countryName || 'USA',
    postalCode: zipSuffix ? `${zipCode}-${zipSuffix}` : zipCode,
    isMilitary: false,
  };
}

/**
 * Transforms user profile data into prefilled form data for the 21-2680 form.
 *
 * @param {Array<Object>} pages - The form pages configuration array
 * @param {Object} formData - Any existing form data that should be preserved
 * @param {Object} metadata - Form metadata object
 * @param {Object} state - The complete Redux state object from the application
 * @param {Object} state.user - User information object from Redux state
 * @param {Object} state.user.profile - User profile containing personal information
 *
 * @returns {Object} The transformed data object containing:
 * @returns {Array<Object>} returns.pages - The original pages configuration
 * @returns {Object} returns.formData - The merged form data object
 * @returns {Object} returns.metadata - The original metadata object
 */
export function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};

  // Build the full name object from profile data
  const fullName = profile.userFullName || {};

  // Format date of birth
  const dateOfBirth = formatDateOfBirth(
    profile.dob || profile.birthDate || profile.vaProfile?.birthDate,
  );

  // Get mailing address
  const mailingAddress = getMailingAddress(profile);

  // Return the transformed data structure
  // Start with profile defaults, then spread saved data on top
  // This ensures saved form data takes priority while providing profile defaults for new forms
  return {
    pages,
    formData: {
      ...formData,
      veteranInformation: {
        // Default values from profile
        veteranFullName: {
          first: fullName.first || '',
          middle: fullName.middle || '',
          last: fullName.last || '',
          suffix: fullName.suffix || '',
        },
        veteranDob: dateOfBirth,
        veteranSsn: '', // Not prefilled for security
        // Spread saved data on top to overwrite defaults
        ...formData?.veteranInformation,
      },
      veteranAddress: {
        // Default from profile
        veteranAddress: mailingAddress,
        // Spread saved data on top
        ...formData?.veteranAddress,
      },
    },
    metadata,
  };
}
