import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetPrescriptionsListQuery } from '../../api/prescriptionsApi';
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

export const useFetchMedicationHistory = (initialPage = 1, perPage = 10) => {
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);

  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );

  const [queryParams, setQueryParams] = useState({
    page: initialPage,
    perPage,
    sortEndpoint:
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: currentFilterOptions[selectedFilterOption]?.url || '',
  });

  const {
    data: apiData,
    error: apiError,
    isLoading: apiIsLoading,
    isFetching: apiIsFetching,
  } = useGetPrescriptionsListQuery(queryParams);

  const setPage = page => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  return {
    prescriptions: apiData?.prescriptions || [],
    prescriptionsData: apiData,
    prescriptionsApiError: apiError,
    isLoading: apiIsLoading || apiIsFetching,
    currentPage: queryParams.page,
    setPage,
    setQueryParams,
  };
};
