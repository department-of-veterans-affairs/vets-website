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
  const currentValue = arrayPath.reduce((current, next) => {
    return typeof current === 'undefined' ? current : current[next];
  }, object);

  // Should this clone? the current value? It might use a different ref--not sure.
  return (typeof currentValue !== 'undefined') ? currentValue : defaultValue;
}

