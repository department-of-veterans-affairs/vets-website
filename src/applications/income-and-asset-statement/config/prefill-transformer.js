/**
 * Prefill transformer for the 0969 form. Extracts key Veteran identifiers and
 * contact information from form data and maps them into the structure expected
 * by the form system and submit transformer.
 *
 * @param {Object} pages - The form pages configuration passed through by the form system.
 * @param {Object} formData - Raw prefill data provided by vets-api, including `nonPrefill` fields.
 * @param {Object} metadata - Metadata object maintained by the form system.
 * @param {Object} state - Redux state, used to determine login status.
 * @param {Object} state.user.login - Login info pulled from user state.
 * @param {boolean} state.user.login.currentlyLoggedIn - Indicates whether the user is authenticated.
 *
 * @returns {Object} An object containing:
 *   - `pages`: Unmodified pages configuration.
 *   - `formData`: Prefilled fields including contact info, login status, and
 *                 SSN/VA file number data with both full and last-four values.
 *   - `metadata`: Unmodified metadata passed through unchanged.
 */
export default function prefillTransformer(pages, formData, metadata, state) {
  const { currentlyLoggedIn } = state.user.login;
  const { veteranSocialSecurityNumber = '', veteranVaFileNumber = '' } =
    formData?.nonPrefill || {};
  const email = formData?.email || '';
  const claimantPhone = formData?.phone || '';

  return {
    pages,
    formData: {
      email,
      claimantPhone,
      isLoggedIn: currentlyLoggedIn, // Set for access in submit.js to re-map veteran information data
      veteranSocialSecurityNumber,
      veteranSsnLastFour: veteranSocialSecurityNumber.slice(-4),
      vaFileNumber: veteranVaFileNumber,
      vaFileNumberLastFour: veteranVaFileNumber.slice(-4),
    },
    metadata,
  };
}
