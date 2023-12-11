import content from '../../locales/en/content.json';

/**
 * Helper that returns a descriptive screenreader-compatible label for the
 * buttons on the health insurance summary page
 * @param {Object} formData - the current data object passed from the form
 * @returns {String} - the name of the provider and either the policy number
 * or group code.
 */
export function getInsuranceSrLabel(formData) {
  const {
    insuranceName,
    'view:policyOrGroup': { insurancePolicyNumber, insuranceGroupCode },
  } = formData;
  const labels = {
    policy: insurancePolicyNumber
      ? `${content['insurance-policy-number-label']} ${insurancePolicyNumber}`
      : undefined,
    group: insuranceGroupCode
      ? `${content['insurance-group-code-label']} ${insuranceGroupCode}`
      : undefined,
  };
  return insuranceName
    ? `${insuranceName}, ${labels.policy ?? labels.group}`
    : content['insurance-policy-generic-label'];
}
