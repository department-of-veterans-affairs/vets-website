import { NO_PROVIDER_NAME } from '../constants';

/**
 * Display the provider's name based on availability
 * @param {String} first - The first name of the provider.
 * @param {String} last - The last name of the provider.
 * @returns {String}
 * - If both first and last names are provided, return them in "First Last" format.
 * - If only one name is available, return that name.
 * - If no names are given, return a default message.
 */
export const displayProviderName = (first, last) => {
  if (first && last) {
    return `${first} ${last}`;
  }
  if (first || last) {
    return first || last;
  }
  return NO_PROVIDER_NAME;
};
