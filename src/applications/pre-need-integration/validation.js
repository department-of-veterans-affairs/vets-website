import moment from 'moment';

export function validateSponsorDeathDate(
  errors,
  { isDeceased, dateOfBirth, dateOfDeath },
) {
  if (
    dateOfBirth &&
    isDeceased === 'yes' &&
    dateOfDeath &&
    moment(dateOfDeath).isSameOrBefore(moment(dateOfBirth))
  ) {
    errors.dateOfDeath.addError('Date of death must be after date of birth');
  }
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
