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
