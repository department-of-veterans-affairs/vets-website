import omit from 'platform/utilities/data/omit';
import { stringifyFormReplacer } from 'platform/forms-system/src/js/helpers';

const PHONE_KEYS = ['phoneNumber', 'internationalPhone'];

/**
 * Cleans up form data for submission
 * Mostly copied from the platform provided stringifyFormReplacer, with the
 * removal of the address check. We don't need it here for our location use.
 * @param {string} key - form data field key
 * @param {any} value - form data field value
 * @returns {any} - cleaned form data field value
 */
export const customFormReplacer = (key, value) => {
  // Remove all non-digit characters from phone-related fields
  if (typeof value === 'string' && PHONE_KEYS.includes(key)) {
    return value.replace(/\D/g, '');
  }
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object' && value !== null) {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }

    // autosuggest widgets save value and label info, but we should just return the value
    if (value.widget === 'autosuggest') {
      return value.id;
    }

    // Exclude file data
    if (value.confirmationCode && value.file) {
      return omit('file', value);
    }
  }
  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!stringifyFormReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
};
