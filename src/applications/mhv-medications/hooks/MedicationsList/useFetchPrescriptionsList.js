// src/applications/mhv-medications/hooks/MedicationsList/useFetchPrescriptionsList.js

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetPrescriptionsListQuery } from '../../api/prescriptionsApi';
import { useURLPagination } from '../useURLPagination';
import {
  rxListSortingOptions,
  defaultSelectedSortOption,
} from '../../util/constants';
import { getFilterOptions } from '../../util/helpers/getRxStatus';
import {
  selectSortOption,
  selectFilterOption,
} from '../../selectors/selectPreferences';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';

/**
 * Fetches the prescriptions list with pagination, sorting, and filtering.
 * Manages all query parameters internally based on URL state and Redux preferences.
 *
 * @returns {Object} Prescriptions list data and controls
 * @returns {Object} return.prescriptionsData - Prescriptions data from API
 * @returns {Object} return.prescriptionsApiError - API error if request failed
 * @returns {boolean} return.isLoading - True if data is loading or fetching
 * @returns {function} return.setQueryParams - Function to update query parameters
 */
export const useFetchPrescriptionsList = () => {
  // Get URL-based pagination
  const { currentPage } = useURLPagination();

  // Get Redux state for building query params
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);

  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );

  // Build and manage query parameters internally
  const [queryParams, setQueryParams] = useState({
    page: currentPage || 1,
    perPage: 10,
    sortEndpoint:
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: currentFilterOptions[selectedFilterOption]?.url || '',
  });

  useEffect(
    () => {
      setQueryParams(prev => ({
        ...prev,
        page: currentPage,
      }));
    },
    [currentPage],
  );

  // Fetch prescriptions with RTK Query
  const { data, error, isLoading, isFetching } = useGetPrescriptionsListQuery(
    queryParams,
  );

  return {
    prescriptionsData: data,
    prescriptionsApiError: error,
    isLoading: isLoading || isFetching,
    setQueryParams,
  };
};
