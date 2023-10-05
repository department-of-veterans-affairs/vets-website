import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPrescriptionsList,
  getAllergiesList,
} from '../actions/prescriptions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import { dateFormat, generateMedicationsPDF } from '../util/helpers';
import PrintHeader from './PrintHeader';
import { rxListSortingOptions } from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';

const Prescriptions = () => {
  const currentDate = new Date();
  const dispatch = useDispatch();
  const prescriptions = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const allergies = useSelector(state => state.rx.allergies?.allergiesList);
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const pagination = useSelector(
    state => state.rx.prescriptions?.prescriptionsPagination,
  );
  const defaultSortEndpoint =
    rxListSortingOptions.availableToFillOrRefillFirst.API_ENDPOINT;
  const [sortEndpoint, setSortEndpoint] = useState(defaultSortEndpoint);
  const [prescriptionsPdfList, setPrescriptionsPdfList] = useState([]);
  const [allergiesPdfList, setAllergiesPdfList] = useState([]);
  const [isAlertVisible, setAlertVisible] = useState('false');
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const topAlert = () => {
    return (
      <div visible={isAlertVisible} className="no-print vads-u-margin-top--5">
        {!prescriptions && (
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
        {prescriptions?.length <= 0 && (
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

  const sortRxList = endpoint => {
    setSortEndpoint(endpoint);
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
      dispatch(getPrescriptionsList(currentPage, sortEndpoint)).then(() =>
        setLoading(false),
      );
    },
    [dispatch, currentPage, sortEndpoint],
  );

  useEffect(
    () => {
      if (!allergies) dispatch(getAllergiesList());
    },
    [allergies, dispatch],
  );

  useEffect(
    () => {
      if (!isLoading && (!prescriptions || prescriptions?.length <= 0)) {
        setAlertVisible('true');
      }
    },
    [isLoading, prescriptions],
  );

  useEffect(
    () => {
      if (prescriptions) {
        setPrescriptionsPdfList(buildPrescriptionsPDFList(prescriptions));
      }
    },
    [prescriptions],
  );

  useEffect(
    () => {
      if (allergies) {
        setAllergiesPdfList(buildAllergiesPDFList(allergies));
      }
    },
    [allergies],
  );

  const pdfData = {
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
      currentDate,
      'MMMM D, YYYY',
    )}`,
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    title: 'Medications',
    preface: `This is a list of recent prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.\nNote: This list doesn’t include older prescriptions that have been inactive for more than 6 months.`,
    results: [
      {
        header: 'Medications list',
        preface: `Showing ${
          prescriptionsPdfList?.length
        } medications, available to fill or refill first`,
        list: prescriptionsPdfList,
      },
      {
        header: 'Allergies',
        list: allergiesPdfList,
      },
    ],
  };

  const handleDownloadPDF = () => {
    generateMedicationsPDF(
      'medications',
      `VA-medications-list-${
        userName.first ? `${userName.first}-${userName.last}` : userName.last
      }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
      pdfData,
    );
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
          {prescriptions?.length ? (
            <div className="landing-page-content">
              <div className="no-print">
                <PrintDownload download={handleDownloadPDF} list />
                <BeforeYouDownloadDropdown />
                <MedicationsListSort sortRxList={sortRxList} />
                <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
              </div>
              <MedicationsList
                rxList={prescriptions}
                pagination={pagination}
                setCurrentPage={setCurrentPage}
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
