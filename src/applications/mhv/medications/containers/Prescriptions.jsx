import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import {
  getPrescriptionsPaginatedSortedList,
  getAllergiesList,
  clearAllergiesError,
} from '../actions/prescriptions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import { dateFormat, generateMedicationsPDF } from '../util/helpers';
import PrintHeader from './PrintHeader';
import PrintBottom from './PrintBottom';
import {
  PDF_GENERATE_STATUS,
  rxListSortingOptions,
  SESSION_SELECTED_SORT_OPTION,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import AllergiesErrorModal from '../components/shared/AllergiesErrorModal';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import { getPrescriptionSortedList } from '../api/rxApi';
import Alert from '../components/shared/Alert';
import { updatePageTitle } from '../../shared/util/helpers';

const Prescriptions = props => {
  const { fullList = [] } = props;
  const { page } = useParams();
  const dispatch = useDispatch();
  const paginatedPrescriptionsList = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const [fullPrescriptionsList, setFullPrescriptionsList] = useState(fullList);
  const allergies = useSelector(state => state.rx.allergies.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const pagination = useSelector(
    state => state.rx.prescriptions?.prescriptionsPagination,
  );
  const defaultSortOption = Object.keys(rxListSortingOptions)[0];
  const [selectedSortOption, setSelectedSortOption] = useState(
    sessionStorage.getItem(SESSION_SELECTED_SORT_OPTION) || defaultSortOption,
  );
  const [isAlertVisible, setAlertVisible] = useState('false');
  const [isLoading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(page ?? 1);
  const [pdfGenerateStatus, setPdfGenerateStatus] = useState(
    PDF_GENERATE_STATUS.NotStarted,
  );

  const sortRxList = sortOption => {
    setPdfGenerateStatus(PDF_GENERATE_STATUS.NotStarted);
    setSelectedSortOption(sortOption);
    sessionStorage.setItem(SESSION_SELECTED_SORT_OPTION, sortOption);
    focusElement(document.getElementById('showingRx'));
  };

  useEffect(
    () => {
      updatePageTitle('Medications | Veterans Affairs');
      const newUrl = `/my-health/medications/${currentPage}`;
      window.history.pushState(null, '', newUrl);
    },
    [currentPage],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            {
              url: '/my-health/about-medications',
              label: 'About Medications',
            },
          ],
          {
            url: '/my-health/medications',
            label: 'Medications',
          },
        ),
      );
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!paginatedPrescriptionsList) {
        setLoading(true);
      }
      dispatch(
        getPrescriptionsPaginatedSortedList(
          currentPage,
          rxListSortingOptions[selectedSortOption].API_ENDPOINT,
        ),
      ).then(() => setLoading(false));
    },
    // disabled warning: paginatedPrescriptionsList must be left of out dependency array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, currentPage, selectedSortOption],
  );

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
              'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis line at ',
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
        footerLeft: `Report generated by My HealtheVet and VA on ${dateFormat(
          Date.now(),
          'MMMM D, YYYY',
        )}`,
        footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
        title: 'Medications',
        preface: `This is a list of recent prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.\nNote: This list doesn’t include older prescriptions that have been inactive for more than 6 months.`,
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

  const generatePDF = useCallback(
    (rxList, allergiesList) => {
      generateMedicationsPDF(
        'medications',
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
        pdfData(rxList, allergiesList),
      ).then(() => {
        setPdfGenerateStatus(PDF_GENERATE_STATUS.Success);
      });
    },
    [userName, pdfData, setPdfGenerateStatus],
  );

  useEffect(
    () => {
      if (
        fullPrescriptionsList?.length &&
        allergies &&
        pdfGenerateStatus === PDF_GENERATE_STATUS.InProgress
      ) {
        generatePDF(
          buildPrescriptionsPDFList(fullPrescriptionsList),
          buildAllergiesPDFList(allergies),
        );
      }
    },
    [allergies, fullPrescriptionsList, pdfGenerateStatus, generatePDF],
  );

  const handleDownloadPDF = async () => {
    setPdfGenerateStatus(PDF_GENERATE_STATUS.InProgress);
    await Promise.allSettled([
      getPrescriptionSortedList(
        rxListSortingOptions[selectedSortOption].API_ENDPOINT,
      ).then(response =>
        setFullPrescriptionsList(
          response.data.map(rx => {
            return { ...rx.attributes };
          }),
        ),
      ),
      !allergies && dispatch(getAllergiesList()),
    ]);
  };

  const handleModalClose = () => {
    dispatch(clearAllergiesError());
    setPdfGenerateStatus(PDF_GENERATE_STATUS.NotStarted);
  };

  const handleModalDownloadButton = () => {
    generatePDF(buildPrescriptionsPDFList(fullPrescriptionsList));
    dispatch(clearAllergiesError());
  };
  const content = () => {
    if (!isLoading) {
      return (
        <div className="landing-page">
          <PrintHeader />
          <h1 className="vads-u-margin-top--neg3" data-testid="list-page-title">
            Medications
          </h1>
          <div
            className="vads-u-margin-top--1 vads-u-margin-bottom--neg3 no-print"
            data-testid="Title-Notes"
          >
            Refill and track your VA prescriptions. And review all medications
            in your VA medical records.
          </div>
          <div className="print-only vads-l-col--12 medium-screen:vads-l-col--6">
            <p className="vads-u-margin-y--1">
              <strong>Note:</strong>
              This document may not include all medications in your VA medical
              records. And it doesn’t include a list of your allergies and
              reactions to medications.
            </p>
          </div>
          <Alert
            isAlertVisible={isAlertVisible}
            paginatedPrescriptionsList={paginatedPrescriptionsList}
            ssoe={ssoe}
          />
          <AllergiesErrorModal
            onCloseButtonClick={handleModalClose}
            onDownloadButtonClick={handleModalDownloadButton}
            onCancelButtonClick={handleModalClose}
            visible={Boolean(fullPrescriptionsList?.length && allergiesError)}
          />
          {paginatedPrescriptionsList?.length ? (
            <div className="landing-page-content">
              <div className="no-print">
                <PrintDownload
                  download={handleDownloadPDF}
                  isSuccess={pdfGenerateStatus === PDF_GENERATE_STATUS.Success}
                  list
                />
                <BeforeYouDownloadDropdown />
                <MedicationsListSort
                  value={selectedSortOption}
                  sortRxList={sortRxList}
                />
                <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
              </div>
              <MedicationsList
                rxList={paginatedPrescriptionsList}
                pagination={pagination}
                setCurrentPage={setCurrentPage}
                selectedSortOption={selectedSortOption}
              />
            </div>
          ) : (
            ''
          )}
          <PrintBottom />
        </div>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
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
