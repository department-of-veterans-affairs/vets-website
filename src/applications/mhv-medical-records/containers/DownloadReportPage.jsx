import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  generatePdfScaffold,
  formatName,
} from '@department-of-veterans-affairs/mhv/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';
import {
  getSelfEnteredAllergies,
  getSelfEnteredVitals,
  getSelfEnteredFamilyHistory,
  getSelfEnteredVaccines,
  getSelfEnteredTestEntries,
  getSelfEnteredMedicalEvents,
  getSelfEnteredMilitaryHistory,
  getSelfEnteredProviders,
  getSelfEnteredHealthInsurance,
  getSelfEnteredTreatmentFacilities,
  getSelfEnteredFoodJournal,
  getSelfEnteredActivityJournal,
  getSelfEnteredMedications,
  getSelfEnteredDemographics,
} from '../actions/selfEnteredData';
import { allAreDefined, getNameDateAndTime, makePdf } from '../util/helpers';
import { clearAlerts } from '../actions/alerts';
import { generateSelfEnteredData } from '../util/pdfHelpers/sei';
import { UNKNOWN } from '../util/constants';

const DownloadReportPage = ({ runningUnitTest }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  const name = formatName(user.userFullName);
  const dob = formatDateLong(user.dob);

  const activityJournal = useSelector(
    state => state.mr.selfEntered.activityJournal,
  );
  const allergies = useSelector(state => state.mr.selfEntered.allergies);
  const demographics = useSelector(state => state.mr.selfEntered.demographics);
  const familyHistory = useSelector(
    state => state.mr.selfEntered.familyHistory,
  );
  const foodJournal = useSelector(state => state.mr.selfEntered.foodJournal);
  // const goals = useSelector(state => state.mr.selfEntered.goals);
  const providers = useSelector(state => state.mr.selfEntered.providers);
  const healthInsurance = useSelector(
    state => state.mr.selfEntered.healthInsurance,
  );
  const testEntries = useSelector(state => state.mr.selfEntered.testEntries);
  const medicalEvents = useSelector(
    state => state.mr.selfEntered.medicalEvents,
  );
  const medications = useSelector(state => state.mr.selfEntered.medications);
  const militaryHistory = useSelector(
    state => state.mr.selfEntered.militaryHistory,
  );
  const treatmentFacilities = useSelector(
    state => state.mr.selfEntered.treatmentFacilities,
  );
  const vaccines = useSelector(state => state.mr.selfEntered.vaccines);
  const vitals = useSelector(state => state.mr.selfEntered.vitals);

  // const errors = useSelector(state => state.mr.selfEntered.errors);

  // const [downloadStarted, setDownloadStarted] = useState(false);
  const [selfEnteredInfoRequested, setSelfEnteredInfoRequested] = useState(
    false,
  );

  const generatePdf = useCallback(
    async () => {
      // setDownloadStarted(true);
      setSelfEnteredInfoRequested(true);
      dispatch(clearAlerts());
      const allDefd = allAreDefined([
        activityJournal,
        allergies,
        demographics,
        familyHistory,
        foodJournal,
        // goals,
        providers,
        healthInsurance,
        testEntries,
        medicalEvents,
        medications,
        militaryHistory,
        treatmentFacilities,
        vaccines,
        vitals,
      ]);
      if (!allDefd) {
        dispatch(getSelfEnteredVitals());
        dispatch(getSelfEnteredAllergies());
        dispatch(getSelfEnteredFamilyHistory());
        dispatch(getSelfEnteredVaccines());
        dispatch(getSelfEnteredTestEntries());
        dispatch(getSelfEnteredMedicalEvents());
        dispatch(getSelfEnteredMilitaryHistory());
        dispatch(getSelfEnteredProviders());
        dispatch(getSelfEnteredHealthInsurance());
        dispatch(getSelfEnteredTreatmentFacilities());
        dispatch(getSelfEnteredFoodJournal());
        dispatch(getSelfEnteredActivityJournal());
        dispatch(getSelfEnteredMedications());
        dispatch(getSelfEnteredDemographics());
      } else {
        setSelfEnteredInfoRequested(false);
        const recordData = {
          activityJournal,
          allergies,
          demographics,
          familyHistory,
          foodJournal,
          // goals,
          providers,
          healthInsurance,
          testEntries,
          medicalEvents,
          medications,
          militaryHistory,
          treatmentFacilities,
          vaccines,
          vitals,
        };
        const title = 'Self-entered information report';
        const subject = 'VA Medical Record';
        const scaffold = generatePdfScaffold(user, title, subject);
        const pdfName = `VA-self-entered-information-report-${getNameDateAndTime(
          user,
        )}`;
        const pdfData = {
          recordSets: generateSelfEnteredData(recordData),
          ...scaffold,
          name,
          dob,
          lastUpdated: UNKNOWN,
        };
        makePdf(pdfName, pdfData, title, runningUnitTest, 'selfEnteredInfo');
      }
    },
    [
      activityJournal,
      allergies,
      demographics,
      familyHistory,
      foodJournal,
      // goals,
      providers,
      healthInsurance,
      testEntries,
      medicalEvents,
      medications,
      militaryHistory,
      treatmentFacilities,
      vaccines,
      vitals,
      dispatch,
    ],
  );

  useEffect(
    () => {
      if (
        allAreDefined([
          activityJournal,
          allergies,
          demographics,
          familyHistory,
          foodJournal,
          // goals,
          providers,
          healthInsurance,
          testEntries,
          medicalEvents,
          medications,
          militaryHistory,
          treatmentFacilities,
          vaccines,
          vitals,
        ]) &&
        selfEnteredInfoRequested
      ) {
        generatePdf();
      }
    },
    [
      activityJournal,
      allergies,
      demographics,
      familyHistory,
      foodJournal,
      // goals,
      providers,
      healthInsurance,
      testEntries,
      medicalEvents,
      medications,
      militaryHistory,
      treatmentFacilities,
      vaccines,
      vitals,
      selfEnteredInfoRequested,
      generatePdf,
    ],
  );

  useEffect(() => {
    generatePdf();
  }, []);

  return (
    <div>
      <h1>Download your medical records reports</h1>
      <p className="vads-u-margin--0">
        Download your VA medical records as a single report (called your VA Blue
        Button® report). Or find other reports to download.
      </p>
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--4 vads-u-margin-top--1">
        <p className="vads-u-margin--0">
          Records in these reports last updated at 1:47 p.m. [time zone] on June
          23, 2024
        </p>
      </div>
      <h2>Download your VA Blue Button report</h2>
      <p className="vads-u-margin--0 vads-u-margin-bottom--1">
        First, select the types of records you want in your report. Then
        download.
      </p>
      <va-link-action
        href="/my-health/medical-records/download/date-range"
        label="Select records and download"
        text="Select records and download"
      />
      <h2>Other reports you can download</h2>
      <va-accordion bordered>
        <va-accordion-item
          bordered="true"
          header="Continuity of care document (VA Health Summary)"
        >
          <p className="vads-u-margin--0">
            This Continuity of Care Document (CCD) is a summary of your VA
            medical records that you can share with non-VA providers in your
            community. It includes your allergies, medications, recent lab
            results, and more.
          </p>
          <p>
            You can download this report in .xml format, a standard file format
            that works with other providers’ medical records systems.
          </p>
          <button className="link-button">
            <va-icon icon="file_download" size={3} /> Download .xml file
          </button>
        </va-accordion-item>
        <va-accordion-item
          bordered="true"
          header="Self-entered health information"
        >
          <p className="vads-u-margin--0">
            This report includes all the health information you entered yourself
            in the previous version of My HealtheVet.
          </p>
          <p>
            Your VA health care team can’t access this self-entered information
            directly. If you want to share this information with your care team,
            print this report and bring it to your next appointment.
          </p>
          <button className="link-button" onClick={generatePdf}>
            <va-icon icon="file_download" size={3} /> Download PDF
          </button>
        </va-accordion-item>
      </va-accordion>
      <p className="vads-u-margin--0 vads-u-margin-top--2">
        <strong>Note:</strong> Blue Button and the Blue Button logo are
        registered service marks owned by the U.S. Department of Health and
        Human Services.
      </p>
      <NeedHelpSection />
    </div>
  );
};

export default DownloadReportPage;

DownloadReportPage.propTypes = {
  runningUnitTest: PropTypes.bool,
};
