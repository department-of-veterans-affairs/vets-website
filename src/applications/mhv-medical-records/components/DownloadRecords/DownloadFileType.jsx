import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  VaLoadingIndicator,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isBefore, isAfter } from 'date-fns';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import NeedHelpSection from './NeedHelpSection';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import {
  getNameDateAndTime,
  makePdf,
  generateTextFile,
  getLastUpdatedText,
  formatUserDob,
  sendDataDogAction,
} from '../../util/helpers';
import { getTxtContent } from '../../util/txtHelpers/blueButton';
import { getBlueButtonReportData } from '../../actions/blueButtonReport';
import { generateBlueButtonData } from '../../util/pdfHelpers/blueButton';

import { addAlert, clearAlerts } from '../../actions/alerts';
import {
  ALERT_TYPE_BB_ERROR,
  pageTitles,
  refreshExtractTypes,
} from '../../util/constants';
import { Actions } from '../../util/actionTypes';

const DownloadFileType = props => {
  const { runningUnitTest = false } = props;
  const history = useHistory();
  const [fileType, setFileType] = useState('');

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  const name = formatName(user.userFullName);
  const dob = formatUserDob(user);

  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const notes = useSelector(
    state => state.mr.careSummariesAndNotes.careSummariesAndNotesList,
  );
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);
  const allergies = useSelector(state => state.mr.allergies.allergiesList);
  const conditions = useSelector(state => state.mr.conditions.conditionsList);
  const vitals = useSelector(state => state.mr.vitals.vitalsList);
  const medications = useSelector(state => state.mr.blueButton.medicationsList);
  const appointments = useSelector(
    state => state.mr.blueButton.appointmentsList,
  );
  const demographics = useSelector(state => state.mr.blueButton.demographics);
  const militaryService = useSelector(
    state => state.mr.blueButton.militaryService,
  );
  const accountSummary = useSelector(
    state => state.mr.blueButton.accountSummary,
  );
  const failedDomains = useSelector(state => state.mr.blueButton.failedDomains);
  const recordFilter = useSelector(state => state.mr.downloads?.recordFilter);
  const dateFilter = useSelector(state => state.mr.downloads?.dateFilter);
  const refreshStatus = useSelector(state => state.mr.refresh.status);

  const [downloadStarted, setDownloadStarted] = useState(false);

  const { fromDate, toDate, option: dateFilterOption } = dateFilter;

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.DOWNLOAD_FORMS_PAGES_TITLE);
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!dateFilterOption) {
        history.push('/download/date-range');
      } else if (!recordFilter) {
        history.push('/download/record-type');
      }
    },
    [dateFilterOption, history, recordFilter],
  );

  const filterByDate = useCallback(
    recDate => {
      if (dateFilterOption === 'any') {
        return true;
      }
      return (
        isBefore(new Date(fromDate), new Date(recDate)) &&
        isAfter(new Date(toDate), new Date(recDate))
      );
    },
    [dateFilterOption, fromDate, toDate],
  );

  /**
   * True if all the records that were specified in the filters have been fetched, otherwise false.
   */
  const isDataFetched = useMemo(
    () => {
      // Map the recordFilter keys to the corresponding data domains
      const dataMap = {
        labTests: labsAndTests,
        careSummaries: notes,
        vaccines,
        allergies,
        conditions,
        vitals,
        medications,
        upcomingAppts: appointments,
        pastAppts: appointments,
        demographics,
        militaryService,
        accountSummary,
      };

      // Map the recordFilter keys to the option list
      const optionsMap = {
        labTests: 'labsAndTests',
        careSummaries: 'notes',
        vaccines: 'vaccines',
        allergies: 'allergies',
        conditions: 'conditions',
        vitals: 'vitals',
        medications: 'medications',
        upcomingAppts: 'appointments',
        pastAppts: 'appointments',
        demographics: 'demographics',
        militaryService: 'militaryService',
        accountSummary: 'patient',
      };

      // Check if all domains in the recordFilter were fetched or failed
      return recordFilter?.every(filter => {
        const optionDomain = optionsMap[filter];
        const isFetched = !!dataMap[filter];
        const hasFailed = failedDomains.includes(optionDomain);
        return isFetched || hasFailed;
      });
    },
    [
      labsAndTests,
      notes,
      vaccines,
      allergies,
      conditions,
      vitals,
      medications,
      appointments,
      demographics,
      militaryService,
      accountSummary,
      failedDomains,
      recordFilter,
    ],
  );

  useEffect(
    () => {
      const options = {
        labsAndTests: recordFilter?.includes('labTests'),
        radiology: recordFilter?.includes('labTests'),
        notes: recordFilter?.includes('careSummaries'),
        vaccines: recordFilter?.includes('vaccines'),
        allergies:
          recordFilter?.includes('allergies') ||
          recordFilter?.includes('medications'),
        conditions: recordFilter?.includes('conditions'),
        vitals: recordFilter?.includes('vitals'),
        medications: recordFilter?.includes('medications'),
        appointments:
          recordFilter?.includes('upcomingAppts') ||
          recordFilter?.includes('pastAppts'),
        demographics: recordFilter?.includes('demographics'),
        militaryService: recordFilter?.includes('militaryService'),
        patient: true,
      };

      if (!isDataFetched) {
        dispatch(getBlueButtonReportData(options, dateFilter));
      }
    },
    [isDataFetched, recordFilter, dispatch, dateFilter],
  );

  const recordData = useMemo(
    () => {
      if (isDataFetched) {
        return {
          labsAndTests:
            labsAndTests && recordFilter?.includes('labTests')
              ? labsAndTests.filter(rec => filterByDate(rec.sortDate))
              : null,
          notes:
            notes && recordFilter?.includes('careSummaries')
              ? notes.filter(rec => filterByDate(rec.sortByDate))
              : null,
          vaccines:
            vaccines && recordFilter?.includes('vaccines')
              ? vaccines.filter(rec => filterByDate(rec.date))
              : null,
          allergies:
            allergies &&
            (recordFilter?.includes('allergies') ||
              recordFilter?.includes('medications'))
              ? allergies
              : null,
          conditions:
            conditions && recordFilter?.includes('conditions')
              ? conditions
              : null,
          vitals:
            vitals && recordFilter?.includes('vitals')
              ? vitals.filter(rec => filterByDate(rec.date))
              : null,
          medications:
            medications && recordFilter?.includes('medications')
              ? medications.filter(rec => filterByDate(rec.lastFilledOn))
              : null,
          appointments: appointments || null,
          demographics:
            demographics && recordFilter?.includes('demographics')
              ? demographics
              : null,
          militaryService:
            militaryService && recordFilter?.includes('militaryService')
              ? militaryService
              : null,
          accountSummary,
        };
      }
      return null;
    },
    [
      filterByDate,
      isDataFetched,
      recordFilter,
      labsAndTests,
      notes,
      vaccines,
      allergies,
      conditions,
      vitals,
      medications,
      appointments,
      demographics,
      militaryService,
      accountSummary,
    ],
  );

  const recordCount = useMemo(
    () => {
      let count = 0;
      count += recordData?.labsAndTests ? recordData?.labsAndTests?.length : 0;
      count += recordData?.notes ? recordData?.notes?.length : 0;
      count += recordData?.vaccines ? recordData?.vaccines?.length : 0;
      count += recordData?.allergies ? recordData?.allergies?.length : 0;
      count += recordData?.conditions ? recordData?.conditions?.length : 0;
      count += recordData?.vitals ? recordData?.vitals?.length : 0;
      count += recordData?.medications ? recordData?.medications?.length : 0;
      count += recordData?.appointments ? recordData?.appointments?.length : 0;
      count += recordData?.demographics ? 1 : 0;
      count += recordData?.militaryService ? 1 : 0;

      return count;
    },
    [recordData],
  );

  const generatePdf = useCallback(
    async () => {
      try {
        setDownloadStarted(true);
        dispatch(clearAlerts());

        if (isDataFetched) {
          const title = 'Blue Button report';
          const subject = 'VA Medical Record';
          const scaffold = generatePdfScaffold(user, title, subject);
          const pdfName = `VA-Blue-Button-report-${getNameDateAndTime(user)}`;
          const pdfData = {
            fromDate:
              fromDate && fromDate !== 'any' ? formatDateLong(fromDate) : 'Any',
            toDate:
              fromDate && fromDate !== 'any' ? formatDateLong(toDate) : 'any',
            recordSets: generateBlueButtonData(recordData, recordFilter),
            ...scaffold,
            name,
            dob,
            lastUpdated: getLastUpdatedText(refreshStatus, [
              refreshExtractTypes.ALLERGY,
              refreshExtractTypes.CHEM_HEM,
              refreshExtractTypes.VPR,
            ]),
          };
          await makePdf(
            pdfName,
            pdfData,
            title,
            runningUnitTest,
            'blueButtonReport',
          );
          dispatch({ type: Actions.Downloads.BB_SUCCESS });
        }
      } catch (error) {
        dispatch(addAlert(ALERT_TYPE_BB_ERROR, error));
      }
    },
    [
      fromDate,
      toDate,
      dispatch,
      dob,
      isDataFetched,
      name,
      recordData,
      recordFilter,
      refreshStatus,
      runningUnitTest,
      user,
    ],
  );

  const generateTxt = useCallback(
    async () => {
      try {
        setDownloadStarted(true);
        dispatch(clearAlerts());
        if (isDataFetched) {
          const title = 'Blue Button report';
          const subject = 'VA Medical Record';
          const pdfName = `VA-Blue-Button-report-${getNameDateAndTime(
            user,
            title,
            subject,
          )}`;
          const content = getTxtContent(recordData, user);

          generateTextFile(content, pdfName, user);
          dispatch({ type: Actions.Downloads.BB_SUCCESS });
        }
      } catch (error) {
        dispatch(addAlert(ALERT_TYPE_BB_ERROR, error));
      }
    },
    [dispatch, isDataFetched, recordData, user],
  );

  const handleDdRum = useCallback(e => {
    const selectedNode = Array.from(e.target.childNodes).find(
      node => node.value === e.detail.value,
    );
    const selectedText = selectedNode ? selectedNode.innerText : '';
    sendDataDogAction(`${selectedText} - File type`);
  }, []);

  return (
    <div>
      <h1>Select records and download report</h1>
      <div style={{ margin: '1.9rem 0' }}>
        <va-segmented-progress-bar
          current={3}
          heading-text="Select file type"
          total={3}
        />
      </div>
      <h2>Select file type</h2>
      {!isDataFetched && (
        <div className="vads-u-padding-bottom--2">
          <VaLoadingIndicator message="Loading your records..." />
        </div>
      )}
      {isDataFetched &&
        recordCount === 0 && (
          <div className="vads-u-padding-bottom--2">
            <va-alert data-testid="no-records-alert" status="error">
              <h2 slot="headline">No records found</h2>
              <p>
                We couldn’t find any records that match your selection. Go back
                and update the date range or select more record types.
              </p>
              <p>
                <Link to="/download/date-range">Go back to update report</Link>
              </p>
            </va-alert>
          </div>
        )}
      {isDataFetched &&
        recordCount > 0 && (
          <div>
            <div
              className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light"
              data-testid="record-count"
            >
              <p>
                You’re downloading <strong>{recordCount} total records</strong>
              </p>
            </div>
            <VaRadio
              label="If you use assistive technology, a text file may work better for you."
              onVaValueChange={e => {
                setFileType(e.detail.value);
                handleDdRum(e);
              }}
            >
              <va-radio-option label="PDF" value="pdf" />
              <va-radio-option label="Text file" value="txt" />
            </VaRadio>
            {downloadStarted && <DownloadSuccessAlert />}
            <div className="vads-u-margin-top--1">
              <DownloadingRecordsInfo />
            </div>
          </div>
        )}
      {recordCount > 0 &&
        isDataFetched && (
          <div className="medium-screen:vads-u-display--flex medium-screen:vads-u-flex-direction--row vads-u-align-items--center">
            <button
              className="usa-button-secondary vads-u-margin-y--0p5"
              onClick={() => {
                history.push('/download/record-type');
                sendDataDogAction('File type - Back - Record type');
              }}
            >
              <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
                <va-icon icon="navigate_far_before" size={2} />
                <span className="vads-u-margin-left--0p5">Back</span>
              </div>
            </button>
            <button
              disabled={recordCount === 0 || !isDataFetched}
              className="vads-u-margin-y--0p5"
              data-testid="download-report-button"
              onClick={() => {
                if (fileType === 'pdf') {
                  generatePdf().then(() => history.push('/download'));
                } else if (fileType === 'txt') {
                  generateTxt().then(() => history.push('/download'));
                }
                sendDataDogAction('File type - Continue - Record type');
              }}
            >
              Download report
            </button>
          </div>
        )}
      <NeedHelpSection />
    </div>
  );
};

export default DownloadFileType;

DownloadFileType.propTypes = {
  runningUnitTest: PropTypes.bool,
};
