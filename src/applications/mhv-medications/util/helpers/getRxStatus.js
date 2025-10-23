import { rxSourceIsNonVA } from './rxSourceIsNonVA';
import { ACTIVE_NON_VA, FIELD_NONE_NOTED } from '../constants';

/**
 * Get the status of a prescription
 * @param {Object} rx - The prescription object.
 * @returns {String} - Returns the status of the prescription.
 */
export const getRxStatus = rx => {
  if (rxSourceIsNonVA(rx)) return ACTIVE_NON_VA;
  return rx?.dispStatus || FIELD_NONE_NOTED;
};
