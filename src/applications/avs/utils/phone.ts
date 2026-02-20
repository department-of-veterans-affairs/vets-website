/**
 * Normalizes a phone number by removing non-digits and leading '1'
 * @param number - The phone number string to normalize
 * @returns The normalized phone number string
 */
const normalizePhoneNumber = (number: string): string => {
  const digitsOnly = number.replace(/\D/g, '');
  return digitsOnly.replace(/^1/, '');
};

/**
 * Checks if a phone number is clickable (exactly 10 digits)
 * @param number - The phone number string to check
 * @returns True if the number is exactly 10 digits long
 */
const numberIsClickable = (number: string): boolean => {
  return number.length === 10;
};

export { normalizePhoneNumber, numberIsClickable };
