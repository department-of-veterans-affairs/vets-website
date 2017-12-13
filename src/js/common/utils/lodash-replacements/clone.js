/**
 * Clones an object. Currently just uses Object.assign(), but we can change that later if desired.
 *
 * @param {Object} object
 * @return {Object}
 */
export default function clone(object) {
  return Object.assign({}, object);
}

