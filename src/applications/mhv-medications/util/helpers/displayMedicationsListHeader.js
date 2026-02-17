import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  INACTIVE_FILTER_KEY,
  IN_PROGRESS_FILTER_KEY,
  SHIPPED_FILTER_KEY,
  TRANSFERRED_FILTER_KEY,
  STATUS_NOT_AVAILABLE_FILTER_KEY,
} from '../constants';
import { getFilterOptions } from './getRxStatus';

/**
 * Display the medication list header based on the selectedFilterOption
 * @param {String} selectedFilterOption - The filter option selected.
 * @param {Boolean} isCernerPilot - Whether Cerner pilot is enabled.
 * @param {Boolean} isV2StatusMapping - Whether V2 status mapping is enabled.
 * @param {Object} currentFilterOptions - The filter options object to use (optional, for backwards compatibility).
 * @returns {String}
 * - If selectedFilterOption is provided, return the label associated with the filter options key.
 * - If selectedFilterOption is not valid, throw an error for the unknown filter option.
 * @throws {Error} If `selectedFilterOption` is not recognized.
 */
export const displayMedicationsListHeader = (
  selectedFilterOption,
  isCernerPilot = false,
  isV2StatusMapping = false,
  currentFilterOptions = null,
) => {
  /* Use getFilterOptions if flags are provided, otherwise fall back to passed currentFilterOptions or default */
  const filterOptions =
    currentFilterOptions || getFilterOptions(isCernerPilot, isV2StatusMapping);
  switch (selectedFilterOption) {
    case ALL_MEDICATIONS_FILTER_KEY: {
      return filterOptions[ALL_MEDICATIONS_FILTER_KEY].label;
    }
    case ACTIVE_FILTER_KEY: {
      return `${filterOptions[ACTIVE_FILTER_KEY].label} medications`;
    }
    case RECENTLY_REQUESTED_FILTER_KEY: {
      return `${filterOptions[RECENTLY_REQUESTED_FILTER_KEY].label} medications`;
    }
    case IN_PROGRESS_FILTER_KEY: {
      return `${
        filterOptions[IN_PROGRESS_FILTER_KEY]?.label || 'In progress'
      } medications`;
    }
    case SHIPPED_FILTER_KEY: {
      return `${
        filterOptions[SHIPPED_FILTER_KEY]?.label || 'Shipped'
      } medications`;
    }
    case RENEWAL_FILTER_KEY: {
      return 'Medications that need renewal before refill';
    }
    case NON_ACTIVE_FILTER_KEY: {
      return `${
        filterOptions[NON_ACTIVE_FILTER_KEY]?.label || 'Non-active'
      } medications`;
    }
    case INACTIVE_FILTER_KEY: {
      return `${
        filterOptions[INACTIVE_FILTER_KEY]?.label || 'Inactive'
      } medications`;
    }
    case TRANSFERRED_FILTER_KEY: {
      return `${
        filterOptions[TRANSFERRED_FILTER_KEY]?.label || 'Transferred'
      } medications`;
    }
    case STATUS_NOT_AVAILABLE_FILTER_KEY: {
      return `${
        filterOptions[STATUS_NOT_AVAILABLE_FILTER_KEY]?.label ||
        'Status not available'
      } medications`;
    }
    default:
      throw new Error(`Unknown filter option: ${selectedFilterOption}`);
  }
};
