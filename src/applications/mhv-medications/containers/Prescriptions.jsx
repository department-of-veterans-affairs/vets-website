import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { useSelector, useDispatch } from 'react-redux';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';
import {
  usePrintTitle,
  updatePageTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import CernerFacilityAlert from '~/platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
import useAcceleratedData from '~/platform/mhv/hooks/useAcceleratedData';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import PrescriptionsPrintOnly from './PrescriptionsPrintOnly';

import { useGetAllergiesQuery } from '../api/allergiesApi';
import { getPrescriptionsExportList } from '../api/prescriptionsApi';

import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import MedicationsListFilter from '../components/MedicationsList/MedicationsListFilter';
import EmptyPrescriptionContent from '../components/MedicationsList/EmptyPrescriptionContent';
import FileExportErrorNotification from '../components/MedicationsList/FileExportErrorNotification';
import FilterAriaRegion from '../components/MedicationsList/FilterAriaRegion';
import InProductionEducationFiltering from '../components/MedicationsList/InProductionEducationFiltering';
import MedicationsListHeader from '../components/MedicationsList/MedicationsListHeader';
import NoFilterMatches from '../components/MedicationsList/NoFilterMatches';
import RefillPrescriptionsCard from '../components/MedicationsList/RefillPrescriptionsCard';

import Alert from '../components/shared/Alert';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import DelayedRefillAlert from '../components/shared/DelayedRefillAlert';
import NeedHelp from '../components/shared/NeedHelp';
import PrintDownload from '../components/shared/PrintDownload';

import { useFetchPrescriptionsList } from '../hooks/MedicationsList/useFetchPrescriptionsList';
import { useFocusManagement } from '../hooks/MedicationsList/useFocusManagement';
import { usePageTitle } from '../hooks/usePageTitle';
import useRxListExport from '../hooks/useRxListExport';

import {
  setSortOption,
  setFilterOption,
  setPageNumber,
} from '../redux/preferencesSlice';

import { selectUserDob, selectUserFullName } from '../selectors/selectUser';
import { selectPrescriptionId } from '../selectors/selectPrescription';
import {
  selectSortOption,
  selectFilterOption,
} from '../selectors/selectPreferences';

import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
} from '../util/constants';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import { getFilterOptions } from '../util/helpers/getRxStatus';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
  selectMedicationsManagementImprovementsFlag,
} from '../util/selectors';
import RefillProcess from '../components/shared/RefillProcess';

const Prescriptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dob = useSelector(selectUserDob);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const isManagementImprovementsEnabled = useSelector(
    selectMedicationsManagementImprovementsFlag,
  );
  const prescriptionId = useSelector(selectPrescriptionId);
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);
  const userName = useSelector(selectUserFullName);
  const isAlertVisible = useMemo(() => false, []);
  const ssoe = useSelector(isAuthenticatedWithSSOe);

  const currentFilterOptions = getFilterOptions(
    isCernerPilot,
    isV2StatusMapping,
  );
  const {
    isAcceleratingAllergies,
    isCerner,
    isLoading: isAcceleratedDataLoading,
  } = useAcceleratedData();

  const [searchParams] = useSearchParams();
  const rxRenewalMessageSuccess = searchParams.get('rxRenewalMessageSuccess');
  const deleteDraftSuccess = searchParams.get('draftDeleteSuccess');

  // Track when user returns from Rx Renewal SM flow
  useEffect(
    () => {
      if (rxRenewalMessageSuccess) {
        recordEvent({
          event: 'api_call',
          'api-name': 'Rx SM Renewal',
          'api-status': 'successful',
        });
        datadogRum.addAction('Rx SM Renewal Return', {
          status: 'successful',
        });
      }
    },
    [rxRenewalMessageSuccess],
  );

  const {
    prescriptionsData,
    prescriptionsApiError,
    isLoading,
    setQueryParams,
  } = useFetchPrescriptionsList();

  const { pagination, meta = {} } = prescriptionsData || {};
  const { filterCount } = meta;

  const paginatedPrescriptionsList = useMemo(
    () => {
      if (prescriptionsData?.prescriptions) {
        return prescriptionsData.prescriptions;
      }
      return undefined;
    },
    [prescriptionsData],
  );

  const filteredList = useMemo(() => prescriptionsData?.prescriptions || [], [
    prescriptionsData?.prescriptions,
  ]);

  const [loadingMessage, setLoadingMessage] = useState('');
  const scrollLocation = useRef();

  const { data: allergies, error: allergiesError } = useGetAllergiesQuery(
    {
      isAcceleratingAllergies,
      isCerner,
    },
    {
      skip: isAcceleratedDataLoading, // Wait for Cerner data and toggles to load before calling API
    },
  );

  // Initialize export hook
  const {
    onDownload: handleExportListDownload,
    isLoading: isExportLoading,
    isSuccess: isExportSuccess,
    hasError: hasExportError,
    errorFormat,
    shouldPrint,
    printList,
    exportList,
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

  // No medications match the current filter
  const noFilterMatches =
    filteredList?.length === 0 &&
    filterCount &&
    Object.values(filterCount).some(value => value !== 0);

  // Focus element on initial load and after filter/sort changes
  useFocusManagement({
    isLoading,
    filteredList,
    noFilterMatches,
    isReturningFromDetailsPage: !!prescriptionId, // TODO: This is not currently working because prescriptionId is always null. https://github.com/department-of-veterans-affairs/va.gov-team/issues/131061
    scrollLocation,
    showingFocusedAlert: rxRenewalMessageSuccess || deleteDraftSuccess,
  });

  const refillAlertList = prescriptionsData?.refillAlertList || [];

  // Update filter and sort in a single function
  const updateFilterAndSort = (newFilterOption, newSortOption) => {
    // Prepare updates for a single state change
    const updates = {};

    const isFiltering = newFilterOption !== null;
    setLoadingMessage(
      `${isFiltering ? 'Filtering' : 'Sorting'} your medications...`,
    );

    if (isFiltering) {
      updates.filterOption = currentFilterOptions[newFilterOption]?.url || '';
      updates.page = 1;
      dispatch(setFilterOption(newFilterOption));
      dispatch(setPageNumber(1));
    }

    if (newSortOption && newSortOption !== selectedSortOption) {
      updates.sortEndpoint = rxListSortingOptions[newSortOption].API_ENDPOINT;
      dispatch(setSortOption(newSortOption));
      resetExportState();
    }

    // Only update if we have changes
    if (Object.keys(updates).length > 0) {
      setQueryParams(prev => ({
        ...prev,
        ...updates,
      }));
      resetExportState();
    }

    navigate('/?page=1', { replace: true });
  };

  const basePageTitle = 'Medications | Veterans Affairs';
  usePageTitle(basePageTitle);
  usePrintTitle(basePageTitle, userName, dob, updatePageTitle);

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

  const renderMedicationsContent = () => {
    // No medications exist
    const noMedications =
      filteredList?.length === 0 &&
      filterCount &&
      Object.values(filterCount).every(value => value === 0);

    if (noMedications) {
      return <EmptyPrescriptionContent />;
    }

    let contentMarginTop;
    if (paginatedPrescriptionsList?.length || filteredList?.length) {
      contentMarginTop = '0';
    } else {
      contentMarginTop = hasExportError ? '5' : '3';
    }

    // Medications exist and should be displayed
    const hasMedications =
      filteredList?.length > 0 || paginatedPrescriptionsList?.length > 0;

    const filterApplied =
      selectedFilterOption &&
      selectedFilterOption !== ALL_MEDICATIONS_FILTER_KEY;

    return (
      <>
        <RefillPrescriptionsCard />
        {/* TODO this component never renders. https://github.com/department-of-veterans-affairs/va.gov-team/issues/131332 */}
        <Alert
          isAlertVisible={isAlertVisible}
          paginatedPrescriptionsList={paginatedPrescriptionsList}
          selectedFilterOption={selectedFilterOption}
          ssoe={ssoe}
        />
        {hasExportError && (
          <FileExportErrorNotification
            pdfTxtGenerateStatus={{ format: errorFormat }}
          />
        )}
        <div
          className={`landing-page-content vads-u-margin-top--${contentMarginTop} mobile-lg:vads-u-margin-top--${contentMarginTop}`}
        >
          <h2 className="vads-u-margin-y--3" data-testid="med-list">
            Medications list
          </h2>
          <MedicationsListFilter
            updateFilter={updateFilterAndSort}
            filterCount={filterCount}
            isLoading={isLoading}
          />
          <InProductionEducationFiltering />
          {isLoading && (
            <div className="vads-u-padding-y--9">
              <va-loading-indicator
                message={loadingMessage || 'Loading your medications...'}
                setFocus
                data-testid="loading-indicator"
              />
            </div>
          )}
          {hasMedications && (
            <>
              <FilterAriaRegion filterOption={selectedFilterOption} />
              <MedicationsListSort
                sortRxList={updateFilterAndSort}
                shouldShowSelect={!isLoading}
              />
              {!isLoading && (
                <MedicationsList
                  pagination={pagination}
                  rxList={filteredList}
                  scrollLocation={scrollLocation}
                  selectedSortOption={selectedSortOption}
                  updateLoadingStatus={setLoadingMessage}
                />
              )}
              <BeforeYouDownloadDropdown page={pageType.LIST} />
              <PrintDownload
                onDownload={handleExportListDownload}
                isSuccess={isExportSuccess}
                isLoading={isExportLoading}
                isFiltered={filterApplied}
                list
              />
            </>
          )}
          {!isLoading && noFilterMatches && <NoFilterMatches />}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="landing-page no-print">
        <MedicationsListHeader
          showRxRenewalDeleteDraftSuccessAlert={!!deleteDraftSuccess}
          showRxRenewalMessageSuccessAlert={!!rxRenewalMessageSuccess}
        />
        {prescriptionsApiError ? (
          <>
            <ApiErrorNotification errorType="access" content="medications" />
            <CernerFacilityAlert
              healthTool="MEDICATIONS"
              apiError={prescriptionsApiError}
            />
          </>
        ) : (
          <>
            <CernerFacilityAlert healthTool="MEDICATIONS" />
            {!!refillAlertList?.length && (
              <DelayedRefillAlert
                dataDogActionName={
                  dataDogActionNames.medicationsListPage.REFILL_ALERT_LINK
                }
                refillAlertList={refillAlertList}
              />
            )}
            {renderMedicationsContent()}
          </>
        )}
        {isManagementImprovementsEnabled && <RefillProcess />}
        <NeedHelp page={pageType.LIST} />
      </div>
      <PrescriptionsPrintOnly
        list={printList.length > 0 ? printList : filteredList}
        hasError={hasExportError || isAlertVisible || !!allergiesError}
        isFullList={
          printList.length > 0 ? printList.length === exportList.length : true
        }
      />
    </>
  );
};

export default Prescriptions;
