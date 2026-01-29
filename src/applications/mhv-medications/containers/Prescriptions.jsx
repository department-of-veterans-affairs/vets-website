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
import { usePageTitle } from '../hooks/usePageTitle';
import { useFocusManagement } from '../hooks/MedicationsList/useFocusManagement';

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

import { buildPdfData } from '../util/buildPdfData';
import {
  PDF_TXT_GENERATE_STATUS,
  rxListSortingOptions,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
  ALL_MEDICATIONS_FILTER_KEY,
  DATETIME_FORMATS,
} from '../util/constants';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import { generateMedicationsPdfFile } from '../util/generateMedicationsPdfFile';
import {
  dateFormat,
  displayHeaderPrefaceText,
  displayMedicationsListHeader,
  generateTextFile,
  generateTimestampForFilename,
} from '../util/helpers';
import { getFilterOptions } from '../util/helpers/getRxStatus';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../util/selectors';
import { buildPrescriptionsTXT, buildAllergiesTXT } from '../util/txtConfigs';

const Prescriptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dob = useSelector(selectUserDob);
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
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
  const [prescriptionsExportList, setPrescriptionsExportList] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printedList, setPrintedList] = useState([]);
  const [hasExportListDownloadError, setHasExportListDownloadError] = useState(
    false,
  );
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });
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
    isReturningFromDetailsPage: !!prescriptionId, // NOTE: This is not currently working because prescriptionId is always null. https://github.com/department-of-veterans-affairs/va.gov-team/issues/131061
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
      setPdfTxtGenerateStatus({
        ...pdfTxtGenerateStatus,
        status: PDF_TXT_GENERATE_STATUS.NotStarted,
      });
    }

    // Only update if we have changes
    if (Object.keys(updates).length > 0) {
      setQueryParams(prev => ({
        ...prev,
        ...updates,
      }));
      setPrescriptionsExportList([]);
    }

    navigate('/?page=1', { replace: true });
  };

  const basePageTitle = 'Medications | Veterans Affairs';
  usePageTitle(basePageTitle);
  usePrintTitle(basePageTitle, userName, dob, updatePageTitle);

  const txtData = useCallback(
    (rxList, allergiesList) => {
      return (
        `${"\nIf you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.\n\n\n" +
          'Medications\n\n'}${
          userName.first
            ? `${userName.last}, ${userName.first}`
            : userName.last || ' '
        }\n\n` +
        `Date of birth: ${dateFormat(
          dob,
          DATETIME_FORMATS.longMonthDate,
        )}\n\n` +
        `Report generated by My HealtheVet on VA.gov on ${dateFormat(
          Date.now(),
          DATETIME_FORMATS.longMonthDate,
        )}\n\n` +
        `${displayHeaderPrefaceText(
          selectedFilterOption,
          selectedSortOption,
          prescriptionsExportList?.length,
          false,
        )}\n\n\n` +
        `${displayMedicationsListHeader(
          selectedFilterOption,
          isCernerPilot,
          isV2StatusMapping,
          currentFilterOptions,
        )}\n\n` +
        `${rxList}${allergiesList ?? ''}`
      );
    },
    [
      userName,
      dob,
      selectedFilterOption,
      selectedSortOption,
      prescriptionsExportList,
      isCernerPilot,
      isV2StatusMapping,
      currentFilterOptions,
    ],
  );

  const generatePDF = useCallback(
    async (rxList, allergiesList) => {
      const pdfDataObj = buildPdfData({
        userName,
        dob,
        selectedFilterOption,
        selectedSortOption,
        rxList,
        allergiesList,
      });
      await generateMedicationsPdfFile({ userName, pdfData: pdfDataObj });
      setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
    },
    [
      userName,
      dob,
      selectedFilterOption,
      selectedSortOption,
      setPdfTxtGenerateStatus,
    ],
  );

  const generateTXT = useCallback(
    (rxList, allergiesList) => {
      generateTextFile(
        txtData(rxList, allergiesList),
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${generateTimestampForFilename()}`,
      );
      setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
    },
    [userName, txtData, setPdfTxtGenerateStatus],
  );

  useEffect(
    () => {
      const { format } = pdfTxtGenerateStatus;
      const isInProgress =
        pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress;
      const exportListReady = !!prescriptionsExportList?.length;
      const allergiesReady = !!allergies && !allergiesError;

      if (!isInProgress || !exportListReady || !allergiesReady) return;

      if (format === DOWNLOAD_FORMAT.PDF) {
        generatePDF(
          buildPrescriptionsPDFList(
            prescriptionsExportList,
            isCernerPilot,
            isV2StatusMapping,
          ),
          buildAllergiesPDFList(allergies),
        );
      } else if (format === DOWNLOAD_FORMAT.TXT) {
        generateTXT(
          buildPrescriptionsTXT(
            prescriptionsExportList,
            isCernerPilot,
            isV2StatusMapping,
          ),
          buildAllergiesTXT(allergies),
        );
      } else if (format === PRINT_FORMAT.PRINT) {
        setPrintedList(prescriptionsExportList);
        setPdfTxtGenerateStatus({
          status: PDF_TXT_GENERATE_STATUS.NotStarted,
        });
        // Set the print trigger instead of using setTimeout
        setShouldPrint(true);
      }
    },
    [
      allergies,
      allergiesError,
      prescriptionsExportList,
      pdfTxtGenerateStatus,
      generatePDF,
      generateTXT,
      isCernerPilot,
      isV2StatusMapping,
    ],
  );

  const printRxList = useCallback(() => {
    window.print();
  }, []);

  useEffect(
    () => {
      if (shouldPrint) {
        printRxList();
        setShouldPrint(false);
      }
    },
    [shouldPrint, printRxList],
  );

  const handleExportListDownload = async format => {
    setHasExportListDownloadError(false);
    const isTxtOrPdf =
      format === DOWNLOAD_FORMAT.PDF || format === DOWNLOAD_FORMAT.TXT;
    setPdfTxtGenerateStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
    });
    if (
      (isTxtOrPdf ||
        !allergies ||
        (format === PRINT_FORMAT.PRINT && !prescriptionsExportList.length)) &&
      !prescriptionsExportList.length
    ) {
      const { data, isError } = await dispatch(
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

      if (isError) {
        setHasExportListDownloadError(true);
      } else {
        setPrescriptionsExportList(data.prescriptions);
      }
    }
  };

  const renderMedicationsContent = () => {
    // No medications exist
    const noMedications =
      filteredList?.length === 0 &&
      filterCount &&
      Object.values(filterCount).every(value => value === 0);

    if (noMedications) {
      return <EmptyPrescriptionContent />;
    }

    const isShowingFileExportErrorNotification = Boolean(
      (pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress &&
        allergiesError) ||
        hasExportListDownloadError,
    );

    let contentMarginTop;
    if (paginatedPrescriptionsList?.length || filteredList?.length) {
      contentMarginTop = '0';
    } else {
      contentMarginTop = isShowingFileExportErrorNotification ? '5' : '3';
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
        {isShowingFileExportErrorNotification && (
          <FileExportErrorNotification
            pdfTxtGenerateStatus={pdfTxtGenerateStatus}
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
                isSuccess={
                  pdfTxtGenerateStatus.status ===
                  PDF_TXT_GENERATE_STATUS.Success
                }
                isLoading={
                  !allergiesError &&
                  pdfTxtGenerateStatus.status ===
                    PDF_TXT_GENERATE_STATUS.InProgress
                }
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
        <NeedHelp page={pageType.LIST} />
      </div>
      <PrescriptionsPrintOnly
        list={printedList.length > 0 ? printedList : filteredList}
        hasError={
          hasExportListDownloadError || isAlertVisible || !!allergiesError
        }
        isFullList={
          printedList.length > 0
            ? printedList.length === prescriptionsExportList.length
            : true
        }
      />
    </>
  );
};

export default Prescriptions;
