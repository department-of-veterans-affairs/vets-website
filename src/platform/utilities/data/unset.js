import deconstructPath from './deconstructPath';
import clone from './clone';
import checkValidPath from './checkValidPath';

/**
 * Same as `unset`, but uses the level param to determine when to clone and give a more helpful error message.
 *
 * Note: Sub-objects in the path will not be `===` to objects in the same path in the existing data, but all
 *  other objects will be. By not cloning the data outside the path, we allow components (and Redux's connect
 *  HoC) to quickly tell which parts of the root object have changed, by doing a `===` comparison.
 *
 * @param {Array|string} path
 * @param {Array|Object} object
 * @param {Number} level  How many times we've recursed
 * @return {Object} A new object with the appropriate value set
 */
function baseUnset(arrayPath, object, level = 0) {
  const newObj = clone(object);

  const pathSegment = arrayPath[level];

  // Handle a path that doesn't exist
  if (typeof newObj[pathSegment] === 'undefined') {
    return newObj;
  }

  if (level === arrayPath.length - 1) {
    delete newObj[pathSegment];
  } else {
    newObj[pathSegment] = baseUnset(arrayPath, newObj[pathSegment], level + 1);
  }

  return newObj;
}

/**
 * Removes the value at the end of the path
 * Separate from `baseUnset` to not expose the level param.
 *
 * @param {Array|string} path
 * @param {Object} object
 * @return {Object} A new object with the appropriate value removed
 */
export default function unset(path, object) {
  const arrayPath = Array.isArray(path) ? path : deconstructPath(path);
  checkValidPath(arrayPath);
  return baseUnset(arrayPath, object, 0);
}
