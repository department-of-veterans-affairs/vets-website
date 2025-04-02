/**
 * Helper that returns a descriptive aria label for the edit buttons on the
 * health insurance information page
 * @param {Object} formData - the current data object passed from the form
 * @returns {String} - the name of the provider and either the policy number
 * or group code.
 */
export function getInsuranceAriaLabel(formData) {
  const { insuranceName, insurancePolicyNumber, insuranceGroupCode } = formData;
  const policyLabel = insurancePolicyNumber
    ? `Policy number ${insurancePolicyNumber}`
    : '';
  const groupLabel = insuranceGroupCode
    ? `Group code ${insuranceGroupCode}`
    : '';
  return insuranceName
    ? `${insuranceName}, ${policyLabel || groupLabel || ''}`
    : 'insurance policy';
}
