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

  const claimType = formData?.['view:claimType'];
  const claimingNew = claimType?.['view:claimingNew'];
  const claimingIncrease = claimType?.['view:claimingIncrease'];

  // Check if user has selected at least one claim type (new or increase) but
  // hasn't added any new disabilities
  if (claimingNew || claimingIncrease) {
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

  // Check if no claim type has been selected (both new and increase are explicitly false).
  // Add this error when:
  // - there are no usable condition rows at all (missing/empty/only empty objects), or
  // - at least one condition has ratedDisability set but the claimType flags are still both false.
  // When there ARE non-empty conditions but none has ratedDisability, don't show this error
  const items = formData?.newDisabilities;
  const hasItemsArray = Array.isArray(items);
  const hasAnyRow = hasItemsArray && items.length > 0;
  const hasNonEmptyCondition =
    hasAnyRow && items.some(item => item && Object.keys(item).length > 0);
  const someConditionHasRatedDisability =
    hasNonEmptyCondition && items.some(item => item?.ratedDisability);

  const shouldShowClaimTypeError =
    claimType &&
    claimingNew === false &&
    claimingIncrease === false &&
    (!hasItemsArray ||
      !hasAnyRow ||
      !hasNonEmptyCondition ||
      someConditionHasRatedDisability);

  if (shouldShowClaimTypeError) {
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
