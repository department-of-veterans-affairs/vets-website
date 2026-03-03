import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import useAcceleratedData from '~/platform/mhv/hooks/useAcceleratedData';

import NeedHelp from '../components/shared/NeedHelp';
import PrintDownloadCard from '../components/shared/PrintDownloadCard';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import EmptyPrescriptionContent from '../components/MedicationsList/EmptyPrescriptionContent';

import { useGetAllergiesQuery } from '../api/allergiesApi';
import { getPrescriptionsExportList } from '../api/prescriptionsApi';

import { useFetchMedicationHistory } from '../hooks/MedicationHistory/useFetchMedicationHistory';
import { useFocusManagement } from '../hooks/MedicationsList/useFocusManagement';
import useRxListExport from '../hooks/useRxListExport';

import { setSortOption } from '../redux/preferencesSlice';

import { selectUserDob, selectUserFullName } from '../selectors/selectUser';
import {
  selectSortOption,
  selectFilterOption,
} from '../selectors/selectPreferences';

import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
} from '../util/constants';
import { pageType } from '../util/dataDogConstants';
import { getFilterOptions } from '../util/helpers/getRxStatus';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../util/selectors';

const MedicationHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dob = useSelector(selectUserDob);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);
  const userName = useSelector(selectUserFullName);

  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );

  const {
    isAcceleratingAllergies,
    isCerner,
    isLoading: isAcceleratedDataLoading,
  } = useAcceleratedData();

  const {
    prescriptionsData,
    prescriptionsApiError,
    isLoading,
    setQueryParams,
  } = useFetchMedicationHistory();

  const { pagination, meta = {} } = prescriptionsData || {};
  const filteredList = useMemo(() => prescriptionsData?.prescriptions || [], [
    prescriptionsData?.prescriptions,
  ]);
  const { filterCount } = meta;

  const noFilterMatches =
    filteredList?.length === 0 &&
    filterCount &&
    Object.values(filterCount).some(value => value !== 0);

  const [loadingMessage, setLoadingMessage] = useState(
    'Loading medications...',
  );

  // Fetch allergies for export
  const { data: allergies, error: allergiesError } = useGetAllergiesQuery(
    {
      isAcceleratingAllergies,
      isCerner,
    },
    {
      skip: isAcceleratedDataLoading,
    },
  );

  // Initialize export hook - same as Prescriptions.jsx
  const {
    onDownload: handleExportListDownload,
    isLoading: isExportLoading,
    isSuccess: isExportSuccess,
    shouldPrint,
    resetExportState,
    clearPrintTrigger,
  } = useRxListExport({
    user: { ...userName, dob },
    allergies,
    allergiesError,
    selectedFilterOption,
    selectedSortOption,
    currentFilterOptions,
    features: { isCernerPilot, isV2StatusMapping },
    fetchExportList: async () => {
      return dispatch(
        getPrescriptionsExportList.initiate(
          {
            sortEndpoint: rxListSortingOptions[selectedSortOption].API_ENDPOINT,
            filterOption: currentFilterOptions[selectedFilterOption]?.url || '',
            includeImage: false,
          },
          {
            forceRefetch: true,
          },
        ),
      );
    },
  });

  // Check if any filters are applied
  const filterApplied =
    selectedFilterOption && selectedFilterOption !== ALL_MEDICATIONS_FILTER_KEY;

  const printRxList = useCallback(() => {
    window.print();
  }, []);

  // Handle print trigger from hook
  useEffect(
    () => {
      if (shouldPrint) {
        printRxList();
        clearPrintTrigger();
      }
    },
    [shouldPrint, printRxList, clearPrintTrigger],
  );

  const updateSort = (_filterOption, newSortOption) => {
    if (newSortOption && newSortOption !== selectedSortOption) {
      setLoadingMessage('Sorting your medications...');
      setQueryParams(prev => ({
        ...prev,
        sortEndpoint: rxListSortingOptions[newSortOption].API_ENDPOINT,
        page: 1,
      }));
      dispatch(setSortOption(newSortOption));
      resetExportState();
      navigate('/history', { replace: true });
    }
  };

  useFocusManagement({
    isLoading,
    filteredList,
    noFilterMatches,
    showingFocusedAlert: false,
  });

  // Medications exist and should be displayed
  const hasMedications = filteredList?.length > 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="vads-u-padding-y--9">
          <va-loading-indicator
            message={loadingMessage}
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      );
    }
    if (prescriptionsApiError) {
      return <ApiErrorNotification errorType="access" content="medications" />;
    }
    if (!hasMedications) {
      return <EmptyPrescriptionContent />;
    }
    return (
      <>
        <MedicationsListSort
          sortRxList={updateSort}
          shouldShowSelect={!isLoading}
        />
        {!isLoading &&
          pagination && (
            <MedicationsList
              pagination={pagination}
              rxList={filteredList}
              selectedSortOption={selectedSortOption}
              updateLoadingStatus={setLoadingMessage}
            />
          )}
        <PrintDownloadCard
          onDownload={handleExportListDownload}
          isSuccess={isExportSuccess}
          isLoading={isExportLoading}
          isFiltered={filterApplied}
          list
        />
      </>
    );
  };

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  return (
    <div>
      <h1 data-testid="medication-history-heading">Medication history</h1>
      <Link to="/in-progress">Go to your in-progress medications</Link>
      <span className="vads-u-margin-x--1">|</span>
      <Link to="/refill">Refill medications</Link>
      {renderContent()}
      <NeedHelp page={pageType.HISTORY} headingLevel={2} />
    </div>
  );
};

export default MedicationHistory;
