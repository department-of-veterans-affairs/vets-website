import { rxSourceIsNonVA } from './rxSourceIsNonVA';
import {
  ACTIVE_NON_VA,
  FIELD_NONE_NOTED,
  pdfStatusDefinitions,
  pdfStatusDefinitionsV2,
  filterOptions,
  filterOptionsV2,
} from '../constants';

/**
 * Get the status of a prescription
 * @param {Object} rx - The prescription object.
 * @returns {String} - Returns the status of the prescription.
 */
export const getRxStatus = rx => {
  if (rxSourceIsNonVA(rx)) return ACTIVE_NON_VA;
  return rx?.dispStatus || FIELD_NONE_NOTED;
};

/**
 * Returns the appropriate status definitions object based on feature flags
 * @param {boolean} isCernerPilot - Whether Cerner pilot is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Object} Status definitions object
 */
export const getStatusDefinitions = (isCernerPilot, isV2StatusMapping) => {
  // Returns V2 definitions ONLY when BOTH flags are true
  if (isCernerPilot && isV2StatusMapping) {
    return pdfStatusDefinitionsV2;
  }
  // Returns V1 definitions in all other cases
  return pdfStatusDefinitions;
};

/**
 * Determines the key to use for PDF status definitions
 * @param {string} dispStatus - Dispense status
 * @param {string} refillStatus - Refill status
 * @returns {string} The key to use for status definitions lookup
 */
export const getPdfStatusDefinitionKey = (dispStatus, refillStatus) => {
  return refillStatus || dispStatus;
};

/**
 * Returns the appropriate filter options object based on feature flags
 * @param {boolean} isCernerPilot - Whether Cerner pilot is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Object} Filter options object
 */
export const getFilterOptions = (isCernerPilot, isV2StatusMapping) => {
  return isCernerPilot && isV2StatusMapping ? filterOptionsV2 : filterOptions;
};
