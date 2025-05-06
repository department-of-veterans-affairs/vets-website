import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  rxListSortingOptions,
  defaultSelectedSortOption,
  filterOptions,
} from '../util/constants';
import { selectGroupingFlag } from '../util/selectors';

/**
 * Custom hook to get consolidated query parameters for medication API requests
 *
 * @param {Object} overrides - Optional parameter overrides
 * @returns {Object} - Consolidated query parameters object
 */
const useQueryParams = (overrides = {}) => {
  const selectedSortOption = useSelector(
    state => state.rx.preferences.sortOption,
  );
  const selectedFilterOption = useSelector(
    state => state.rx.preferences.filterOption,
  );
  const currentPage = useSelector(state => state.rx.preferences.pageNumber);
  const showGroupingContent = useSelector(selectGroupingFlag);

  const [queryParams] = useState({
    page: overrides.page || currentPage || 1,
    perPage: overrides.perPage || (showGroupingContent ? 10 : 20),
    sortEndpoint:
      overrides.sortEndpoint ||
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption:
      overrides.filterOption || filterOptions[selectedFilterOption]?.url || '',
    ...overrides.additional,
  });

  return queryParams;
};

export default useQueryParams;
