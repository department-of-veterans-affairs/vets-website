import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom-v5-compat';
import { useGetPrescriptionsListQuery } from '../../api/prescriptionsApi';
import {
  rxListSortingOptions,
  rxListSortingOptionsV2,
  defaultSelectedSortOption,
  getDefaultFilterOption,
} from '../../util/constants';
import {
  selectSortOption,
  selectFilterOption,
} from '../../selectors/selectPreferences';
import { getFilterUrl } from '../../components/MedicationHistory/MedicationHistoryFilter';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
  selectMedicationsManagementImprovementsFlag,
} from '../../util/selectors';

/**
 * Resolves the API_ENDPOINT for a sort option key, checking both V2 and V1
 * option maps so it works regardless of which map the key belongs to.
 */
const resolveSortEndpoint = (key, isManagementImprovements) => {
  const allOptions = isManagementImprovements
    ? { ...rxListSortingOptionsV2, ...rxListSortingOptions }
    : { ...rxListSortingOptions, ...rxListSortingOptionsV2 };
  return (
    allOptions[key]?.API_ENDPOINT ||
    (isManagementImprovements
      ? rxListSortingOptionsV2[Object.keys(rxListSortingOptionsV2)[0]]
          .API_ENDPOINT
      : rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT)
  );
};

export const useFetchMedicationHistory = (perPage = 10) => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const isManagementImprovements = useSelector(
    selectMedicationsManagementImprovementsFlag,
  );

  const effectiveFilter = getDefaultFilterOption(
    selectedFilterOption,
    isManagementImprovements,
  );

  const [queryParams, setQueryParams] = useState({
    page,
    perPage,
    sortEndpoint: resolveSortEndpoint(
      selectedSortOption,
      isManagementImprovements,
    ),
    filterOption: getFilterUrl(
      effectiveFilter,
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
