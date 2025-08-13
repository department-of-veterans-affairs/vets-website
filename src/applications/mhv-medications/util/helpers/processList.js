import { FIELD_NONE_NOTED } from '../constants';

/**
 * @param {Array} list
 * @returns {String} array of strings, separated by a comma
 */
export const processList = (list, emptyMessage) => {
  if (Array.isArray(list)) {
    if (list?.length > 1) return list.join('. ');
    if (list?.length === 1) return list.toString();
  }
  return emptyMessage || FIELD_NONE_NOTED;
};
