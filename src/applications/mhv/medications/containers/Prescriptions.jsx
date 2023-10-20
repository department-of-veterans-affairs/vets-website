import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  getPrescriptionsPaginatedSortedList,
  getAllergiesList,
  clearAllergisError,
} from '../actions/prescriptions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import { dateFormat, generateMedicationsPDF } from '../util/helpers';
import PrintHeader from './PrintHeader';
import {
  PDF_GENERATE_STATUS,
  rxListSortingOptions,
  SESSION_SELECTED_SORT_OPTION,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import AllergiesErrorModal from '../components/shared/AllergiesErrorModal';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import { getPrescriptionSortedList } from '../api/rxApi';

const Prescriptions = () => {
  const dispatch = useDispatch();
  const paginatedPrescriptionsList = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const [fullPrescriptionsList, setFullPrescriptionsList] = useState([]);
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
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfGenerateStatus, setPdfGenerateStatus] = useState(
    PDF_GENERATE_STATUS.NotStarted,
  );

  const topAlert = () => {
    return (
      <div visible={isAlertVisible} className="no-print vads-u-margin-top--5">
        {!paginatedPrescriptionsList && (
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible={isAlertVisible}
          >
            <h2 slot="headline">We can’t access your medications right now</h2>
            <div>
              <section className="vads-u-margin-bottom--0">
                <p>
                  We’re sorry. There’s a problem with our system. Check back
                  later.
                </p>
                <p>
                  <strong>If it still doesn’t work,</strong> email us at{' '}
                  <FeedbackEmail />.
                </p>
                <p>
                  <strong>If you need to request a refill now,</strong> call
                  your VA pharmacy. You can find the pharmacy phone number on
                  your prescription label.
                </p>
              </section>
            </div>
          </va-alert>
        )}
        {paginatedPrescriptionsList?.length <= 0 && (
          <va-alert status="info" uswds>
            <div>
              <h4 className="vads-u-margin-top--0">
                You don’t have any medications in your medications list
              </h4>
              <strong>Note</strong>: This list doesn’t include older
              prescriptions that have been inactive for more than{' '}
              <strong>180 days</strong>. To find these older prescriptions, go
              to your VA Blue Button report on the My HealtheVet website.{' '}
              <a href={mhvUrl(ssoe, 'va-blue-button')} rel="noreferrer">
                Go to VA Blue Button&reg; on the My HealtheVet website
              </a>
            </div>
          </va-alert>
        )}
        <div className="vads-u-margin-bottom--4" />
      </div>
    );
  };

  const sortRxList = sortOption => {
    setPdfGenerateStatus(PDF_GENERATE_STATUS.NotStarted);
    setSelectedSortOption(sortOption);
    sessionStorage.setItem(SESSION_SELECTED_SORT_OPTION, sortOption);
    focusElement(document.getElementById('showingRx'));
  };

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
      dispatch(
        getPrescriptionsPaginatedSortedList(
          currentPage,
          rxListSortingOptions[selectedSortOption].API_ENDPOINT,
        ),
      ).then(() => setLoading(false));
    },
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
    dispatch(clearAllergisError());
    setPdfGenerateStatus(PDF_GENERATE_STATUS.NotStarted);
  };

  const handleModalDownloadButton = () => {
    generatePDF(buildPrescriptionsPDFList(fullPrescriptionsList));
    dispatch(clearAllergisError());
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
            className="vads-u-margin-top--1 vads-u-margin-bottom--neg3"
            data-testid="Title-Notes"
          >
            Refill and track your VA prescriptions. And review all medications
            in your VA medical records.
          </div>
          <div className="print-only">
            <p className="vads-u-margin-y--0">
              <strong>Note:</strong> This file doesn’t include:
            </p>
            <ul className="vads-u-margin-y--0">
              <li className="vads-u-margin-y--0">All of your medications</li>
              <li className="vads-u-margin-y--0">
                Your allergies or adverse reactions
              </li>
            </ul>
          </div>
          {topAlert()}
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
