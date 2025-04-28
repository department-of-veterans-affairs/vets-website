import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';
import {
  usePrintTitle,
  updatePageTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  getPaginatedFilteredList,
  getAllergiesList,
} from '../actions/prescriptions';
import useDocumentGeneration from '../hooks/useDocumentGeneration';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import { getErrorTypeFromFormat } from '../util/helpers';
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
  const showGroupingContent = useSelector(selectGroupingFlag);
  const showRefillProgressContent = useSelector(selectRefillProgressFlag);
  const removeLandingPage = useSelector(selectRemoveLandingPageFlag);
  const showIPEContent = useSelector(selectIPEContentFlag);
  const pagination = useSelector(
    state => state.rx.prescriptions?.prescriptionsFilteredPagination,
  );
  const prescriptionId = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails?.prescriptionId,
  );
  const filterCount = useSelector(state => state.rx.prescriptions?.filterCount);

  // Use the document generation hook to handle PDF/TXT generation
  const {
    generationStatus: pdfTxtGenerateStatus,
    setGenerationStatus: setPdfTxtGenerateStatus,
    prescriptionsFullList,
    setPrescriptionsFullList,
    printedList,
    setPrintedList,
    isRetrievingFullList,
    setIsRetrievingFullList,
    hasFullListDownloadError,
    setHasFullListDownloadError,
    generatePDF,
    generateTXT,
    printRxList,
    handleFullListDownload,
  } = useDocumentGeneration({
    userName,
    dob,
    selectedSortOption,
    dispatch,
    getAllergiesList,
  });

  const [isAlertVisible] = useState(false);
  const [isLoading, setLoading] = useState();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sortingInProgress, setSortingInProgress] = useState(false);
  const [filterOption, setFilterOption] = useState(
    sessionStorage.getItem(SESSION_SELECTED_FILTER_OPTION) ||
      ALL_MEDICATIONS_FILTER_KEY,
  );
  const scrollLocation = useRef();
  const page = useMemo(
    () => {
      const query = new URLSearchParams(search);
      return Number(query.get('page'));
    },
    [search],
  );

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
      updateFilterAndSort(null, sortOption);
      sessionStorage.setItem(SESSION_SELECTED_SORT_OPTION, sortOption);
    }
  };

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

  useEffect(
    () => {
      if (Number.isNaN(page) || page < 1) {
        history.replace(
          `/?page=${sessionStorage.getItem(SESSION_SELECTED_PAGE_NUMBER) || 1}`,
        );
        return;
      }

      if (!allergies) dispatch(getAllergiesList());
      updatePageTitle('Medications | Veterans Affairs');
      sessionStorage.setItem(SESSION_SELECTED_PAGE_NUMBER, page);
    },
    // disabled warning: paginatedPrescriptionsList must be left of out dependency array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, page, selectedSortOption],
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
      if (!filterOption) {
        sessionStorage.setItem(
          SESSION_SELECTED_FILTER_OPTION,
          ALL_MEDICATIONS_FILTER_KEY,
        );
      }
    },
    [filterOption],
  );

  useEffect(
    () => {
      if (page) {
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
    },
    [dispatch, page],
  );

  useEffect(
    () => {
      if (
        isRetrievingFullList &&
        !prescriptionsFullList?.length &&
        pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress
      ) {
        setHasFullListDownloadError(false);
        updateLoadingStatus(
          true,
          'Retrieving the full list of your medications...',
        );

        getPrescriptionSortedList(
          filterOptions[filterOption]?.url,
          rxListSortingOptions[selectedSortOption].API_ENDPOINT,
        )
          .then(response => {
            const rxs = response?.data?.prescriptions;
            updateLoadingStatus(false, '');
            setIsRetrievingFullList(false);

            if (rxs?.length) {
              setPrescriptionsFullList(rxs);

              // Generate document based on the selected format
              if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.PDF) {
                const pdfList = buildPrescriptionsPDFList(rxs);
                const allergyList = allergies
                  ? buildAllergiesPDFList(allergies)
                  : null;

                generatePDF(pdfList, allergyList);
              } else if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.TXT) {
                const txtList = buildPrescriptionsTXT(rxs);
                const allergyList = allergies
                  ? buildAllergiesTXT(allergies)
                  : null;

                generateTXT(txtList, allergyList);
              } else if (
                pdfTxtGenerateStatus.format === PRINT_FORMAT.PRINT_FULL_LIST
              ) {
                setPrintedList(rxs);
                printRxList();
                setPdfTxtGenerateStatus(prev => ({
                  ...prev,
                  status: PDF_TXT_GENERATE_STATUS.Success,
                }));
              }
            } else {
              setHasFullListDownloadError(true);
              setPdfTxtGenerateStatus(prev => ({
                ...prev,
                status: PDF_TXT_GENERATE_STATUS.Error,
                error: true,
              }));
              updateLoadingStatus(false, '');
            }
          })
          .catch(() => {
            setHasFullListDownloadError(true);
            setPdfTxtGenerateStatus(prev => ({
              ...prev,
              status: PDF_TXT_GENERATE_STATUS.Error,
              error: true,
            }));
            updateLoadingStatus(false, '');
          });
      }
    },
    [
      isRetrievingFullList,
      prescriptionsFullList,
      pdfTxtGenerateStatus,
      filterOption,
      selectedSortOption,
      allergies,
      generatePDF,
      generateTXT,
      printRxList,
      setHasFullListDownloadError,
      updateLoadingStatus,
      setIsRetrievingFullList,
      setPrescriptionsFullList,
      setPdfTxtGenerateStatus,
      setPrintedList,
    ],
  );

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
            {filteredList?.length === 0 &&
            filterCount &&
            Object.values(filterCount).every(value => value === 0) ? (
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
                  {(paginatedPrescriptionsList?.length ||
                    filteredList?.length) && (
                    <>
                      {!isLoading && (
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
                          rxList={filteredList}
                          scrollLocation={scrollLocation}
                          selectedSortOption={selectedSortOption}
                          updateLoadingStatus={updateLoadingStatus}
                        />
                      )}
                      {!isLoading && (
                        <>
                          <PrintDownload
                            onDownload={format => {
                              // Call the handleFullListDownload function from our custom hook
                              handleFullListDownload(format);
                            }}
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
                  <>
                    {!isLoading &&
                      filteredList?.length === 0 &&
                      filterCount &&
                      Object.values(filterCount).some(value => value !== 0) && (
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
                </div>
              </>
            )}
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
