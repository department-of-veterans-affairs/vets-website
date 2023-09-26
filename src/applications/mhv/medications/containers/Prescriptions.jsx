import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPrescriptionsList,
  setSortedRxList,
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

const Prescriptions = () => {
  const currentDate = new Date();
  const dispatch = useDispatch();
  const prescriptions = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const allergies = useSelector(state => state.rx.allergies?.allergiesList);
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const defaultSortOption = rxListSortingOptions[0].ACTIVE.value;
  const [prescriptionsPdfList, setPrescriptionsPdfList] = useState([]);
  const [allergiesPdfList, setAllergiesPdfList] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [isAlertVisible, setAlertVisible] = useState('false');
  const [isLoading, setLoading] = useState(true);

  const topAlert = () => {
    return (
      <div
        visible={isAlertVisible}
        className="vads-l-col--12 medium-screen:vads-l-col--9 no-print vads-u-margin-top--4"
      >
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
          <va-alert status="info" background-only>
            <div>
              <p className="vads-u-margin--0">
                You don’t have any medications in your VA medical records.
              </p>
            </div>
          </va-alert>
        )}
        <div className="vads-u-margin-bottom--4" />
      </div>
    );
  };

  const sortRxList = useCallback(
    () => {
      if (sortOption) {
        const newList = [...prescriptions];
        newList.sort(a => {
          return a.refillStatus?.toLowerCase() === sortOption.toLowerCase()
            ? -1
            : 0;
        });
        dispatch(setSortedRxList(newList));
      }
    },
    [dispatch, prescriptions, sortOption],
  );

  const buildPrescriptionPDFList = useCallback(
    () => {
      return prescriptions?.map(rx => {
        // TODO: integrate image when CORS issue is resolved
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
                {
                  title: 'Image of the medication or supply',
                  // TODO: integrate image when CORS issue is resolved
                  // value: !!cmopNdcNumber ? { type: 'image', value: getImageUri(cmopNdcNumber) } : 'Image not available',
                  value: 'Image not available',
                  inline: false,
                },
                // TODO: add when image CORS issue is resolved
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
        dispatch(getPrescriptionsList()),
        dispatch(getAllergiesList()),
      ]).then(() => setLoading(false));
    },
    [dispatch],
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
        medicationsList: prescriptionsPdfList,
      },
      {
        header: 'Allergies',
        medicationsList: allergiesPdfList,
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
          <h1 className="vads-u-margin-top--neg4" data-testid="list-page-title">
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
          <div className="landing-page-content">
            <div className="no-print">
              <PrintDownload download={handleDownloadPDF} list />
              <BeforeYouDownloadDropdown />
              <MedicationsListSort
                setSortOption={setSortOption}
                sortOption={sortOption}
                defaultSortOption={defaultSortOption}
                sortRxList={sortRxList}
              />
              <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
            </div>
            {prescriptions ? (
              <MedicationsList rxList={prescriptions} />
            ) : (
              <MedicationsList rxList={[]} />
            )}
          </div>
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
