import { range } from 'lodash';

/**
 * Shared validation functions to eliminate duplication across the forms system
 */

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
export function isValidSSN(value) {
  if (
    value === '123456789' ||
    value === '123-45-6789' ||
    /^0{3}-?\d{2}-?\d{4}$/.test(value) ||
    /^\d{3}-?0{2}-?\d{4}$/.test(value) ||
    /^\d{3}-?\d{2}-?0{4}$/.test(value)
  ) {
    return false;
  }

  const noBadSameDigitNumber = range(0, 10).every(i => {
    const sameDigitRegex = new RegExp(`${i}{3}-?${i}{2}-?${i}{4}`);
    return !sameDigitRegex.test(value);
  });

  if (!noBadSameDigitNumber) {
    return false;
  }

  return /^\d{9}$/.test(value) || /^\d{3}-\d{2}-\d{4}$/.test(value);
}

// A 9 digit VA File Number must be an SSN
// The only other valid option is an 8-digit number
export function isValidVAFileNumber(value) {
  if (/^\d{9}$/.test(value) || /^\d{3}-\d{2}-\d{4}$/.test(value)) {
    return isValidSSN(value);
  }

  return /^\d{8}$/.test(value);
}

// Pulled from https://en.wikipedia.org/wiki/Routing_transit_number#Check_digit
export function isValidRoutingNumber(value) {
  if (/^\d{9}$/.test(value)) {
    const digits = value.split('').map(val => parseInt(val, 10));
    const weighted =
      3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8]);

    return weighted % 10 === 0;
  }
  return false;
}
