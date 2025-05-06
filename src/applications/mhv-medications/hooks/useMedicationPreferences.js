import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  rxListSortingOptions,
  defaultSelectedSortOption,
  filterOptions,
} from '../util/constants';
import { selectGroupingFlag } from '../util/selectors';

/**
 * Custom hook to get consolidated medication sorting and filtering preferences for API requests
 *
 * @returns {Object} - Consolidated query parameters object based on user preferences
 */
const useMedicationPreferences = () => {
  const selectedSortOption = useSelector(
    state => state.rx.preferences.sortOption,
  );
  const selectedFilterOption = useSelector(
    state => state.rx.preferences.filterOption,
  );
  const currentPage = useSelector(state => state.rx.preferences.pageNumber);
  const showGroupingContent = useSelector(selectGroupingFlag);

  const [queryParams, setQueryParams] = useState({
    page: currentPage || 1,
    perPage: showGroupingContent ? 10 : 20,
    sortEndpoint:
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: filterOptions[selectedFilterOption]?.url || '',
  });

  return [queryParams, setQueryParams];
};

export default useMedicationPreferences;
