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

  // Check if no claim type has been selected (both new and increase are explicitly false)
  const claimType = formData?.['view:claimType'];
  const claimingNewFlag = claimType?.['view:claimingNew'];
  const claimingIncreaseFlag = claimType?.['view:claimingIncrease'];

  if (
    claimType &&
    claimingNewFlag === false &&
    claimingIncreaseFlag === false
  ) {
    customErrors.push({
      property: 'instance.view:claimType',
      message: 'Please select at least one type of condition',
      name: 'required',
      argument: undefined,
      stack: 'instance.view:claimType is required',
    });
  }

  return customErrors;
};
