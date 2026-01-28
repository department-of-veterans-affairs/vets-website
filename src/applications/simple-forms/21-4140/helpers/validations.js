// @ts-check

/**
 * Validates that an employment start date does not occur before the
 * applicant's date of birth.
 * @param {Object} errors - RJSF errors object scoped to the employment dates.
 * @param {Object} fieldData - The employment date range entered by the user.
 * @param {Object} formData - Full form data for the form.
 */
export const validateEmploymentStartAfterDob = (
  errors,
  fieldData,
  formData,
) => {
  const startDate = fieldData?.from;
  const birthDate = formData?.dateOfBirth;

  if (!startDate || !birthDate) {
    return;
  }

  const start = new Date(startDate);
  const birth = new Date(birthDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(birth.getTime())) {
    return;
  }

  if (start < birth) {
    errors.from.addError(
      'Employment start date must be after your date of birth.',
    );
  }
};
