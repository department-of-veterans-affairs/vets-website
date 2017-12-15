import deconstructPath from './deconstructPath';
import cloneDeep from './cloneDeep';

/**
 * Same as `set`, but uses the level param to determine when to clone and give a more helpful error message.
 *
 * @param {Array|Obect} object
 * @param {Array|string} path
 * @param {*} value
 * @param {Number} level  How many times we've recursed
 * @return {Object} A new object with the appropriate value set
 */
function baseSet(arrayPath, value, object, level = 0) {
  if (!arrayPath.length) {
    // We're at the end of our path; time to assign
    return value;
  }

  // Do some one-time prep work
  let newObj = object;
  if (level === 0) {
    // Only clone the whole object once
    newObj = cloneDeep(object);
    // The following path segments are not allowed
    arrayPath = arrayPath.filter(e => e !== undefined && e !== null); // eslint-disable-line no-param-reassign
  }

  const pathSegment = arrayPath.shift();
  const nextPathSegment = arrayPath[0];

  // Handle a path that doesn't exist
  if (typeof newObj[pathSegment] === 'undefined') {
    // The type of this element depends on the next path chunk
    switch (typeof nextPathSegment) {
      case 'string':
        newObj[pathSegment] = {};
        break;
      case 'number':
        // The array should be big enough to get whatever index we're looking for
        newObj[pathSegment] = new Array(nextPathSegment + 1);
        break;
      case 'undefined':
        // Do nothing; this will be assigned on the next iteration
        break;
      default:
        throw new Error(`Unrecognized path element type: ${typeof nextPathSegment}. Expected string or number. arrayPath[${level + 1}] contains ${nextPathSegment}.`);
    }
  }

  newObj[pathSegment] = baseSet(arrayPath, value, newObj[pathSegment], level + 1);

  return newObj;
}


/**
 * Sets the value at the end of the path, creating the appropriate objects along the way if needed.
 * Separate from `baseSet` to not expose the level param.
 *
 * @param {Obect} object
 * @param {Array|string} path
 * @param {*} value
 * @return {Object} A new object with the appropriate value set
 */
export default function set(path, value, object) {
  const arrayPath = Array.isArray(path) ? path : deconstructPath(path);
  return baseSet(arrayPath, value, object, 0);
}

