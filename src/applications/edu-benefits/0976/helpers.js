function convertNameToInitials(fullName) {
  const { first, last } = fullName;
  if (!first || !last) {
    return null;
  }

  // check for hyphenated last name
  let last2;
  const hyphenIndex = last.indexOf('-');
  if (hyphenIndex !== -1) {
    last2 = last.substring(hyphenIndex + 1);
  }

  const firstInitial = first.charAt(0).toUpperCase();
  const lastInitial = last.charAt(0).toUpperCase();
  const lastInitial2 = last2?.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}${lastInitial2 || ''}`.toUpperCase();
}

export function validateInitialsMatch(errors, fieldData, formData) {
  const firstName = formData?.authorizingOfficial?.fullName?.first || '';
  const lastName = formData?.authorizingOfficial?.fullName?.last || '';
  const expectedValue = convertNameToInitials(
    formData?.authorizingOfficial?.fullName,
  );

  const givenValue = fieldData ? fieldData.toUpperCase() : '';

  if (givenValue.length === 0) {
    return;
  }

  const lettersOnlyPattern = /^[A-Za-z]+$/;
  if (!lettersOnlyPattern.test(givenValue)) {
    errors.addError('Enter your initials using letters only');
    return;
  }

  if (expectedValue !== givenValue) {
    errors.addError(`Initials must match your name: ${firstName} ${lastName}`);
  }
}
