// The icmhs api requires zip codes in a 5 or 9 digit with a dash format
// for the main address
export function isValidCentralMailPostalCode({ country, postalCode } = {}) {
  const fiveDigitZip = /^\d{5}$/;
  const nineDigitZip = /^\d{5}-\d{4}$/;
  if (
    country === 'USA' &&
    postalCode &&
    !fiveDigitZip.exec(postalCode) &&
    !nineDigitZip.exec(postalCode)
  ) {
    return false;
  }

  return true;
}
