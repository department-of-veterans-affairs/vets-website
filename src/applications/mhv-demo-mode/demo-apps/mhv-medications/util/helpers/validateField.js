import { FIELD_NONE_NOTED } from '../constants';
/**
 * @param {String} fieldValue value that is being validated
 */
export const validateField = fieldValue => {
  if (fieldValue || fieldValue === 0) {
    return fieldValue;
  }
  return FIELD_NONE_NOTED;
};
