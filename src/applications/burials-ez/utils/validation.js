import moment from 'moment';

export function validateBurialAndDeathDates(errors, page) {
  const { burialDate, deathDate, veteranDateOfBirth } = page;
  if (
    burialDate &&
    deathDate &&
    moment(burialDate).isBefore(moment(deathDate))
  ) {
    errors.burialDate.addError(
      'Date of burial must be on or after date of death',
    );
  }
  if (
    deathDate &&
    veteranDateOfBirth &&
    moment(deathDate).isBefore(moment(veteranDateOfBirth))
  ) {
    errors.deathDate.addError('Date of death must be after date of birth');
  }
}

// Benefits Intake API metadata name validation only accepts a-z, A-Z, hyphen, and whitespace.
// When generating the metadata, we erase all invalid characters. If this leaves an empty string,
// the submission will fail.
export function validateBenefitsIntakeName(errors, value) {
  const validCharsPattern = /[a-zA-Z]/g;
  const matches = value.match(validCharsPattern);

  if (!matches) {
    errors.addError(`You must include at least one character between A and Z`);
  }
}

/**
 * Creates a file upload validation function for VA forms.
 *
 * This validation exists as a temporary workaround to:
 * - Enforce required file uploads until a platform bug is resolved
 * - Prevent invalid or incomplete file uploads from allowing form continuation
 *
 * See: https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4716
 *
 * @param {boolean} options.required - Whether at least one file is required
 * @param {string} options.requiredMessage - Error message when no files are provided
 * @returns {Function} ui:validations-compatible validation function
 */
export const validateFileUploads = ({
  required = true,
  requiredMessage = 'Upload a supporting document',
} = {}) => {
  return (errors, fieldData /* files array or single file */) => {
    let files = [];

    if (Array.isArray(fieldData)) {
      files = fieldData;
    } else if (fieldData) {
      files = [fieldData];
    }

    if (required && files.length === 0) {
      errors.addError(requiredMessage);
      return;
    }

    files.forEach(file => {
      // Skip validation until encrypted file password is entered
      if (file?.isEncrypted && !file?.confirmationCode) {
        return;
      }

      if (!file?.name) {
        errors.addError(requiredMessage);
        return;
      }

      if (file.errorMessage) {
        errors.addError(file.errorMessage);
      }
    });
  };
};
