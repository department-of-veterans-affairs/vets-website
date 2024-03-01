import moment from 'moment';

export function validateSponsorDeathDate(
  errors,
  { isDeceased, dateOfBirth, dateOfDeath },
) {
  // dob = date of birth | dod = date of death
  if (dateOfBirth && isDeceased === 'yes' && dateOfDeath) {
    const dob = moment(dateOfBirth);
    const dod = moment(dateOfDeath);

    // Check if the sponsor is deceased and date of death is on or before date of birth
    if (dod.isSameOrBefore(dob)) {
      errors.dateOfDeath.addError(
        "The sponsor's date of death must be after the sponsor's date of birth.",
      );
    }

    // Check if dates have 16 or more years between them
    if (dod.diff(dob, 'years') < 16) {
      errors.dateOfDeath.addError(
        "From sponsor's date of birth to sponsor's date of death must be at least 16 years.",
      );
    }
  }

  return errors;
}

export function validateTopLevelDomain(errors, email) {
  if (email.length === 0) return;
  const index = email.lastIndexOf('.');
  const topLevelDomain = email.substring(index + 1, email.length);

  const hasNumbers = input => {
    return /\d/.test(input);
  };

  if (hasNumbers(topLevelDomain))
    errors.addError(
      'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
    );
}
