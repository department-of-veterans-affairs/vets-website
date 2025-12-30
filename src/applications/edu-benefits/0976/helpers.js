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
    errors.addError('Please enter your initials using letters only');
    return;
  }

  if (expectedValue !== givenValue) {
    errors.addError(`Initials must match your name: ${firstName} ${lastName}`);
  }
}

export function getAtPath(data, path) {
  const parts = path.split('.');
  return parts.reduce((acc, val) => acc[val], data);
}

export function setAtPath(data, path, value) {
  const parts = path.split('.');
  const lastPart = parts.pop();

  let temp = data;
  parts.forEach(part => {
    temp = temp[part];
  });
  temp[lastPart] = value;
}

export function institutionResponseToObject(responseData) {
  const attrs = responseData.attributes || {};

  return {
    name: attrs.name,
    type: attrs.type,
    mailingAddress: {
      street: attrs.address1 || '',
      street2: attrs.address2 || '',
      street3: attrs.address3 || '',
      city: attrs.city || '',
      state: attrs.state || '',
      postalCode: attrs.zip || '',
      country: attrs.country || '',
    },
    physicalAddress: {
      street: attrs.physicalAddress1 || '',
      street2: attrs.physicalAddress2 || '',
      street3: attrs.physicalAddress3 || '',
      city: attrs.physicalCity || '',
      state: attrs.physicalState || '',
      postalCode: attrs.physicalZip || '',
      country: attrs.physicalCountry || '',
    },
  };
}
