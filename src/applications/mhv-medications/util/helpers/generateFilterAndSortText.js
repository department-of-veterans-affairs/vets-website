import {
  ALL_MEDICATIONS_FILTER_KEY,
  filterOptions,
  rxListSortingOptions,
} from '../constants';

/**
 * Returns the filter and sort portion of the medications list results text ("Showing X - Y of Z <filter> medications, <sort>").
 * @param {string} selectedFilterOption The selected filter option key. Should be a key of {@link filterOptions}
 * @param {string} selectedSortOption The selected sort option key. Should be a key of {@link rxListSortingOptions}
 * @param {boolean} isFullList Whether the full list of medications is being shown
 * @returns The filter and sort portion of the list results text, e.g. "active medications, last filled first"
 */
export const generateFilterAndSortText = (
  selectedFilterOption,
  selectedSortOption,
  isFullList = false,
) => {
  const allMedsSelected = selectedFilterOption === ALL_MEDICATIONS_FILTER_KEY;
  const selectedFilterDisplay =
    filterOptions[selectedFilterOption]?.showingContentDisplayName;
  const filterText =
    !isFullList && !allMedsSelected
      ? `${selectedFilterDisplay} medications`
      : 'medications';
  const sortOptionLowercase = rxListSortingOptions[
    selectedSortOption
  ]?.LABEL.toLowerCase();
  return `${filterText}, ${sortOptionLowercase}`;
};
