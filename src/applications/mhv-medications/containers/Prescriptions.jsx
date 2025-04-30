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
  reportGeneratedBy,
} from '@department-of-veterans-affairs/mhv/exports';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
  getErrorTypeFromFormat,
} from '../util/helpers';
import {
  PDF_TXT_GENERATE_STATUS,
  rxListSortingOptions,
  SESSION_SELECTED_SORT_OPTION,
  SESSION_SELECTED_FILTER_OPTION,
  defaultSelectedSortOption,
  medicationsUrls,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
  SESSION_SELECTED_PAGE_NUMBER,
  filterOptions,
  ALL_MEDICATIONS_FILTER_KEY,
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
  selectAllergiesFlag,
  selectGroupingFlag,
  selectRefillContentFlag,
  selectRefillProgressFlag,
  selectRemoveLandingPageFlag,
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

const Prescriptions = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions?.selectedSortOption,
  );

  // Get feature flags
  const showGroupingContent = useSelector(selectGroupingFlag);
  const showRefillContent = useSelector(selectRefillContentFlag);
  const showAllergiesContent = useSelector(selectAllergiesFlag);
  const showRefillProgressContent = useSelector(selectRefillProgressFlag);
  const removeLandingPage = useSelector(selectRemoveLandingPageFlag);
  const showIPEContent = useSelector(selectIPEContentFlag);

  // Get stored session values
  const storedPageNumber =
    sessionStorage.getItem(SESSION_SELECTED_PAGE_NUMBER) || '1';
  const storedFilterOption =
    sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
    ALL_MEDICATIONS_FILTER_KEY;
  const storedSortOption =
    sessionStorage.getItem(SESSION_SELECTED_SORT_OPTION) ||
    defaultSelectedSortOption;

  // Track if we've initialized from session storage
  const initializedFromSession = useRef(false);

  // Consolidate query parameters into a single state object to avoid multiple re-renders
  const [queryParams, setQueryParams] = useState({
    page: Number(storedPageNumber),
    perPage: showGroupingContent ? 10 : 20,
    sortEndpoint:
      rxListSortingOptions[storedSortOption]?.API_ENDPOINT ||
      rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
    filterOption: filterOptions[storedFilterOption]?.url || '',
  });

  // For components that still need individual state values
  const [filterOption, setFilterOption] = useState(storedFilterOption);

  // Use the consolidated query parameters for RTK Query
  const {
    data: prescriptionsData,
    error: prescriptionsApiError,
    isLoading: isPrescriptionsLoading,
    isFetching: isPrescriptionsFetching,
  } = useGetPrescriptionsListQuery(queryParams);

  // Derived from query params for backwards compatibility
  const currentPage = queryParams.page;

  // Mark as initialized after the first render
  useEffect(() => {
    if (!initializedFromSession.current) {
      initializedFromSession.current = true;
    }
  }, []);

  const { pagination, meta } = prescriptionsData || {};
  const { prescriptions: paginatedPrescriptionsList } = prescriptionsData || [];
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

  const prescriptionId = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails?.prescriptionId,
  );
  const [prescriptionsFullList, setPrescriptionsFullList] = useState([]);
  const [printedList, setPrintedList] = useState([]);
  const [hasFullListDownloadError, setHasFullListDownloadError] = useState(
    false,
  );
  const [isRetrievingFullList, setIsRetrievingFullList] = useState(false);
  const isAlertVisible = useMemo(() => false, []);
  const [isLoading, setLoading] = useState();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sortingInProgress, setSortingInProgress] = useState(false);
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });
  const scrollLocation = useRef();
  const page = useMemo(
    () => {
      const query = new URLSearchParams(search);
      return Number(query.get('page'));
    },
    [search],
  );
  const { data: allergies, error: allergiesError } = useGetAllergiesQuery();

  const updateLoadingStatus = (newIsLoading, newLoadingMessage) => {
    setLoading(newIsLoading);
    setLoadingMessage(newLoadingMessage);
  };

  // Update filter and sort in a single function
  const updateFilterAndSort = (newFilterOption, newSortOption) => {
    // Prepare updates for a single state change
    const updates = {};

    if (newFilterOption !== null) {
      updates.filterOption = filterOptions[newFilterOption]?.url || '';
      updates.page = 1;
      setFilterOption(newFilterOption);
      sessionStorage.setItem(SESSION_SELECTED_FILTER_OPTION, newFilterOption);
      navigate('/?page=1', { replace: true });
    }

    if (newSortOption && newSortOption !== selectedSortOption) {
      updates.sortEndpoint = rxListSortingOptions[newSortOption].API_ENDPOINT;
      sessionStorage.setItem(SESSION_SELECTED_SORT_OPTION, newSortOption);
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
  };

  // Update the sorting function to use consolidated state updates
  const sortRxList = sortOption => {
    if (sortOption !== selectedSortOption && sortOption !== '') {
      setPdfTxtGenerateStatus({
        ...pdfTxtGenerateStatus,
        status: PDF_TXT_GENERATE_STATUS.NotStarted,
      });
      updateFilterAndSort(null, sortOption);
    }
  };

  // Handle pagination changes
  const handlePageChange = newPage => {
    setQueryParams(prev => ({
      ...prev,
      page: newPage,
    }));
    sessionStorage.setItem(SESSION_SELECTED_PAGE_NUMBER, newPage);
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
      if (sortingInProgress && !isLoading) {
        focusElement(document.getElementById('showingRx'));
        setSortingInProgress(false);
      }
    },
    [sortingInProgress, isLoading],
  );

  // Update page title and session storage
  useEffect(
    () => {
      updatePageTitle('Medications | Veterans Affairs');
      sessionStorage.setItem(SESSION_SELECTED_PAGE_NUMBER, currentPage);
    },
    [currentPage],
  );

  // Update loading state based on RTK Query states
  useEffect(
    () => {
      updateLoadingStatus(
        isPrescriptionsLoading || isPrescriptionsFetching,
        isPrescriptionsLoading ? 'Loading your medications...' : '',
      );
    },
    [isPrescriptionsLoading, isPrescriptionsFetching],
  );

  // Handle URL validation
  useEffect(
    () => {
      if (Number.isNaN(page) || page < 1) {
        navigate(
          `/?page=${sessionStorage.getItem(SESSION_SELECTED_PAGE_NUMBER) || 1}`,
          { replace: true },
        );
      }
    },
    [page, navigate],
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

  useEffect(() => {
    if (!filterOption) {
      setFilterOption(ALL_MEDICATIONS_FILTER_KEY);
    }
  }, []);

  const selectedFilterOption =
    filterOptions[
      sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
        ALL_MEDICATIONS_FILTER_KEY
    ]?.showingContentDisplayName;

  const pdfData = useCallback(
    (rxList, allergiesList) => {
      return {
        subject: 'Full Medications List',
        headerBanner: [
          {
            text:
              'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at ',
          },
          {
            text: '988',
            weight: 'bold',
          },
          {
            text: '. Then select 1.',
          },
        ],
        headerLeft: userName.first
          ? `${userName.last}, ${userName.first}`
          : `${userName.last || ' '}`,
        headerRight: `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}`,
        footerLeft: reportGeneratedBy,
        footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
        title: 'Medications',
        preface: [
          {
            value: `This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.`,
          },
        ],
        results: [
          {
            header: 'Medications list',
            preface: `Showing ${
              rxList?.length
            } medications, ${rxListSortingOptions[
              selectedSortOption
            ].LABEL.toLowerCase()}`,
            list: rxList,
          },
          {
            header: 'Allergies',
            ...(allergiesList &&
              allergiesList.length > 0 && {
                preface: [
                  {
                    value:
                      'This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
                  },
                  {
                    value: `Showing ${
                      allergiesList.length
                    } records from newest to oldest`,
                  },
                ],
              }),
            list: allergiesList || [],
            ...(allergiesList &&
              !allergiesList.length && {
                preface:
                  'There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.',
              }),
            ...(!allergiesList && {
              preface: [
                {
                  value:
                    'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later.',
                },
                {
                  value:
                    'If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
                },
              ],
            }),
          },
        ],
      };
    },
    [userName, dob, selectedSortOption, selectedFilterOption],
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
    [
      userName,
      dob,
      selectedSortOption,
      selectedFilterOption,
      prescriptionsFullList,
    ],
  );

  const generatePDF = useCallback(
    (rxList, allergiesList) => {
      generateMedicationsPDF(
        'medications',
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
        pdfData(rxList, allergiesList),
      ).then(() => {
        setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
      });
    },
    [userName, pdfData, setPdfTxtGenerateStatus],
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
            printRxList();
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

  const handleFullListDownload = async format => {
    setHasFullListDownloadError(false);
    const isTxtOrPdf =
      format === DOWNLOAD_FORMAT.PDF || format === DOWNLOAD_FORMAT.TXT;
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

    setPdfTxtGenerateStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
    });
  };

  const isShowingErrorNotification = Boolean(
    (((prescriptionsFullList?.length &&
      pdfTxtGenerateStatus.format !== PRINT_FORMAT.PRINT) ||
      paginatedPrescriptionsList) &&
      pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress &&
      allergiesError) ||
      hasFullListDownloadError,
  );

  let contentMarginTop;
  if (paginatedPrescriptionsList?.length || filteredList?.length) {
    contentMarginTop = '0';
  } else {
    contentMarginTop = isShowingErrorNotification ? '5' : '3';
  }

  const renderLoadingIndicator = (message = 'Loading your medications...') => (
    <div className="vads-u-height--viewport vads-u-padding-top--3">
      <va-loading-indicator
        message={message}
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
    if (!showRefillContent) return null;

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
      />
    );
  };

  const renderMedicationsList = () => {
    if (isLoading) {
      return renderLoadingIndicator(loadingMessage);
    }

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
        {removeLandingPage ? (
          <>
            Bring your medications list to each appointment. And tell your
            provider about any new allergies or reactions. If you use Meds by
            Mail, you can also call your servicing center and ask them to update
            your records.
          </>
        ) : (
          <>
            When you share your medications list with providers, make sure you
            also tell them about your allergies and reactions to medications.
          </>
        )}
        {!showAllergiesContent && (
          <>
            {' '}
            If you print or download this list, we’ll include a list of your
            allergies.
          </>
        )}
      </p>
      {showAllergiesContent && (
        <a
          href="/my-health/medical-records/allergies"
          rel="noreferrer"
          className="vads-u-display--block vads-u-margin-bottom--3"
          data-testid="allergies-link"
        >
          Go to your allergies and reactions
        </a>
      )}
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

    if (isPrescriptionsLoading || isPrescriptionsFetching) {
      return renderLoadingIndicator();
    }

    if (noMedications) {
      return renderEmptyPrescriptions();
    }

    return (
      <>
        {renderRefillCard()}
        <Alert
          isAlertVisible={isAlertVisible}
          paginatedPrescriptionsList={paginatedPrescriptionsList}
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
              filterOption={filterOption}
              setFilterOption={setFilterOption}
              filterCount={filterCount}
            />
            {showIPEContent && <InProductionEducationFiltering />}
          </>
          {hasMedications && (
            <>
              {!isLoading && (
                <MedicationsListSort
                  value={selectedSortOption}
                  sortRxList={sortRxList}
                />
              )}
              <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
              {renderMedicationsList()}
              {!isLoading && (
                <>
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
                  <BeforeYouDownloadDropdown page={pageType.LIST} />
                </>
              )}
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
        {removeLandingPage && !isLoading && <NeedHelp page={pageType.LIST} />}
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
