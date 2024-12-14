import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  generatePdfScaffold,
  formatName,
} from '@department-of-veterans-affairs/mhv/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { add, compareAsc } from 'date-fns';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';
import ExternalLink from '../components/shared/ExternalLink';
import MissingRecordsError from '../components/DownloadRecords/MissingRecordsError';
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
import { genAndDownloadCCD } from '../actions/downloads';
import DownloadSuccessAlert from '../components/shared/DownloadSuccessAlert';
import { Actions } from '../util/actionTypes';

const DownloadReportPage = ({ runningUnitTest }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  const name = formatName(user.userFullName);
  const dob = formatDateLong(user.dob);

  const fullState = useSelector(state => state);
  const generatingCCD = useSelector(state => state.mr.downloads.generatingCCD);
  const ccdError = useSelector(state => state.mr.downloads.error);
  const userName = useSelector(state => state.user.profile.userFullName);
  const successfulDownload = useSelector(
    state => state.mr.downloads.downloadSuccess,
  );

  const activityJournal = useSelector(
    state => state.mr.selfEntered.activityJournal,
  );
  const allergies = useSelector(state => state.mr.selfEntered.allergies);
  const demographics = useSelector(state => state.mr.selfEntered.demographics);
  const familyHistory = useSelector(
    state => state.mr.selfEntered.familyHistory,
  );
  const foodJournal = useSelector(state => state.mr.selfEntered.foodJournal);
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

  const failedDomains = useSelector(state => state.mr.blueButton.failedDomains);

  const [selfEnteredInfoRequested, setSelfEnteredInfoRequested] = useState(
    false,
  );

  /** Map from the list of failed domains to UI display names */
  const domainDisplayMap = {
    labsAndTests: 'Lab and test results',
    notes: 'Care summaries and notes',
    vaccines: 'Vaccines',
    allergies: 'Allergies and reactions',
    conditions: 'Health conditions',
    vitals: 'Vitals',
    radiology: 'Radiology results',
    medications: 'Medications',
    appointments: 'VA appointments',
    demographics: 'VA demographics records',
    militaryService: 'DOD military service',
    patient: 'Account summary',
  };

  const getFailedDomainList = (failed, displayMap) => {
    const modFailed = [...failed];
    if (modFailed.includes('allergies') && !modFailed.includes('medications')) {
      modFailed.push('medications');
    }
    return modFailed.map(domain => displayMap[domain]);
  };

  useEffect(
    () => {
      return () => {
        dispatch({ type: Actions.Downloads.BB_CLEAR_ALERT });
      };
    },
    [dispatch],
  );

  const generatePdf = useCallback(
    async () => {
      setSelfEnteredInfoRequested(true);
      dispatch(clearAlerts());
      const allDefd = allAreDefined([
        activityJournal,
        allergies,
        demographics,
        familyHistory,
        foodJournal,
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

  const CCDRetryTimestamp = useMemo(
    () => {
      const errorTimestamp = localStorage.getItem('lastCCDError');

      if (errorTimestamp !== null) {
        const retryDate = add(new Date(errorTimestamp), { hours: 24 });
        if (compareAsc(retryDate, new Date()) >= 0) {
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short', // Include the time zone abbreviation
          };
          return new Intl.DateTimeFormat('en-US', options).format(retryDate);
        }
      }
      return null;
    },
    [ccdError],
  );

  return (
    <div>
      <h1>Download your medical records reports</h1>
      <p className="vads-u-margin--0">
        Download your VA medical records as a single report (called your VA Blue
        Button® report). Or find other reports to download.
      </p>
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--4 vads-u-margin-top--1 vads-u-margin-bottom--3">
        <p className="vads-u-margin--0">
          Records in these reports last updated at 1:47 p.m. [time zone] on June
          23, 2024
        </p>
      </div>

      {successfulDownload === true && (
        <>
          <MissingRecordsError
            recordTypes={getFailedDomainList(failedDomains, domainDisplayMap)}
          />

          <DownloadSuccessAlert className="vads-u-margin-bottom--1" />
        </>
      )}

      <h2>Download your VA Blue Button report</h2>
      <p className="vads-u-margin--0 vads-u-margin-bottom--1">
        First, select the types of records you want in your report. Then
        download.
      </p>
      <va-link-action
        href="/my-health/medical-records/download/date-range"
        label="Select records and download"
        text="Select records and download"
        data-testid="go-to-download-all"
      />
      <h2>Other reports you can download</h2>
      {CCDRetryTimestamp ? (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
          setFocus
        >
          <h2 slot="headline">
            We can’t download your Continuity of Care Document right now
          </h2>
          <p>
            We’re sorry. There’s a problem with our system.{' '}
            <strong>
              Try again after 24 hours ({CCDRetryTimestamp}
              ).
            </strong>
          </p>
          <p className="vads-u-margin-bottom--0">
            If it still doesn’t work, call us at{' '}
            <va-telephone contact="8773270022" /> (
            <va-telephone tty contact="711" />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </va-alert>
      ) : (
        <></>
      )}
      <va-accordion bordered>
        <va-accordion-item
          bordered="true"
          header="Continuity of Care Document (VA Health Summary)"
          data-testid="ccdAccordionItem"
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
          {generatingCCD ? (
            <div id="generating-ccd-indicator">
              <va-loading-indicator
                label="Loading"
                message="Preparing your download..."
              />
            </div>
          ) : (
            <button
              className="link-button"
              onClick={() =>
                dispatch(genAndDownloadCCD(userName.first, userName.last))
              }
              data-testid="generateCcdButton"
            >
              <va-icon icon="file_download" size={3} /> Download .xml file
            </button>
          )}
        </va-accordion-item>
        <va-accordion-item
          bordered="true"
          header="Self-entered health information"
          data-testid="selfEnteredAccordionItem"
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
          <button
            className="link-button"
            onClick={generatePdf}
            data-testid="downloadSelfEnteredButton"
          >
            <va-icon icon="file_download" size={3} /> Download PDF
          </button>
          <p>
            <strong>Note:</strong> Self-entered My Goals are no longer available
            on My HealtheVet and not included in this report. To download your
            historical goals you can go to the previous version of My
            HealtheVet.
          </p>

          <ExternalLink
            href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'va-blue-button')}
            text="Go to the previous version of MyHealtheVet to download historical
            goals"
          />
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
