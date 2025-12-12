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
 * Direct mapping from API dispStatus to V2 display values
 * @param {String} dispStatus - The rx dispStatus from API
 * @returns {String} - The display value for V2 statuses
 */
const mapToStatusV2 = dispStatus => {
  switch (dispStatus) {
    case 'Active: Refill in Process':
    case 'Active: Submitted':
    case 'NewOrder':
    case 'Renew':
      return 'In progress';
    case 'Active: On Hold':
    case 'Expired':
    case 'Discontinued':
      return 'Inactive';
    case 'Active: Parked':
    case 'Active':
      return 'Active';
    case 'Transferred':
      return 'Transferred';
    case 'Unknown':
      return 'Status not available';
    default:
      return 'Status not available';
  }
};

/**
 * Get the status of a prescription
 * @param {Object} rx - The prescription object.
 * @param {Boolean} isCernerPilot - Whether to use simplified status labels
 * @returns {String} - Returns the status of the prescription.
 */
export const getRxStatus = (rx, isCernerPilot = false) => {
  if (rxSourceIsNonVA(rx)) return ACTIVE_NON_VA;

  const rxStatus = rx?.dispStatus || FIELD_NONE_NOTED;

  if (rxStatus === FIELD_NONE_NOTED) return rxStatus;

  // For Cerner pilot users, use direct mapping to simplified labels
  if (isCernerPilot) {
    return mapToStatusV2(rxStatus);
  }

  return rxStatus;
};

/**
 * Returns the appropriate status definitions object based on Cerner pilot flag
 * @param {boolean} isCernerPilot - Whether Cerner pilot is enabled
 * @returns {Object} Status definitions object
 */
export const getStatusDefinitions = isCernerPilot => {
  return isCernerPilot ? pdfStatusDefinitionsV2 : pdfStatusDefinitions;
};

/**
 * Determines the key to use for PDF status definitions
 * @param {string} dispStatus - Dispense status
 * @param {string} refillStatus - Refill status
 * @param {boolean} isCernerPilot - Whether using V2 definitions
 * @returns {string} The key to use for status definitions lookup
 */
export const getPdfStatusDefinitionKey = (
  dispStatus,
  refillStatus,
  isCernerPilot = false,
) => {
  const key = refillStatus || dispStatus;

  // For V2 definitions, map V1 keys to V2 keys
  if (isCernerPilot) {
    switch (key) {
      case 'refillinprocess':
      case 'submitted':
        return 'inprogress';
      case 'expired':
      case 'discontinued':
      case 'hold':
        return 'inactive';
      case 'activeParked':
        return 'active';
      case 'transferred':
        return 'transferred';
      case 'unknown':
        return 'unknown';
      default:
        return key;
    }
  }

  return key;
};

/**
 * Returns the appropriate filter options object based on Cerner pilot flag
 * @param {boolean} isCernerPilot - Whether Cerner pilot is enabled
 * @returns {Object} Filter options object
 */
export const getFilterOptions = isCernerPilot => {
  return isCernerPilot ? filterOptionsV2 : filterOptions;
};
