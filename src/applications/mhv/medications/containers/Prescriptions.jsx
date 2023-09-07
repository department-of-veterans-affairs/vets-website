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

const Prescriptions = () => {
  const currentDate = new Date();
  const prescriptions = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const defaultSortOption = rxListSortingOptions[0].ACTIVE.value;
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);

  const dispatch = useDispatch();
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
            <h2 slot="headline">No medications found</h2>
            <div>
              <p>
                There are no medications found in your profile. If you believe
                this is incorrect, please refresh the page or call your care
                team if the problem persists.
              </p>
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

  useEffect(() => {
    if (!isLoading && (!prescriptions || prescriptions?.length <= 0)) {
      setAlertVisible('true');
    }
  });

  useEffect(
    () => {
      if (prescriptions) {
        setPdfList(buildPrescriptionPDFList());
      }
    },
    [buildPrescriptionPDFList, prescriptions],
  );

  const pdfData = {
    headerLeft: `${userName.last}, ${userName.first}`,
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
          {topAlert()}
          <h1 className="page-title" data-testid="List-Page-Title">
            Medications
          </h1>
          <div
            className="vads-u-margin-bottom--2 no-print"
            data-testid="Title-Notes"
          >
            Review your prescription medications from VA, and providers outside
            of our network.
          </div>
          <div className="landing-page-content">
            <div className="no-print">
              <PrintDownload download={handleDownloadPDF} list />
              <va-additional-info trigger="What to know about downloading records">
                <ul>
                  <li>
                    <strong>If you’re on a public or shared computer,</strong>{' '}
                    print your records instead of downloading. Downloading will
                    save a copy of your records to the public computer.
                  </li>
                  <li>
                    <strong>If you use assistive technology,</strong> a Text
                    file (.txt) may work better for technology such as screen
                    reader, screen enlargers, or Braille displays.
                  </li>
                </ul>
              </va-additional-info>
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
