import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom-v5-compat';
import { useGetPrescriptionsListQuery } from '../../api/prescriptionsApi';
import {
  rxListSortingOptions,
  defaultSelectedSortOption,
} from '../../util/constants';
import {
  selectSortOption,
  selectFilterOption,
} from '../../selectors/selectPreferences';
import { getFilterUrl } from '../../components/MedicationHistory/MedicationHistoryFilter';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../../util/selectors';

export const useFetchMedicationHistory = (perPage = 10) => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);

  const [queryParams, setQueryParams] = useState({
    page,
    perPage,
    sortEndpoint:
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: getFilterUrl(
      selectedFilterOption,
      isCernerPilot,
      isV2StatusMapping,
    ),
  });

  useEffect(
    () => {
      setQueryParams(prev => ({ ...prev, page }));
    },
    [page],
  );

  const {
    data: apiData,
    error: apiError,
    isLoading: apiIsLoading,
    isFetching: apiIsFetching,
  } = useGetPrescriptionsListQuery(queryParams);

  return {
    prescriptions: apiData?.prescriptions || [],
    prescriptionsData: apiData,
    prescriptionsApiError: apiError,
    isLoading: apiIsLoading || apiIsFetching,
    currentPage: queryParams.page,
    setQueryParams,
  };
};
