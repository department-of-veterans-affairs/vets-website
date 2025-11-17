/**
 * Remap `otherVeteran*` fields to their corresponding `veteran*` fields
 * for cases where the claimant is not the veteran.
 * @param {Object} [data={}] - The form data object containing possible `otherVeteran*`
 * fields to be remapped.
 * @param {Object} [data.otherVeteranFullName] - Full name object to map to `veteranFullName`.
 * @param {string} [data.otherVeteranSocialSecurityNumber] - SSN to map to `veteranSocialSecurityNumber`.
 * @param {string} [data.otherVaFileNumber] - VA file number to map to `vaFileNumber`.
 * @returns {Object} A shallow-cloned copy of the input data with any applicable
 * `otherVeteran*` fields remapped to their `veteran*` equivalents.
 */
export function remapOtherVeteranFields(data = {}) {
  const updated = { ...data };

  if (data.otherVeteranFullName) {
    updated.veteranFullName = data.otherVeteranFullName;
  }

  if (data.otherVeteranSocialSecurityNumber) {
    updated.veteranSocialSecurityNumber = data.otherVeteranSocialSecurityNumber;
  }

  if (data.otherVaFileNumber) {
    updated.vaFileNumber = data.otherVaFileNumber;
  }

  return updated;
}
