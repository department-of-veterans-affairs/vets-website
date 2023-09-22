import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPrescriptionsList,
  setSortedRxList,
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

const Prescriptions = () => {
  const currentDate = new Date();
  const dispatch = useDispatch();
  const prescriptions = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const defaultSortOption = rxListSortingOptions[0].ACTIVE.value;
  const [pdfList, setPdfList] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [isAlertVisible, setAlertVisible] = useState('false');
  const [isLoading, setLoading] = useState(true);

  const topAlert = () => {
    return (
      <div
        visible={isAlertVisible}
        className="vads-l-col--12 medium-screen:vads-l-col--9 no-print"
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
        return {
          header: rx.prescriptionName,
          items: [
            {
              title: 'Prescription number',
              value: rx.prescriptionNumber,
              inline: true,
            },
            {
              title: 'Status',
              value: rx.refillStatus,
              inline: true,
            },
            {
              title: 'Refills left',
              value: rx.refillRemaining,
              inline: true,
            },
            {
              title: 'Quantity',
              value: rx.quantity,
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Prescription expires on',
              value: dateFormat(rx.expirationDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Facility',
              value: rx.facilityName,
              inline: true,
            },
            {
              title: 'Phone number',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Category',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Source',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Image',
              value: 'not in vets api data',
              inline: true,
            },
          ],
        };
      });
    },
    [prescriptions],
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
      dispatch(getPrescriptionsList()).then(() => setLoading(false));
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
        setPdfList(buildPrescriptionPDFList());
      }
    },
    [buildPrescriptionPDFList, prescriptions],
  );

  const pdfData = {
    headerLeft: userName.first
      ? `${userName.last}, ${userName.first}`
      : `${userName.last}`,
    headerRight: `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}`,
    footerLeft: `Report generated by My HealtheVet and VA on ${dateFormat(
      currentDate,
      'MMMM D, YYYY',
    )}`,
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    title: 'Medications',
    preface:
      'This is a list of your current prescriptions, allergies, and adverse reactions.',
    results: {
      header: '',
      items: pdfList,
    },
  };

  const handleDownloadPDF = () => {
    generateMedicationsPDF('medicalRecords', 'rx_list', pdfData);
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
            className="vads-u-margin-top--1 vads-u-margin-bottom--3"
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
