/**
 * Custom validation errors for 526EZ form
 * This function is called during form submission to add form-specific validation
 * errors that aren't captured by schema validation.
 *
 * @param {Object} formData - The current form data
 * @returns {Array} Array of error objects matching jsonschema validator format
 */
export const getCustomValidationErrors = formData => {
  if (!formData) return [];

  const customErrors = [];

  // Check if user is claiming new conditions but hasn't added any new disabilities
  if (formData?.['view:claimType']?.['view:claimingNew']) {
    const newDisabilities = formData?.newDisabilities;
    if (
      !newDisabilities ||
      !Array.isArray(newDisabilities) ||
      newDisabilities.length === 0
    ) {
      customErrors.push({
        property: 'instance.newDisabilities',
        message: 'does not meet minimum length of 1',
        name: 'minItems',
        argument: 1,
        stack: 'instance.newDisabilities does not meet minimum length of 1',
      });
    }
  }

  return customErrors;
};
