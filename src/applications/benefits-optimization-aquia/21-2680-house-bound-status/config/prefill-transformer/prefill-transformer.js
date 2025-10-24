/**
 * @fileoverview Prefill transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/prefill-transformer
 *
 * This module transforms user profile data from the VA.gov user account into
 * structured form data that can be used to prefill the 21-2680 Examination for
 * House-bound Status form. The transformer extracts personal information, contact
 * details, and mailing address from the user's profile and formats them according
 * to the form's data structure requirements.
 *
 * The form is used by Veterans to request an examination to determine eligibility
 * for house-bound benefits, which provide additional compensation for Veterans
 * who are substantially confined to their homes due to permanent disability.
 */

/**
 * Transforms user profile data into prefilled form data for the 21-2680 form.
 *
 * This function extracts relevant information from the user's VA.gov profile
 * and transforms it into the structure expected by the form system. It handles
 * various data formats and provides fallbacks for missing information.
 *
 * @param {Array<Object>} pages - The form pages configuration array containing
 *   page definitions, schemas, and UI configurations for the form
 * @param {Object} formData - Any existing form data that should be preserved.
 *   This allows users to maintain previously entered information when the form
 *   is prefilled with profile data
 * @param {Object} metadata - Form metadata object containing information about
 *   the form instance, submission status, and other form-level properties
 * @param {Object} state - The complete Redux state object from the application
 * @param {Object} state.user - User information object from Redux state
 * @param {Object} state.user.profile - User profile containing personal information
 * @param {Object} [state.user.profile.userFullName] - Full name object with first, middle, last, suffix
 * @param {string} [state.user.profile.dob] - Date of birth in various formats
 * @param {string} [state.user.profile.birthDate] - Alternative date of birth field
 * @param {Object} [state.user.profile.mailingAddress] - Mailing address object
 * @param {Object} [state.user.profile.vaProfile] - VA-specific profile information
 * @param {Object} [state.user.profile.vapContactInfo] - VA contact information (primary source for address)
 *
 * @returns {Object} The transformed data object containing:
 * @returns {Array<Object>} returns.pages - The original pages configuration (passed through)
 * @returns {Object} returns.formData - The merged form data object
 * @returns {Object} returns.formData.veteranIdentification - Veteran identification section
 * @returns {Object} returns.formData.veteranIdentification.veteranFullName - Structured name object
 * @returns {string} returns.formData.veteranIdentification.veteranFullName.first - First name
 * @returns {string} returns.formData.veteranIdentification.veteranFullName.middle - Middle name
 * @returns {string} returns.formData.veteranIdentification.veteranFullName.last - Last name
 * @returns {string} returns.formData.veteranIdentification.veteranFullName.suffix - Name suffix
 * @returns {string} returns.formData.veteranIdentification.veteranDOB - Formatted date of birth (YYYY-MM-DD)
 * @returns {string} returns.formData.veteranIdentification.veteranSSN - Empty string (SSN not prefilled for security)
 * @returns {Object} returns.formData.veteranAddress - Veteran address section
 * @returns {Object} returns.formData.veteranAddress.veteranAddress - Structured address object
 * @returns {string} returns.formData.veteranAddress.veteranAddress.street - Street address line 1
 * @returns {string} returns.formData.veteranAddress.veteranAddress.street2 - Street address line 2
 * @returns {string} returns.formData.veteranAddress.veteranAddress.city - City
 * @returns {string} returns.formData.veteranAddress.veteranAddress.state - State code
 * @returns {string} returns.formData.veteranAddress.veteranAddress.postalCode - ZIP code
 * @returns {Object} returns.metadata - The original metadata object (passed through)
 *
 * @note SSN is NOT prefilled for security reasons - not available in user profile API.
 * @note Phone and email are NOT prefilled for the veteran - only collected on claimant pages.
 *
 * @example
 * // Example usage in form configuration
 * const transformedData = prefillTransformer(
 *   formPages,
 *   {},
 *   { formId: '21-2680' },
 *   {
 *     user: {
 *       profile: {
 *         userFullName: { first: 'Jane', last: 'Smith' },
 *         dob: '19750312',
 *         mailingAddress: {
 *           addressLine1: '123 Main St',
 *           city: 'Springfield',
 *           stateCode: 'IL',
 *           zipCode: '62701'
 *         }
 *       }
 *     }
 *   }
 * );
 * // Result includes prefilled veteranIdentification and veteranAddress sections
 */
export default function prefillTransformer(pages, formData, metadata, state) {
  const profile = state?.user?.profile || {};
  const vaProfile = profile?.vaProfile || {};

  // Build the full name object from profile data
  // Extracts name components and provides empty string defaults
  const fullName = {};
  if (profile.userFullName) {
    fullName.first = profile.userFullName.first || '';
    fullName.middle = profile.userFullName.middle || '';
    fullName.last = profile.userFullName.last || '';
    fullName.suffix = profile.userFullName.suffix || '';
  }

  // Format date of birth from profile
  // Handles multiple date formats and converts YYYYMMDD to YYYY-MM-DD
  let dateOfBirth = '';
  const dobString = profile.dob || profile.birthDate || vaProfile.birthDate;
  if (dobString) {
    // Convert YYYYMMDD format to YYYY-MM-DD format for form compatibility
    if (/^\d{8}$/.test(dobString)) {
      dateOfBirth = `${dobString.slice(0, 4)}-${dobString.slice(
        4,
        6,
      )}-${dobString.slice(6, 8)}`;
    } else {
      dateOfBirth = dobString;
    }
  }

  // SSN is not prefilled for security reasons - users must enter manually
  const formattedSsn = '';

  // Build mailing address from profile data
  // Maps profile address fields to form address structure
  // Check multiple possible locations for address
  // Note: Backend sends vet360ContactInformation, but Redux stores it as vapContactInfo
  const addressSource =
    profile.vapContactInfo?.mailingAddress ||
    profile.vet360ContactInformation?.mailingAddress ||
    profile.mailingAddress ||
    vaProfile?.vet360ContactInformation?.mailingAddress ||
    {};

  const mailingAddress = {};
  if (Object.keys(addressSource).length > 0) {
    const addr = addressSource;
    mailingAddress.street = addr.addressLine1 || '';
    mailingAddress.street2 = addr.addressLine2 || '';
    mailingAddress.street3 = addr.addressLine3 || '';
    mailingAddress.city = addr.city || '';
    mailingAddress.state = addr.stateCode || addr.state || '';
    mailingAddress.country = addr.countryCodeIso3 || addr.countryName || 'USA';
    // Handle zipCode with optional suffix (e.g., "30033-4032")
    const zipCode = addr.zipCode || addr.postalCode || '';
    const zipSuffix = addr.zipCodeSuffix || '';
    mailingAddress.postalCode = zipSuffix ? `${zipCode}-${zipSuffix}` : zipCode;
    mailingAddress.isMilitary = false;
  }

  // Return the transformed data structure
  // Map profile data to form's section structure matching actual page schemas
  // Note: This form only collects veteran's name, DOB, SSN, and address
  // Phone/email are collected on claimant pages only
  return {
    pages,
    formData: {
      ...formData, // Preserve any existing form data
      veteranIdentification: {
        veteranFullName: fullName,
        veteranDOB: dateOfBirth,
        veteranSSN: formattedSsn,
      },
      veteranAddress: {
        veteranAddress: mailingAddress,
      },
    },
    metadata,
  };
}
