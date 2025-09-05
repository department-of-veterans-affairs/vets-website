import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom-v5-compat';
import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';
import {
  usePrintTitle,
  updatePageTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import {
  dateFormat,
  generateTextFile,
  getErrorTypeFromFormat,
} from '../util/helpers';
import {
  PDF_TXT_GENERATE_STATUS,
  rxListSortingOptions,
  medicationsUrls,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
  filterOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  defaultSelectedSortOption,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import { buildPrescriptionsTXT, buildAllergiesTXT } from '../util/txtConfigs';
import Alert from '../components/shared/Alert';
import {
  selectGroupingFlag,
  selectRefillProgressFlag,
  selectIPEContentFlag,
} from '../util/selectors';
import PrescriptionsPrintOnly from './PrescriptionsPrintOnly';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import MedicationsListFilter from '../components/MedicationsList/MedicationsListFilter';
import RefillAlert from '../components/shared/RefillAlert';
import NeedHelp from '../components/shared/NeedHelp';
import InProductionEducationFiltering from '../components/MedicationsList/InProductionEducationFiltering';
import { useGetAllergiesQuery } from '../api/allergiesApi';
import {
  useGetPrescriptionsListQuery,
  getPrescriptionSortedList,
} from '../api/prescriptionsApi';
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
  selectPageNumber,
} from '../selectors/selectPreferences';
import { buildPdfData } from '../util/buildPdfData';
import { generateMedicationsPdfFile } from '../util/generateMedicationsPdfFile';

const Prescriptions = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(selectUserFullName);
  const dob = useSelector(selectUserDob);

  // Get sort/filter selections from store.
  const selectedSortOption = useSelector(selectSortOption);
  const selectedFilterOption = useSelector(selectFilterOption);
  const currentPage = useSelector(selectPageNumber);

  // Get feature flags
  const showGroupingContent = useSelector(selectGroupingFlag);
  const showRefillProgressContent = useSelector(selectRefillProgressFlag);
  const showIPEContent = useSelector(selectIPEContentFlag);

  // Track if we've initialized from session storage
  const initializedFromSession = useRef(false);

  // Consolidate query parameters into a single state object to avoid multiple re-renders
  const [queryParams, setQueryParams] = useState({
    page: currentPage || 1,
    perPage: showGroupingContent ? 10 : 20,
    sortEndpoint:
      rxListSortingOptions[selectedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: filterOptions[selectedFilterOption]?.url || '',
  });

  // Use the consolidated query parameters for RTK Query
  const {
    data: prescriptionsData,
    error: prescriptionsApiError,
    isLoading: isPrescriptionsLoading,
    isFetching: isPrescriptionsFetching,
  } = useGetPrescriptionsListQuery(queryParams);

  // Extract page from URL query params
  const page = useMemo(
    () => {
      const query = new URLSearchParams(search);
      return Number(query.get('page'));
    },
    [search],
  );

  // Mark as initialized after the first render
  useEffect(() => {
    if (!initializedFromSession.current) {
      initializedFromSession.current = true;
    }
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
  const { prescriptions: filteredList } = prescriptionsData || [];
  const { filterCount } = meta || {};

  // Extract active refills for the RefillAlert component
  const activeRefills = useMemo(
    () => {
      if (!filteredList?.length) return [];

      return filteredList.filter(
        prescription =>
          prescription.dispStatus === 'Active: Refill in Process' ||
          prescription.dispStatus === 'Active: Submitted',
      );
    },
    [filteredList],
  );

  const prescriptionId = useSelector(selectPrescriptionId);
  const [prescriptionsFullList, setPrescriptionsFullList] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printedList, setPrintedList] = useState([]);
  const [hasFullListDownloadError, setHasFullListDownloadError] = useState(
    false,
  );
  const [isRetrievingFullList, setIsRetrievingFullList] = useState(false);
  const isAlertVisible = useMemo(() => false, []);
  const [isLoading, setLoading] = useState();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });
  const scrollLocation = useRef();
  const { data: allergies, error: allergiesError } = useGetAllergiesQuery();

  const refillAlertList = prescriptionsData?.refillAlertList || [];

  const updateLoadingStatus = (newIsLoading, newLoadingMessage) => {
    if (newIsLoading !== null) setLoading(newIsLoading);
    if (newLoadingMessage) setLoadingMessage(newLoadingMessage);
  };

  // Update filter and sort in a single function
  const updateFilterAndSort = (newFilterOption, newSortOption) => {
    // Prepare updates for a single state change
    const updates = {};

    const isFiltering = newFilterOption !== null;
    updateLoadingStatus(
      null,
      `${isFiltering ? 'Filtering' : 'Sorting'} your medications...`,
    );

    if (isFiltering) {
      updates.filterOption = filterOptions[newFilterOption]?.url || '';
      updates.page = 1;

      if (newFilterOption === selectedFilterOption) {
        document.getElementById('showingRx').scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }

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
    }

    navigate('/?page=1', { replace: true });
  };

  // Handle pagination changes
  const handlePageChange = newPage => {
    dispatch(setPageNumber(newPage));
    setQueryParams(prev => ({
      ...prev,
      page: newPage,
    }));
    navigate(`/?page=${newPage}`, { replace: true });
  };

  const printRxList = useCallback(
    () => {
      window.print();
      setPrintedList(filteredList);
    },
    [filteredList],
  );

  const goToPrevious = () => {
    scrollLocation?.current?.scrollIntoView();
  };

  // Load from URL params if needed
  useEffect(
    () => {
      if (page && page !== queryParams.page) {
        setQueryParams(prev => ({
          ...prev,
          page,
        }));
      }
    },
    [page],
  );

  useEffect(() => {
    if (!isLoading) {
      if (prescriptionId) {
        goToPrevious();
      } else {
        focusElement(document.querySelector('h1'));
      }
    }
  }, []);

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
    [isLoading, filteredList],
  );

  // Update page title
  useEffect(
    () => {
      updatePageTitle('Medications | Veterans Affairs');
    },
    [currentPage],
  );

  // Update loading state based on RTK Query states
  useEffect(
    () => {
      updateLoadingStatus(isPrescriptionsLoading || isPrescriptionsFetching);

      // Reset the loading message after finishing loading.
      if (!isPrescriptionsFetching && !isPrescriptionsLoading) {
        setLoadingMessage('');
      }
    },
    [isPrescriptionsLoading, isPrescriptionsFetching],
  );

  // Handle URL validation
  useEffect(
    () => {
      if (Number.isNaN(page) || page < 1) {
        navigate(`/?page=${currentPage || 1}`, { replace: true });
      } else if (page !== currentPage) {
        // If the URL page parameter differs from our Redux state, update Redux
        dispatch(setPageNumber(page));
      }
    },
    [page, navigate, currentPage, dispatch],
  );

  useEffect(
    () => {
      if (filteredList?.length) {
        setPrintedList(filteredList);
      }
    },
    [filteredList],
  );

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, updatePageTitle);

  useEffect(
    () => {
      if (!selectedFilterOption) {
        dispatch(setFilterOption(ALL_MEDICATIONS_FILTER_KEY));
      }
    },
    [dispatch, selectedFilterOption],
  );

  const txtData = useCallback(
    (rxList, allergiesList) => {
      return (
        `${"\nIf you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.\n\n\n" +
          'Medications\n\n'}${
          userName.first
            ? `${userName.last}, ${userName.first}`
            : userName.last || ' '
        }\n\n` +
        `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}\n\n` +
        `Report generated by My HealtheVet on VA.gov on ${dateFormat(
          Date.now(),
          'MMMM D, YYYY',
        )}\n\n` +
        `This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.\n\n\n` +
        `Medications list\n\n` +
        `Showing ${
          prescriptionsFullList?.length
        } records, ${rxListSortingOptions[
          selectedSortOption
        ].LABEL.toLowerCase()}\n\n${rxList}${allergiesList ?? ''}`
      );
    },
    [userName, dob, selectedSortOption, prescriptionsFullList],
  );

  const generatePDF = useCallback(
    async (rxList, allergiesList) => {
      const pdfDataObj = buildPdfData({
        userName,
        dob,
        selectedSortOption,
        rxList,
        allergiesList,
      });
      await generateMedicationsPdfFile({ userName, pdfData: pdfDataObj });
      setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
    },
    [userName, dob, selectedSortOption, setPdfTxtGenerateStatus],
  );

  const generateTXT = useCallback(
    (rxList, allergiesList) => {
      generateTextFile(
        txtData(rxList, allergiesList),
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
      );
      setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
    },
    [userName, txtData, setPdfTxtGenerateStatus],
  );

  useEffect(
    () => {
      if (
        ((prescriptionsFullList?.length &&
          pdfTxtGenerateStatus.format !== PRINT_FORMAT.PRINT) ||
          (pdfTxtGenerateStatus.format === PRINT_FORMAT.PRINT &&
            filteredList?.length)) &&
        allergies &&
        !allergiesError &&
        pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress
      ) {
        if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.PDF) {
          generatePDF(
            buildPrescriptionsPDFList(prescriptionsFullList),
            buildAllergiesPDFList(allergies),
          );
        } else if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.TXT) {
          generateTXT(
            buildPrescriptionsTXT(prescriptionsFullList),
            buildAllergiesTXT(allergies),
          );
        } else if (
          pdfTxtGenerateStatus.format === PRINT_FORMAT.PRINT ||
          pdfTxtGenerateStatus.format === PRINT_FORMAT.PRINT_FULL_LIST
        ) {
          if (!isLoading && loadingMessage === '') {
            let listForPrint;
            if (pdfTxtGenerateStatus.format !== PRINT_FORMAT.PRINT_FULL_LIST) {
              listForPrint = filteredList;
            } else {
              listForPrint = prescriptionsFullList;
            }
            setPrintedList(listForPrint);
            setPdfTxtGenerateStatus({
              status: PDF_TXT_GENERATE_STATUS.NotStarted,
            });
            // Set the print trigger instead of using setTimeout
            setShouldPrint(true);
          }
          updateLoadingStatus(false, '');
        }
      } else if (
        ((prescriptionsFullList?.length &&
          pdfTxtGenerateStatus.format !== PRINT_FORMAT.PRINT) ||
          (paginatedPrescriptionsList?.length &&
            pdfTxtGenerateStatus.format === PRINT_FORMAT.PRINT)) &&
        allergiesError &&
        pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress
      ) {
        updateLoadingStatus(false, '');
      }
    },
    [
      allergies,
      allergiesError,
      prescriptionsFullList,
      pdfTxtGenerateStatus.status,
      pdfTxtGenerateStatus.format,
      isLoading,
      loadingMessage,
      generatePDF,
      generateTXT,
      isRetrievingFullList,
      filteredList,
      paginatedPrescriptionsList,
      printRxList,
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

  const handleFullListDownload = async format => {
    setHasFullListDownloadError(false);
    const isTxtOrPdf =
      format === DOWNLOAD_FORMAT.PDF || format === DOWNLOAD_FORMAT.TXT;
    setPdfTxtGenerateStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
    });
    if (
      (isTxtOrPdf ||
        !allergies ||
        (format === PRINT_FORMAT.PRINT_FULL_LIST &&
          !prescriptionsFullList.length)) &&
      !prescriptionsFullList.length
    ) {
      setIsRetrievingFullList(true);
      const { data, isError } = await dispatch(
        getPrescriptionSortedList.initiate(
          {
            sortEndpoint: rxListSortingOptions[selectedSortOption].API_ENDPOINT,
            includeImage: false,
          },
          {
            forceRefetch: true,
          },
        ),
      );

      if (isError) {
        setHasFullListDownloadError(true);
      } else {
        setPrescriptionsFullList(data.prescriptions);
      }
      setIsRetrievingFullList(false);
    }
  };

  const isShowingErrorNotification = Boolean(
    (pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress &&
      allergiesError) ||
      hasFullListDownloadError,
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
          <h2 className="vads-u-margin--0 vads-u-font-size--h3">
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

  const renderRefillAlert = () => {
    if (!showRefillProgressContent) return null;

    return (
      <RefillAlert
        dataDogActionName={
          dataDogActionNames.medicationsListPage.REFILL_ALERT_LINK
        }
        activeRefills={activeRefills}
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
        updateLoadingStatus={updateLoadingStatus}
        onPageChange={handlePageChange}
      />
    );
  };

  const renderHeader = () => (
    <>
      <h1 data-testid="list-page-title" className="vads-u-margin-bottom--2">
        Medications
      </h1>
      <p
        className="vads-u-margin-top--0 vads-u-margin-bottom--4"
        data-testid="Title-Notes"
      >
        <>
          Bring your medications list to each appointment. And tell your
          provider about any new allergies or reactions. If you use Meds by
          Mail, you can also call your servicing center and ask them to update
          your records.
        </>
      </p>
      <a
        href="/my-health/medical-records/allergies"
        rel="noreferrer"
        className="vads-u-display--block vads-u-margin-bottom--3"
        data-testid="allergies-link"
      >
        Go to your allergies and reactions
      </a>
    </>
  );

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
            {showIPEContent && <InProductionEducationFiltering />}
          </>
          {isLoading && renderLoadingIndicator()}
          {hasMedications && (
            <>
              {!isLoading && (
                <MedicationsListSort sortRxList={updateFilterAndSort} />
              )}
              <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
              {!isLoading && renderMedicationsList()}
              <BeforeYouDownloadDropdown page={pageType.LIST} />
              <PrintDownload
                onDownload={handleFullListDownload}
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
            <CernerFacilityAlert />
          </>
        ) : (
          <>
            <CernerFacilityAlert />
            {renderRefillAlert()}
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
        hasError={hasFullListDownloadError || isAlertVisible || allergiesError}
        isFullList={printedList.length === prescriptionsFullList.length}
      />
    </div>
  );
};

export default Prescriptions;

Prescriptions.propTypes = {
  fullList: PropTypes.any,
};
