import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import {
  usePrintTitle,
  updatePageTitle,
  reportGeneratedBy,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  getPrescriptionsPaginatedSortedList,
  getAllergiesList,
  clearAllergiesError,
} from '../actions/prescriptions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
} from '../util/helpers';
import { Actions } from '../util/actionTypes';
import {
  PDF_TXT_GENERATE_STATUS,
  rxListSortingOptions,
  SESSION_SELECTED_SORT_OPTION,
  defaultSelectedSortOption,
  medicationsUrls,
} from '../util/constants';
import PrintDownload, {
  DOWNLOAD_FORMAT,
} from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import AllergiesErrorModal from '../components/shared/AllergiesErrorModal';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import { buildPrescriptionsTXT, buildAllergiesTXT } from '../util/txtConfigs';
import Alert from '../components/shared/Alert';
import { selectRefillContentFlag } from '../util/selectors';

const Prescriptions = () => {
  const { search } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const paginatedPrescriptionsList = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const allergies = useSelector(state => state.rx.allergies.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const pagination = useSelector(
    state => state.rx.prescriptions?.prescriptionsPagination,
  );
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions?.selectedSortOption,
  );
  const prescriptionsFullList = useSelector(
    state => state.rx.prescriptions?.prescriptionsFullList,
  );
  const showRefillContent = useSelector(selectRefillContentFlag);
  const [isAlertVisible, setAlertVisible] = useState('false');
  const [isLoading, setLoading] = useState();
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });

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
    if (sortOption !== selectedSortOption) {
      updateSortOption(sortOption);
      updateLoadingStatus(true, 'Sorting your medications...');
    }
    sessionStorage.setItem(SESSION_SELECTED_SORT_OPTION, sortOption);
    focusElement(document.getElementById('showingRx'));
  };

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            {
              url: '/my-health/medications/about',
              label: 'About medications',
            },
          ],
          {
            url: `/my-health/medications/?page=${page}`,
            label: 'Medications',
          },
        ),
      );
    },
    [dispatch, page],
  );

  useEffect(
    () => {
      if (!paginatedPrescriptionsList) {
        updateLoadingStatus(true, 'Loading your medications...');
      }
      if (Number.isNaN(page) || page < 1) {
        history.replace('/?page=1');
        return;
      }
      const sortOption = selectedSortOption ?? defaultSelectedSortOption;
      dispatch(
        getPrescriptionsPaginatedSortedList(
          page ?? 1,
          rxListSortingOptions[sortOption].API_ENDPOINT,
        ),
      ).then(() => updateLoadingStatus(false, ''));
      if (!selectedSortOption) updateSortOption(sortOption);
      updatePageTitle('Medications | Veterans Affairs');
    },
    // disabled warning: paginatedPrescriptionsList must be left of out dependency array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, page, selectedSortOption],
  );

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, dateFormat, updatePageTitle);

  useEffect(
    () => {
      if (
        !isLoading &&
        (!paginatedPrescriptionsList || paginatedPrescriptionsList?.length <= 0)
      ) {
        setAlertVisible('true');
      }
    },
    [isLoading, paginatedPrescriptionsList],
  );

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
              preface:
                'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, email us at vamhvfeedback@va.gov.',
            }),
          },
        ],
      };
    },
    [userName, dob, selectedSortOption],
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
    (rxList, allergiesList) => {
      generateMedicationsPDF(
        'medications',
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
        pdfData(rxList, allergiesList),
      ).then(() => {
        setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
        updateLoadingStatus(false, '');
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
      updateLoadingStatus(false, '');
    },
    [userName, txtData, setPdfTxtGenerateStatus],
  );

  useEffect(
    () => {
      if (
        prescriptionsFullList?.length &&
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
        } else if (pdfTxtGenerateStatus.format === 'print') {
          if (!isLoading && loadingMessage === '') {
            setPdfTxtGenerateStatus({
              status: PDF_TXT_GENERATE_STATUS.NotStarted,
            });
            window.print();
          }
          updateLoadingStatus(false, '');
        }
      } else if (
        prescriptionsFullList?.length &&
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
    ],
  );

  const handleFullListDownload = async format => {
    if (format === DOWNLOAD_FORMAT.PDF || format === DOWNLOAD_FORMAT.TXT) {
      updateLoadingStatus(true, 'Downloading your file...');
    } else if (!allergies)
      updateLoadingStatus(true, 'Downloading your file...');
    setPdfTxtGenerateStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
    });
    if (!allergies) await dispatch(getAllergiesList());
  };

  const handleModalClose = () => {
    dispatch(clearAllergiesError());
    setPdfTxtGenerateStatus({
      ...pdfTxtGenerateStatus,
      status: PDF_TXT_GENERATE_STATUS.NotStarted,
    });
  };

  const handleModalDownloadButton = () => {
    if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.PDF) {
      generatePDF(buildPrescriptionsPDFList(prescriptionsFullList));
    } else if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.TXT) {
      generateTXT(
        buildPrescriptionsTXT(prescriptionsFullList),
        buildAllergiesTXT(),
      );
    } else {
      updateLoadingStatus(false, '');
      setPdfTxtGenerateStatus({
        status: PDF_TXT_GENERATE_STATUS.NotStarted,
      });
      setTimeout(() => window.print(), 1);
    }
    dispatch(clearAllergiesError());
  };

  const content = () => {
    if (!isLoading) {
      return (
        <div className="landing-page no-print">
          <h1 className="vads-u-margin-top--neg3" data-testid="list-page-title">
            Medications
          </h1>
          <div
            className="vads-u-margin-top--1 vads-u-margin-bottom--neg3"
            data-testid="Title-Notes"
          >
            Refill and track your VA prescriptions. And review all medications
            in your VA medical records.
          </div>
          <br />
          <br />
          {showRefillContent && (
            <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color">
              <h2 className="vads-u-margin--0 vads-u-font-size--h3">
                Refill your prescriptions
              </h2>
              <p className="vads-u-margin-y--3">
                Find a list of prescriptions you can refill online.
              </p>
              <a
                className="vads-c-action-link--green vads-u-margin--0"
                href={medicationsUrls.MEDICATIONS_REFILL}
                data-testid="prescriptions-nav-link-to-refill"
              >
                Refill prescriptions
              </a>
            </div>
          )}
          <Alert
            isAlertVisible={isAlertVisible}
            paginatedPrescriptionsList={paginatedPrescriptionsList}
            ssoe={ssoe}
          />
          <AllergiesErrorModal
            onCloseButtonClick={handleModalClose}
            onDownloadButtonClick={handleModalDownloadButton}
            onCancelButtonClick={handleModalClose}
            isPrint={Boolean(pdfTxtGenerateStatus.format === 'print')}
            visible={Boolean(
              prescriptionsFullList?.length &&
                pdfTxtGenerateStatus.status ===
                  PDF_TXT_GENERATE_STATUS.InProgress &&
                allergiesError,
            )}
          />
          {paginatedPrescriptionsList?.length ? (
            <div className="landing-page-content">
              <PrintDownload
                download={handleFullListDownload}
                isSuccess={
                  pdfTxtGenerateStatus.status ===
                  PDF_TXT_GENERATE_STATUS.Success
                }
                list
              />
              <BeforeYouDownloadDropdown />
              <MedicationsListSort
                value={selectedSortOption}
                sortRxList={sortRxList}
              />
              <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
              <MedicationsList
                rxList={paginatedPrescriptionsList}
                pagination={pagination}
                selectedSortOption={selectedSortOption}
                updateLoadingStatus={updateLoadingStatus}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      );
    }
    return (
      <va-loading-indicator
        message={loadingMessage}
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return <div>{content()}</div>;
};

export default Prescriptions;

Prescriptions.propTypes = {
  fullList: PropTypes.any,
};
