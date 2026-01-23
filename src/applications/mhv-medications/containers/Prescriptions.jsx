import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import useAcceleratedData from '~/platform/mhv/hooks/useAcceleratedData';
import PropTypes from 'prop-types';
import {
  usePrintTitle,
  updatePageTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import MedsByMailContent from '../components/MedicationsList/MedsByMailContent';
import {
  dateFormat,
  displayHeaderPrefaceText,
  displayMedicationsListHeader,
  generateTextFile,
  generateTimestampForFilename,
  getErrorTypeFromFormat,
} from '../util/helpers';
import {
  PDF_TXT_GENERATE_STATUS,
  rxListSortingOptions,
  medicationsUrls,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
  ALL_MEDICATIONS_FILTER_KEY,
  defaultSelectedSortOption,
  DATETIME_FORMATS,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import { buildPrescriptionsTXT, buildAllergiesTXT } from '../util/txtConfigs';
import { getFilterOptions } from '../util/helpers/getRxStatus';
import Alert from '../components/shared/Alert';
import PrescriptionsPrintOnly from './PrescriptionsPrintOnly';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import DisplayCernerFacilityAlert from '../components/shared/DisplayCernerFacilityAlert';
import RxRenewalMessageSuccessAlert from '../components/shared/RxRenewalMessageSuccessAlert';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import MedicationsListFilter from '../components/MedicationsList/MedicationsListFilter';
import DelayedRefillAlert from '../components/shared/DelayedRefillAlert';
import NeedHelp from '../components/shared/NeedHelp';
import InProductionEducationFiltering from '../components/MedicationsList/InProductionEducationFiltering';
import { useGetAllergiesQuery } from '../api/allergiesApi';
import {
  useGetPrescriptionsListQuery,
  getPrescriptionsExportList,
} from '../api/prescriptionsApi';
import {
  setSortOption,
  setFilterOption,
  setPageNumber,
} from '../redux/preferencesSlice';
import {
  selectUserDob,
  selectUserFullName,
  selectHasMedsByMailFacility,
} from '../selectors/selectUser';
import { selectPrescriptionId } from '../selectors/selectPrescription';
import {
  selectSortOption,
  selectFilterOption,
} from '../selectors/selectPreferences';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../util/selectors';
import { buildPdfData } from '../util/buildPdfData';
import { generateMedicationsPdfFile } from '../util/generateMedicationsPdfFile';
import FilterAriaRegion from '../components/MedicationsList/FilterAriaRegion';
import RxRenewalDeleteDraftSuccessAlert from '../components/shared/RxRenewalDeleteDraftSuccessAlert';
import { useURLPagination } from '../hooks/useURLPagination';
import { usePageTitle } from '../hooks/usePageTitle';

const Prescriptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(selectUserFullName);
  const dob = useSelector(selectUserDob);
  const hasMedsByMailFacility = useSelector(selectHasMedsByMailFacility);
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

  // Get sort/filter selections from store.
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);

  const { currentPage, handlePageChange } = useURLPagination();

  // Consolidate query parameters into a single state object to avoid multiple re-renders
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

  // Use the consolidated query parameters for RTK Query
  const {
    data: prescriptionsData,
    error: prescriptionsApiError,
    isLoading: isPrescriptionsLoading,
    isFetching: isPrescriptionsFetching,
  } = useGetPrescriptionsListQuery(queryParams);

  const isLoading = isPrescriptionsLoading || isPrescriptionsFetching;

  /**
   * Shows loading spinner for all filter selections to provide
   * consistent visual feedback regardless of cache state
   */
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const filterTimeoutRef = useRef(null);
  const isShowingLoading = isLoading || isFilterLoading;

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const { pagination, meta } = prescriptionsData || {};
  const paginatedPrescriptionsList = useMemo(
    () => {
      if (prescriptionsData?.prescriptions) {
        return prescriptionsData.prescriptions;
      }
      return undefined;
    },
    [prescriptionsData],
  );

  const filteredList = useMemo(
    () => {
      return prescriptionsData?.prescriptions || [];
    },
    [prescriptionsData],
  );
  const { filterCount } = meta || {};
  const prescriptionId = useSelector(selectPrescriptionId);
  const [prescriptionsExportList, setPrescriptionsExportList] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printedList, setPrintedList] = useState([]);
  const [hasExportListDownloadError, setHasExportListDownloadError] = useState(
    false,
  );
  const isAlertVisible = useMemo(() => false, []);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
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

      // Always show loading spinner for filter selections (visual feedback)
      setIsFilterLoading(true);

      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }

      filterTimeoutRef.current = setTimeout(() => {
        setIsFilterLoading(false);
        filterTimeoutRef.current = null;
        // Only scroll after loading completes for better UX
        document.getElementById('showingRx')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }, 500);

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

  const printRxList = useCallback(() => {
    window.print();
  }, []);

  const goToPrevious = () => {
    scrollLocation?.current?.scrollIntoView();
  };

  useEffect(
    () => {
      if (!isLoading) {
        if (prescriptionId) {
          goToPrevious();
        } else if (!rxRenewalMessageSuccess && !deleteDraftSuccess) {
          focusElement(document.querySelector('h1'));
        }
      }
    },
    [isLoading, prescriptionId, rxRenewalMessageSuccess, deleteDraftSuccess],
  );

  useEffect(
    () => {
      if (
        !isLoading &&
        filteredList?.length === 0 &&
        filterCount &&
        Object.values(filterCount).some(value => value !== 0)
      ) {
        focusElement(document.getElementById('no-matches-msg'));
      }
    },
    [filteredList, isLoading, filterCount],
  );

  useEffect(
    () => {
      if (!isFirstLoad && !isLoading) {
        const showingRx = document.getElementById('showingRx');
        if (showingRx) {
          focusElement(showingRx);
          showingRx.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
        return;
      }

      if (isLoading === false && isFirstLoad) {
        setIsFirstLoad(false);
      }
    },
    [
      isLoading,
      filteredList,
      // TODO: This breaks the code because it causes the "Showing X - Y of Z medications" to be focused on initial page load.
      // Need to refactor these hooks to better handle the initial loading state to add this.
      // isFirstLoad
    ],
  );

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

  const isShowingErrorNotification = Boolean(
    (pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress &&
      allergiesError) ||
      hasExportListDownloadError,
  );

  let contentMarginTop;
  if (paginatedPrescriptionsList?.length || filteredList?.length) {
    contentMarginTop = '0';
  } else {
    contentMarginTop = isShowingErrorNotification ? '5' : '3';
  }

  const renderLoadingIndicator = () => (
    <div className="vads-u-padding-y--9">
      <va-loading-indicator
        message={loadingMessage || 'Loading your medications...'}
        setFocus
        data-testid="loading-indicator"
      />
    </div>
  );

  const renderEmptyPrescriptions = () => (
    <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color">
      <h2 className="vads-u-margin--0" data-testid="empty-medList-alert">
        You don’t have any VA prescriptions or medication records
      </h2>
      <p className="vads-u-margin-y--3">
        If you need a prescription or you want to tell us about a medication
        you’re taking, tell your care team at your next appointment.
      </p>
    </div>
  );

  const renderNoFilterMatches = () => (
    <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color vads-u-margin-top--3">
      <h3
        className="vads-u-margin--0"
        id="no-matches-msg"
        data-testid="zero-filter-results"
      >
        We didn’t find any matches for this filter
      </h3>
      <p className="vads-u-margin-y--2">Try selecting a different filter.</p>
    </div>
  );

  const renderErrorNotification = () => {
    if (!isShowingErrorNotification) return null;

    return (
      <div className="vads-u-margin-y--3">
        <ApiErrorNotification
          errorType={getErrorTypeFromFormat(pdfTxtGenerateStatus.format)}
          content="records"
        >
          <div>
            If it still doesn’t work, call us at{' '}
            <va-telephone contact="8773270022" /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </div>
        </ApiErrorNotification>
      </div>
    );
  };

  const renderRefillCard = () => {
    return (
      <va-card background>
        <div className="vads-u-padding-x--1">
          <h2 className="vads-u-margin--0 vads-u-margin-bottom--2 vads-u-font-size--h3">
            Refill prescriptions
          </h2>
          <Link
            className="vads-c-action-link--green vads-u-margin--0"
            to={medicationsUrls.subdirectories.REFILL}
            data-testid="prescriptions-nav-link-to-refill"
            data-dd-action-name={
              dataDogActionNames.medicationsListPage.START_REFILL_REQUEST
            }
          >
            Start a refill request
          </Link>
        </div>
      </va-card>
    );
  };

  const renderDelayedRefillAlert = () => {
    if (!refillAlertList?.length) return null;

    return (
      <DelayedRefillAlert
        dataDogActionName={
          dataDogActionNames.medicationsListPage.REFILL_ALERT_LINK
        }
        refillAlertList={refillAlertList}
      />
    );
  };

  const renderMedicationsList = () => {
    return (
      <MedicationsList
        pagination={pagination}
        rxList={filteredList}
        scrollLocation={scrollLocation}
        selectedSortOption={selectedSortOption}
        updateLoadingStatus={setLoadingMessage}
        onPageChange={handlePageChange}
      />
    );
  };

  const renderRxRenewalMessageSuccess = () => {
    if (deleteDraftSuccess) return <RxRenewalDeleteDraftSuccessAlert />;

    if (rxRenewalMessageSuccess) return <RxRenewalMessageSuccessAlert />;
    return null;
  };

  const renderHeader = () => {
    let titleNotesMessage =
      'Bring your medications list to each appointment. And tell your provider about any new allergies or reactions.';

    if (!hasMedsByMailFacility) {
      titleNotesMessage +=
        ' If you use Meds by Mail, you can also call your servicing center and ask them to update your records.';
    }

    const titleNotesBottomMarginUnit = hasMedsByMailFacility ? 3 : 2;

    return (
      <>
        <h1 data-testid="list-page-title" className="vads-u-margin-bottom--2">
          Medications
        </h1>
        {renderRxRenewalMessageSuccess()}
        <p
          className={`vads-u-margin-top--0 vads-u-margin-bottom--${titleNotesBottomMarginUnit}`}
          data-testid="Title-Notes"
        >
          {titleNotesMessage}
        </p>
        <a
          href="/my-health/medical-records/allergies"
          rel="noreferrer"
          className="vads-u-display--block vads-u-margin-bottom--3"
          data-testid="allergies-link"
        >
          Go to your allergies and reactions
        </a>
        {hasMedsByMailFacility && <MedsByMailContent />}
      </>
    );
  };

  const renderMedicationsContent = () => {
    // No medications exist
    const noMedications =
      filteredList?.length === 0 &&
      filterCount &&
      Object.values(filterCount).every(value => value === 0);

    // No medications match the current filter
    const noFilterMatches =
      filteredList?.length === 0 &&
      filterCount &&
      Object.values(filterCount).some(value => value !== 0);

    // Medications exist and should be displayed
    const hasMedications =
      filteredList?.length > 0 || paginatedPrescriptionsList?.length > 0;

    const filterApplied =
      selectedFilterOption &&
      selectedFilterOption !== ALL_MEDICATIONS_FILTER_KEY;

    if (noMedications) {
      return renderEmptyPrescriptions();
    }

    return (
      <>
        {renderRefillCard()}
        <Alert
          isAlertVisible={isAlertVisible}
          paginatedPrescriptionsList={paginatedPrescriptionsList}
          selectedFilterOption={selectedFilterOption}
          ssoe={ssoe}
        />
        {renderErrorNotification()}
        <div
          className={`landing-page-content vads-u-margin-top--${contentMarginTop}
            mobile-lg:vads-u-margin-top--${contentMarginTop}`}
        >
          <>
            <h2 className="vads-u-margin-y--3" data-testid="med-list">
              Medications list
            </h2>
            <MedicationsListFilter
              updateFilter={updateFilterAndSort}
              filterCount={filterCount}
            />
            <InProductionEducationFiltering />
          </>
          {isShowingLoading && renderLoadingIndicator()}
          {hasMedications && (
            <>
              <FilterAriaRegion filterOption={selectedFilterOption} />
              <MedicationsListSort
                sortRxList={updateFilterAndSort}
                shouldShowSelect={!isLoading}
              />
              <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
              {!isShowingLoading && renderMedicationsList()}
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
                list
                isFiltered={filterApplied}
              />
            </>
          )}
          {!isLoading && noFilterMatches && renderNoFilterMatches()}
        </div>
      </>
    );
  };

  const content = () => {
    return (
      <div className="landing-page no-print">
        {renderHeader()}
        {prescriptionsApiError ? (
          <>
            <ApiErrorNotification errorType="access" content="medications" />
            <DisplayCernerFacilityAlert />
          </>
        ) : (
          <>
            <DisplayCernerFacilityAlert />
            {renderDelayedRefillAlert()}
            {renderMedicationsContent()}
          </>
        )}
        <NeedHelp page={pageType.LIST} />
      </div>
    );
  };

  return (
    <div>
      {content()}
      <PrescriptionsPrintOnly
        list={printedList}
        hasError={
          hasExportListDownloadError || isAlertVisible || !!allergiesError
        }
        isFullList={printedList.length === prescriptionsExportList.length}
      />
    </div>
  );
};

export default Prescriptions;

Prescriptions.propTypes = {
  fullList: PropTypes.any,
};
