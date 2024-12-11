import omit from 'platform/utilities/data/omit';
import { replaceEscapedCharacters } from 'platform/forms-system/src/js/utilities/replaceEscapedCharacters';

/**
 *
 * @param {Object} object
 * @returns {boolean}
 */
const isObjectEmpty = object => {
  const fields = Object.keys(object);

  return (
    fields.length === 0 || fields.every(field => object[field] === undefined)
  );
};

function isPartialAddress(data) {
  return (
    data &&
    typeof data.country !== 'undefined' &&
    (!data.street || !data.city || (!data.postalCode && !data.zipcode))
  );
}

/**
 * Replaces objects (including arrays) with other values
 *
 * @param {Object} object
 * @param {ReplacerOptions} [options] - Options for the replacer
 * @returns {*} The replacement value
 */
const replaceObject = (object, options) => {
  // Clean up empty objects in arrays
  if (Array.isArray(object)) {
    const newValues = object.filter(v => !isObjectEmpty(v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  if (!options?.allowPartialAddress && isPartialAddress(object)) {
    return undefined;
  }

  if (isObjectEmpty(object)) {
    return undefined;
  }

  // autosuggest widgets save value and label info, but we should just return the value
  if (object.widget === 'autosuggest') {
    return object.id;
  }

  // Exclude file data
  if (object.confirmationCode && object.file) {
    return omit('file', object);
  }

  return object;
};

/**
 * Create a replacer function for JSON.stringify
 * A replacer function is the second argument to JSON.stringify
 *
 * @param {ReplacerOptions} [options] - Options for the replacer
 * @returns {(key, value) => any} The replacer function
 */
export function createStringifyFormReplacer(options) {
  return (key, value) => {
    if (typeof value === 'object') {
      return replaceObject(value, options);
    }
    if (typeof value === 'string') {
      return options?.replaceEscapedCharacters
        ? replaceEscapedCharacters(value)
        : value;
    }

    return value;
  };
}
