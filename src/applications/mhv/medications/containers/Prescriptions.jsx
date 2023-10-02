import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPrescriptionsList,
  getAllergiesList,
} from '../actions/prescriptions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import {
  dateFormat,
  generateMedicationsPDF,
  validateField,
} from '../util/helpers';
import PrintHeader from './PrintHeader';
import {
  rxListSortingOptions,
  pdfStatusDefinitions,
  pdfDefaultStatusDefinition,
} from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { processList } from '../../medical-records/util/helpers';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

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

  const buildPrescriptionPDFList = useCallback(
    () => {
      return prescriptions?.map(rx => {
        // Image (to be added later)
        // const cmopNdcNumber = rx.rxRfRecords.length && rx.rxRfRecords[0][1]?.[0]?.cmopNdcNumber || rx.cmopNdcNumber;
        return {
          header: rx.prescriptionName,
          sections: [
            {
              header: 'About your prescription',
              items: [
                {
                  title: 'Last filled on',
                  value: dateFormat(rx.dispensedDate, 'MMMM D, YYYY'),
                  inline: true,
                },
                {
                  title: 'Status',
                  value: validateField(rx.dispStatus),
                  inline: true,
                },
                {
                  value:
                    pdfStatusDefinitions[rx.refillStatus] ||
                    pdfDefaultStatusDefinition,
                },
                {
                  title: 'Refills left',
                  value: validateField(rx.refillRemaining),
                  inline: true,
                },
                {
                  title: 'Request refills by this prescription expiration date',
                  value: dateFormat(rx.expirationDate, 'MMMM D, YYYY'),
                  inline: true,
                },
                {
                  title: 'Prescription number',
                  value: rx.prescriptionNumber,
                  inline: true,
                },
                {
                  title: 'Prescribed on',
                  value: dateFormat(rx.orderedDate, 'MMMM D, YYYY'),
                  inline: true,
                },
                {
                  title: 'Prescribed by',
                  value:
                    (rx.providerFirstName && rx.providerLastName) ||
                    'None noted',
                  inline: true,
                },
                {
                  title: 'Facility',
                  value: validateField(rx.facilityName),
                  inline: true,
                },
                {
                  title: 'Pharmacy phone number',
                  value: validateField(rx.phoneNumber),
                  inline: true,
                },
              ],
            },
            {
              header: 'About this medication or supply',
              items: [
                {
                  title: 'Instructions',
                  value: validateField(rx.sig),
                  inline: true,
                },
                {
                  title: 'Reason for use',
                  value: validateField(rx.indicationForUse),
                  inline: true,
                },
                {
                  title: 'Quantity',
                  value: validateField(rx.quantity),
                  inline: true,
                },
                // {
                //   title: 'Image of the medication or supply',
                //   value: !!cmopNdcNumber ? { type: 'image', value: getImageUri(cmopNdcNumber) } : 'Image not available',
                //   inline: false,
                // },
                // {
                //   title: 'Note',
                //   value: 'This image is from your last refill of this medication.',
                //   inline: true,
                // }
              ],
            },
          ],
        };
      });
    },
    [prescriptions],
  );

  const buildAllergiesPDFList = useCallback(
    () => {
      return allergies?.map(item => {
        return {
          header: item.name,
          sections: [
            {
              items: [
                {
                  title: 'Reaction',
                  value: processList(item.reaction),
                  inline: true,
                },
                {
                  title: 'Type of allergy',
                  value: validateField(item.type),
                  inline: true,
                },
                {
                  title: 'Date entered',
                  value: validateField(item.date),
                  inline: true,
                },
                {
                  title: 'Location',
                  value: validateField(item.location),
                  inline: true,
                },
                {
                  title: 'Observed or reported',
                  value: validateField(item.observedOrReported),
                  inline: true,
                },
                {
                  title: 'Provider notes',
                  value: validateField(item.notes),
                  inline: !item.notes,
                },
              ],
            },
          ],
        };
      });
    },
    [allergies],
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
      Promise.all([
        dispatch(getPrescriptionsList(currentPage, sortEndpoint)),
        dispatch(getAllergiesList()),
      ]).then(() => setLoading(false));
    },
    [dispatch, currentPage, sortEndpoint],
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
        setPrescriptionsPdfList(buildPrescriptionPDFList());
      }
    },
    [buildPrescriptionPDFList, prescriptions],
  );

  useEffect(
    () => {
      if (allergies) {
        setAllergiesPdfList(buildAllergiesPDFList());
      }
    },
    [buildAllergiesPDFList, allergies],
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
    preface:
      'This is a list of all medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.',
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
      }-${dateFormat(Date.now(), 'MM-DD-YYYY_hmmssa')}`,
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
