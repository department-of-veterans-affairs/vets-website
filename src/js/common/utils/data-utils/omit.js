import cloneDeep from './cloneDeep';

/**
 * Returns a deep clone of he provided object without the fields specified.
 *
 * @param {Array} fields
 * @param {Object} object
 */
export default function omit(fields, object) {
  const newObj = cloneDeep(object);
  fields.forEach(f => delete newObj[f]);
  return newObj;
}
