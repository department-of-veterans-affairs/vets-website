/**
 * Validates that an end date is later than a start date
 * @param {Object} errors - Error object to add validation errors to
 * @param {string} endDate - The end date field value (fieldData)
 * @param {Object} formData - The complete form data object
 * @param {string} startDateField - The name of the start date field in formData
 * @param {string} errorMessage - Custom error message to display
 */
export const validateEndDateAfterStartDate = (
  errors,
  endDate,
  formData,
  startDateField,
  errorMessage = 'Please enter an end date later than the start date.',
) => {
  const startDate = formData?.[startDateField];

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      errors.addError(errorMessage);
    }
  }
};
