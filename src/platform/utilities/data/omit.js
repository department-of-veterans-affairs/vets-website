/**
 * Returns a deep clone of the provided object without the specified fields.
 *
 * @param {Array} fields
 * @param {Object} object
 */
export default function omit(fields, object = {}) {
  let fieldOmitted = false;

  const withOmittedFields = Object.keys(object).reduce((newObj, k) => {
    if (!fields.includes(k)) {
      newObj[k] = object[k]; // eslint-disable-line no-param-reassign
    } else {
      fieldOmitted = true;
    }

    return newObj;
  }, {});

  return fieldOmitted ? withOmittedFields : object;
}
