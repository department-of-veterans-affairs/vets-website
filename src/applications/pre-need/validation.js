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
export function validateEmailParts(errors, email) {
  if (email.length === 0) return;
  const localPartIndex = email.lastIndexOf('@');
  const topLevelDomainIndex = email.lastIndexOf('.');
  const localPart = email.substring(0, localPartIndex);
  const topLevelDomain = email.substring(topLevelDomainIndex + 1, email.length);

  const localPartHasAmpersand = input => {
    return input.includes('&');
  };

  const topLevelDomainHasNumbers = input => {
    return /\d/.test(input);
  };

  if (
    localPartHasAmpersand(localPart) ||
    topLevelDomainHasNumbers(topLevelDomain)
  )
    errors.addError(
      'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
    );
}
