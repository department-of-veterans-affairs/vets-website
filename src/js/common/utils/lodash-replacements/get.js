import deconstructPath from './deconstructPath';

/**
 * Gets a the value at the end of the path.
 *
 * @param {Object} object
 * @param {Array|string} path
 * @param {*} [defaultValue]
 * @return {*}
 */
export default function get(path, object, defaultValue) {
  const arrayPath = Array.isArray(path) ? path : deconstructPath(path);
  let currentValue = object;

  for (let i = 0; i < arrayPath.length; i++) {
    if (typeof currentValue[arrayPath[i]] !== 'undefined') {
      currentValue = currentValue[arrayPath[i]];
    } else {
      return defaultValue;
    }
  }

  // Should this clone? the current value? It might use a different ref--not sure.
  return (typeof currentValue !== 'undefined') ? currentValue : defaultValue;
}

