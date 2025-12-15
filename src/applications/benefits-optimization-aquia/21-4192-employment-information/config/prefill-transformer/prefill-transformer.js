/**
 * @fileoverview Prefill transformer for VA Form 21-4192 Request for Employment Information
 * @module config/prefill-transformer
 *
 * This module transforms user profile data from the VA.gov user account into
 * structured form data that can be used to prefill the 21-4192 Request for
 * Employment Information form. The transformer extracts personal information,
 * contact details, and mailing address from the user's profile and formats them
 * according to the form's data structure requirements.
 *
 * The form is used by Veterans to request employment information from the VA
 * for various purposes such as applying for jobs, background checks, or
 * providing employment verification to third parties.
 */

/**
 * Transforms user profile data into prefilled form data for the 21-4192 form.
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
 * @param {string} [state.user.profile.ssn] - Social Security Number (may include formatting)
 * @param {string} [state.user.profile.vaFileNumber] - VA file number identifier
 * @param {string} [state.user.profile.homePhone] - Home phone number
 * @param {string} [state.user.profile.mobilePhone] - Mobile phone number
 * @param {string} [state.user.profile.email] - Email address
 * @param {Object} [state.user.profile.mailingAddress] - Mailing address object
 * @param {Object} [state.user.profile.vaProfile] - VA-specific profile information
 *
 * @returns {Object} The transformed data object containing:
 * @returns {Array<Object>} returns.pages - The original pages configuration (passed through)
 * @returns {Object} returns.formData - The merged form data object
 * @returns {Object} returns.formData.personalInfo - Personal information section
 * @returns {Object} returns.formData.personalInfo.fullName - Structured name object
 * @returns {string} returns.formData.personalInfo.fullName.first - First name
 * @returns {string} returns.formData.personalInfo.fullName.middle - Middle name
 * @returns {string} returns.formData.personalInfo.fullName.last - Last name
 * @returns {string} returns.formData.personalInfo.fullName.suffix - Name suffix
 * @returns {string} returns.formData.personalInfo.dateOfBirth - Formatted date of birth (YYYY-MM-DD)
 * @returns {string} returns.formData.personalInfo.ssn - Formatted SSN (XXX-XX-XXXX)
 * @returns {string} returns.formData.personalInfo.vaFileNumber - VA file number
 * @returns {Object} returns.formData.contactInfo - Contact information section
 * @returns {string} returns.formData.contactInfo.phone - Phone number (home or mobile)
 * @returns {string} returns.formData.contactInfo.email - Email address
 * @returns {Object} returns.formData.contactInfo.mailingAddress - Structured address object
 * @returns {string} returns.formData.contactInfo.mailingAddress.street - Street address line 1
 * @returns {string} returns.formData.contactInfo.mailingAddress.street2 - Street address line 2
 * @returns {string} returns.formData.contactInfo.mailingAddress.city - City
 * @returns {string} returns.formData.contactInfo.mailingAddress.state - State code
 * @returns {string} returns.formData.contactInfo.mailingAddress.postalCode - ZIP code
 * @returns {Object} returns.metadata - The original metadata object (passed through)
 *
 * @example
 * // Example usage in form configuration
 * const transformedData = prefillTransformer(
 *   formPages,
 *   {},
 *   { formId: '21-4192' },
 *   {
 *     user: {
 *       profile: {
 *         userFullName: { first: 'Robert', last: 'Johnson' },
 *         dob: '19800725',
 *         ssn: '456789123',
 *         email: 'robert.johnson@email.com'
 *       }
 *     }
 *   }
 * );
 * // Result includes prefilled personalInfo and contactInfo sections
 */
export function prefillTransformer(pages, formData, metadata, state) {
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

  // Extract and clean SSN - remove any existing formatting (dashes, spaces, etc.)
  const ssn = profile.ssn ? profile.ssn.replace(/[^\d]/g, '') : '';

  // Format SSN with dashes for display in XXX-XX-XXXX format
  const formattedSsn = ssn
    ? `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`
    : '';

  // Get VA file number if available
  const vaFileNumber = profile.vaFileNumber || '';

  // Build contact information - prioritize home phone over mobile
  const phone = profile.homePhone || profile.mobilePhone || '';
  const email = profile.email || '';

  // Build mailing address from profile data
  // Maps profile address fields to form address structure
  const mailingAddress = {};
  if (profile.mailingAddress) {
    const addr = profile.mailingAddress;
    mailingAddress.street = addr.addressLine1 || '';
    mailingAddress.street2 = addr.addressLine2 || '';
    mailingAddress.city = addr.city || '';
    mailingAddress.state = addr.stateCode || addr.state || ''; // Prefer state code over full state name
    mailingAddress.postalCode = addr.zipCode || '';
  }

  // Return the transformed data structure
  return {
    pages,
    formData: {
      ...formData, // Preserve any existing form data
      personalInfo: {
        fullName,
        dateOfBirth,
        ssn: formattedSsn,
        vaFileNumber,
      },
      contactInfo: {
        phone,
        email,
        mailingAddress,
      },
    },
    metadata,
  };
}
