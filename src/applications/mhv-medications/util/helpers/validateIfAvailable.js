/**
 * @param {String} fieldName field name
 * @param {String} fieldValue value that is being validated
 */
export const validateIfAvailable = (fieldName, fieldValue) => {
  if (fieldValue || fieldValue === 0) {
    return fieldValue;
  }
  return `${fieldName} not available`;
};
