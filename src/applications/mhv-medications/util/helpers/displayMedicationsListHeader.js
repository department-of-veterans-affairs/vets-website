import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  filterOptions,
} from '../constants';

/**
 * Display the medication list header based on the selectedFilterOption
 * @param {String} selectedFilterOption - The filter option selected.
 * @returns {String}
 * - If selectedFilterOption is provided, return the label associated with the filter options key.
 * - If selectedFilterOption is not valid, throw an error for the unknown filter option.
 * @throws {Error} If `selectedFilterOption` is not recognized.
 */
export const displayMedicationsListHeader = selectedFilterOption => {
  switch (selectedFilterOption) {
    case ALL_MEDICATIONS_FILTER_KEY: {
      return filterOptions[ALL_MEDICATIONS_FILTER_KEY].label;
    }
    case ACTIVE_FILTER_KEY: {
      return `${filterOptions[ACTIVE_FILTER_KEY].label} medications`;
    }
    case RECENTLY_REQUESTED_FILTER_KEY: {
      return `${
        filterOptions[RECENTLY_REQUESTED_FILTER_KEY].label
      } medications`;
    }
    case RENEWAL_FILTER_KEY: {
      return 'Medications that need renewal before refill';
    }
    case NON_ACTIVE_FILTER_KEY: {
      return `${filterOptions[NON_ACTIVE_FILTER_KEY].label} medications`;
    }
    default:
      throw new Error(`Unknown filter option: ${selectedFilterOption}`);
  }
};
