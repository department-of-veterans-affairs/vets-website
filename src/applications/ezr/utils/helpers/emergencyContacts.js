import content from '../../locales/en/content.json';

/**
 * Helper that returns a descriptive screenreader-compatible label for the
 * buttons on the health insurance summary page
 * @param {Object} formData - the current data object passed from the form
 * @returns {String} - the name of the provider and either the policy number
 * or group code.
 */
export function getEmergencyContactSrLabel(formData) {
  const { fullName, relationship } = formData;
  const labels = {
    name: fullName
      ? `${content['insurance-policy-number-label']} ${fullName}`
      : undefined,
    relationship: relationship
      ? `${content['insurance-group-code-label']} ${relationship}`
      : undefined,
  };
  return fullName
    ? `${fullName}, ${labels.name ?? labels.relationship}`
    : content['insurance-policy-generic-label'];
}
