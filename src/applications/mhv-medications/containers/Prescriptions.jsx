import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';
import {
  usePrintTitle,
  updatePageTitle,
  reportGeneratedBy,
} from '@department-of-veterans-affairs/mhv/exports';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  getPrescriptionsPaginatedSortedList,
  getPaginatedFilteredList,
  getAllergiesList,
} from '../actions/prescriptions';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
  getErrorTypeFromFormat,
} from '../util/helpers';
import { Actions } from '../util/actionTypes';
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
  selectFilterFlag,
  selectGroupingFlag,
  selectRefillContentFlag,
  selectRefillProgressFlag,
  selectRemoveLandingPageFlag,
  selectIPEContentFlag,
} from '../util/selectors';
import PrescriptionsPrintOnly from './PrescriptionsPrintOnly';
import { getPrescriptionSortedList } from '../api/rxApi';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import CernerFacilityAlert from '../components/shared/CernerFacilityAlert';
import { dataDogActionNames, pageType } from '../util/dataDogConstants';
import MedicationsListFilter from '../components/MedicationsList/MedicationsListFilter';
import RefillAlert from '../components/shared/RefillAlert';
import NeedHelp from '../components/shared/NeedHelp';
import InProductionEducationFiltering from '../components/MedicationsList/InProductionEducationFiltering';

const Prescriptions = () => {
  const { search } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const paginatedPrescriptionsList = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const filteredList = useSelector(
    state => state.rx.prescriptions?.prescriptionsFilteredList,
  );
  const allergies = useSelector(state => state.rx.allergies.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions?.selectedSortOption,
  );
  const prescriptionsApiError = useSelector(
    state => state.rx.prescriptions?.apiError,
  );
  const showRefillContent = useSelector(selectRefillContentFlag);
  const showAllergiesContent = useSelector(selectAllergiesFlag);
  // **Remove sort funtions and logic once filter feature is developed and live.**
  const showFilterContent = useSelector(selectFilterFlag);
  const showGroupingContent = useSelector(selectGroupingFlag);
  const showRefillProgressContent = useSelector(selectRefillProgressFlag);
  const removeLandingPage = useSelector(selectRemoveLandingPageFlag);
  const showIPEContent = useSelector(selectIPEContentFlag);
  const pagination = useSelector(
    showFilterContent
      ? state => state.rx.prescriptions?.prescriptionsFilteredPagination
      : state => state.rx.prescriptions?.prescriptionsPagination,
  );
  const prescriptionId = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails?.prescriptionId,
  );
  const filterCount = useSelector(state => state.rx.prescriptions?.filterCount);
  const [prescriptionsFullList, setPrescriptionsFullList] = useState([]);
  const [printedList, setPrintedList] = useState([]);
  const [hasFullListDownloadError, setHasFullListDownloadError] = useState(
    false,
  );
  const [isRetrievingFullList, setIsRetrievingFullList] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isLoading, setLoading] = useState();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sortingInProgress, setSortingInProgress] = useState(false);
  const [filterOption, setFilterOption] = useState(
    sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
      ALL_MEDICATIONS_FILTER_KEY,
  );
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });
  const scrollLocation = useRef();
  const page = useMemo(() => {
    const query = new URLSearchParams(search);
    return Number(query.get('page'));
  }, [search]);

  const updateLoadingStatus = (newIsLoading, newLoadingMessage) => {
    setLoading(newIsLoading);
    setLoadingMessage(newLoadingMessage);
  };

  const updateFilterAndSort = (newFilterOption, newSortOption) => {
    const sortOption =
      newSortOption || selectedSortOption || defaultSelectedSortOption;
    const sortBy = rxListSortingOptions[sortOption].API_ENDPOINT;
    const filterBy = newFilterOption ?? filterOption;
    const isFiltering = newFilterOption !== null;
    updateLoadingStatus(
      true,
      `${isFiltering ? 'Filtering' : 'Sorting'} your medications...`,
    );
    dispatch(
      getPaginatedFilteredList(
        1,
        filterOptions[filterBy]?.url,
        sortBy,
        showGroupingContent ? 10 : 20,
      ),
    ).then(() => {
      updateLoadingStatus(false, '');
      focusElement(document.getElementById('showingRx'));
    });

    history.replace('/?page=1');
    if (isFiltering) {
      sessionStorage.setItem(SESSION_SELECTED_FILTER_OPTION, newFilterOption);
    }
  };

  const updateSortOption = sortOption => {
    dispatch({
      type: Actions.Prescriptions.UPDATE_SORT_OPTION,
      payload: sortOption,
    });
  };

  const sortRxList = sortOption => {
    setPdfTxtGenerateStatus({
      ...pdfTxtGenerateStatus,
      status: PDF_TXT_GENERATE_STATUS.NotStarted,
    });
    if (sortOption !== selectedSortOption && sortOption !== '') {
      updateSortOption(sortOption);
      if (!showFilterContent) {
        updateLoadingStatus(true, 'Sorting your medications...');
        setSortingInProgress(true);
      } else {
        updateFilterAndSort(null, sortOption);
      }
      sessionStorage.setItem(SESSION_SELECTED_SORT_OPTION, sortOption);
    }
  };

  const printRxList = () =>
    setTimeout(() => {
      window.print();
      setPrintedList(
        showFilterContent ? filteredList : paginatedPrescriptionsList,
      );
    }, 1);

  const goToPrevious = () => {
    scrollLocation?.current?.scrollIntoView();
  };

  useEffect(() => {
    if (!isLoading) {
      if (prescriptionId) {
        goToPrevious();
      } else {
        focusElement(document.querySelector('h1'));
      }
    }
  }, []);

  useEffect(() => {
    if (
      !isLoading &&
      filteredList?.length === 0 &&
      filterCount &&
      Object.values(filterCount).some(value => value !== 0)
    ) {
      focusElement(document.getElementById('no-matches-msg'));
    }
  }, [filteredList, isLoading, filterCount]);

  useEffect(() => {
    if (sortingInProgress && !isLoading) {
      focusElement(document.getElementById('showingRx'));
      setSortingInProgress(false);
    }
  }, [sortingInProgress, isLoading]);

  useEffect(
    () => {
      if (!paginatedPrescriptionsList && !showFilterContent) {
        updateLoadingStatus(true, 'Loading your medications...');
      }
      if (Number.isNaN(page) || page < 1) {
        history.replace(
          `/?page=${sessionStorage.getItem(SESSION_SELECTED_PAGE_NUMBER) || 1}`,
        );
        return;
      }
      if (!showFilterContent) {
        const sortOption = selectedSortOption ?? defaultSelectedSortOption;
        dispatch(
          getPrescriptionsPaginatedSortedList(
            page ?? 1,
            rxListSortingOptions[sortOption].API_ENDPOINT,
            showGroupingContent ? 10 : 20,
          ),
        ).then(() => updateLoadingStatus(false, ''));
        if (!selectedSortOption) updateSortOption(sortOption);
      }

      if (!allergies) dispatch(getAllergiesList());
      updatePageTitle('Medications | Veterans Affairs');
      sessionStorage.setItem(SESSION_SELECTED_PAGE_NUMBER, page);
    },
    // disabled warning: paginatedPrescriptionsList must be left of out dependency array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, page, selectedSortOption],
  );

  useEffect(() => {
    if (
      showFilterContent
        ? filteredList?.length
        : paginatedPrescriptionsList?.length
    ) {
      setPrintedList(
        showFilterContent ? filteredList : paginatedPrescriptionsList,
      );
    }
  }, [paginatedPrescriptionsList, filteredList, showFilterContent]);

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, updatePageTitle);

  useEffect(() => {
    if (!showFilterContent) {
      if (
        !isLoading &&
        (!paginatedPrescriptionsList || paginatedPrescriptionsList?.length <= 0)
      ) {
        setAlertVisible(true);
      } else if (isAlertVisible) {
        setAlertVisible(false);
      }
    }
  }, [isLoading, paginatedPrescriptionsList, isAlertVisible]);

  useEffect(() => {
    if (!filterOption) {
      sessionStorage.setItem(
        SESSION_SELECTED_FILTER_OPTION,
        ALL_MEDICATIONS_FILTER_KEY,
      );
    }
  }, []);

  useEffect(() => {
    if (showFilterContent && page) {
      const storedPageNumber = sessionStorage.getItem(
        SESSION_SELECTED_PAGE_NUMBER,
      );
      const storedFilterOption =
        sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
        ALL_MEDICATIONS_FILTER_KEY;
      const sortOption = selectedSortOption ?? defaultSelectedSortOption;
      const sortEndpoint = rxListSortingOptions[sortOption].API_ENDPOINT;
      updateLoadingStatus(true, 'Loading your medications...');
      dispatch(
        getPaginatedFilteredList(
          storedPageNumber,
          filterOptions[storedFilterOption]?.url,
          sortEndpoint,
          showGroupingContent ? 10 : 20,
        ),
      ).then(() => updateLoadingStatus(false, ''));
    }
  }, [dispatch, page, showFilterContent]);

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
            preface: `Showing ${rxList?.length}${
              showFilterContent ? selectedFilterOption : ''
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
                    value: `Showing ${allergiesList.length} records from newest to oldest`,
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
        `Showing ${prescriptionsFullList?.length}${
          showFilterContent ? selectedFilterOption : ''
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

  useEffect(() => {
    if (
      !prescriptionsFullList?.length &&
      pdfTxtGenerateStatus.format !== PRINT_FORMAT.PRINT &&
      pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress &&
      isRetrievingFullList
    ) {
      const getFullList = async () => {
        setIsRetrievingFullList(false);
        await getPrescriptionSortedList(
          rxListSortingOptions[selectedSortOption].API_ENDPOINT,
          false,
        )
          .then(response => {
            const list = response.data.map(rx => ({ ...rx.attributes }));
            setPrescriptionsFullList(list);
            setHasFullListDownloadError(false);
          })
          .catch(() => {
            setHasFullListDownloadError(true);
            updateLoadingStatus(false, '');
          });
        if (!allergies) dispatch(getAllergiesList());
      };
      getFullList();
    }
    if (
      ((prescriptionsFullList?.length &&
        pdfTxtGenerateStatus.format !== PRINT_FORMAT.PRINT) ||
        (pdfTxtGenerateStatus.format === PRINT_FORMAT.PRINT &&
          (showFilterContent
            ? filteredList?.length
            : paginatedPrescriptionsList?.length))) &&
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
            if (showFilterContent) {
              listForPrint = filteredList;
            } else {
              listForPrint = paginatedPrescriptionsList;
            }
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
  }, [
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
  ]);

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
    }
    setPdfTxtGenerateStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
    });
    if (!allergies) await dispatch(getAllergiesList());
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
  const content = () => {
    return (
      <div className="landing-page no-print">
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
              Mail, you can also call your servicing center and ask them to
              update your records.
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
        {prescriptionsApiError ? (
          <>
            <ApiErrorNotification errorType="access" content="medications" />
            <CernerFacilityAlert />
          </>
        ) : (
          <>
            <CernerFacilityAlert />
            {showRefillProgressContent && (
              <RefillAlert
                dataDogActionName={
                  dataDogActionNames.medicationsListPage.REFILL_ALERT_LINK
                }
              />
            )}
            {(!showFilterContent && paginatedPrescriptionsList?.length === 0) ||
            (showFilterContent &&
              filteredList?.length === 0 &&
              filterCount &&
              Object.values(filterCount).every(value => value === 0)) ? (
              <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color">
                <h2
                  className="vads-u-margin--0"
                  data-testid="empty-medList-alert"
                >
                  You don’t have any VA prescriptions or medication records
                </h2>
                <p className="vads-u-margin-y--3">
                  If you need a prescription or you want to tell us about a
                  medication you’re taking, tell your care team at your next
                  appointment.
                </p>
              </div>
            ) : (
              <>
                {showRefillContent && (
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
                          dataDogActionNames.medicationsListPage
                            .START_REFILL_REQUEST
                        }
                      >
                        Start a refill request
                      </Link>
                    </div>
                  </va-card>
                )}
                <Alert
                  isAlertVisible={isAlertVisible}
                  paginatedPrescriptionsList={paginatedPrescriptionsList}
                  ssoe={ssoe}
                />
                {isShowingErrorNotification && (
                  <div className="vads-u-margin-y--3">
                    <ApiErrorNotification
                      errorType={getErrorTypeFromFormat(
                        pdfTxtGenerateStatus.format,
                      )}
                      content="records"
                    >
                      <div>
                        If it still doesn’t work, call us at{' '}
                        <va-telephone contact="8773270022" /> (
                        <va-telephone contact={CONTACTS[711]} tty />
                        ). We’re here Monday through Friday, 8:00 a.m. to 8:00
                        p.m. ET.
                      </div>
                    </ApiErrorNotification>
                  </div>
                )}
                <div
                  className={`landing-page-content vads-u-margin-top--${contentMarginTop}
                    mobile-lg:vads-u-margin-top--${contentMarginTop}`}
                >
                  {showFilterContent && (
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
                  )}
                  {paginatedPrescriptionsList?.length ||
                  filteredList?.length ? (
                    <>
                      {!showFilterContent && (
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
                      {(!showFilterContent || !isLoading) && (
                        <MedicationsListSort
                          value={selectedSortOption}
                          sortRxList={sortRxList}
                        />
                      )}
                      <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
                      {isLoading ? (
                        <div className="vads-u-height--viewport vads-u-padding-top--3">
                          <va-loading-indicator
                            message={loadingMessage}
                            setFocus
                            data-testid="loading-indicator"
                          />
                        </div>
                      ) : (
                        <MedicationsList
                          pagination={pagination}
                          rxList={
                            showFilterContent
                              ? filteredList
                              : paginatedPrescriptionsList
                          }
                          scrollLocation={scrollLocation}
                          selectedSortOption={selectedSortOption}
                          updateLoadingStatus={updateLoadingStatus}
                        />
                      )}
                      {showFilterContent && !isLoading && (
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
                      {removeLandingPage && <NeedHelp page={pageType.LIST} />}
                    </>
                  ) : (
                    <>
                      {!showFilterContent && (
                        <div className="vads-u-padding-y--3">
                          <va-loading-indicator
                            message={loadingMessage}
                            setFocus
                            data-testid="loading-indicator"
                          />
                        </div>
                      )}
                    </>
                  )}
                  {showFilterContent && (
                    <>
                      {!isLoading &&
                        filteredList?.length === 0 &&
                        filterCount &&
                        Object.values(filterCount).some(
                          value => value !== 0,
                        ) && (
                          <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color vads-u-margin-top--3">
                            <h3
                              className="vads-u-margin--0"
                              id="no-matches-msg"
                              data-testid="zero-filter-results"
                            >
                              We didn’t find any matches for this filter
                            </h3>
                            <p className="vads-u-margin-y--2">
                              Try selecting a different filter.
                            </p>
                          </div>
                        )}
                      {isLoading &&
                        (!filteredList || filteredList?.length === 0) && (
                          <div className="vads-u-height--viewport vads-u-padding-top--3">
                            <va-loading-indicator
                              message={`${loadingMessage}`}
                              setFocus
                              data-testid="loading-indicator"
                            />
                          </div>
                        )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
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
