import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  updatePageTitle,
  generatePdfScaffold,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
  formatNameFirstLast,
  useAcceleratedData,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isBefore, isAfter } from 'date-fns';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { selectHoldTimeMessagingUpdate } from '../../util/selectors';
import NeedHelpSection from './NeedHelpSection';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import {
  generateTextFile,
  focusOnErrorField,
  getLastUpdatedText,
  sendDataDogAction,
  getFailedDomainList,
  sendDatadogError,
} from '../../util/helpers';
import { getTxtContent } from '../../util/txtHelpers/blueButton';
import { getBlueButtonReportData } from '../../actions/blueButtonReport';
import { generateBlueButtonData } from '../../util/pdfHelpers/blueButton';

import { addAlert, clearAlerts } from '../../actions/alerts';
import {
  ALERT_TYPE_BB_ERROR,
  BB_DOMAIN_DISPLAY_MAP,
  pageTitles,
  refreshExtractTypes,
  statsdFrontEndActions,
} from '../../util/constants';
import { Actions } from '../../util/actionTypes';
import useFocusOutline from '../../hooks/useFocusOutline';
import { updateReportFileType } from '../../actions/downloads';
import { postCreateAAL, postRecordDatadogAction } from '../../api/MrApi';
import TrackedSpinner from '../shared/TrackedSpinner';

const DownloadFileType = props => {
  const { runningUnitTest = false } = props;
  const history = useHistory();
  const [fileType, setFileType] = useState('');
  const [fileTypeError, setFileTypeError] = useState('');

  const dispatch = useDispatch();
  const { isAcceleratingVaccines, isLoading } = useAcceleratedData();

  const fileTypeFilter = useSelector(
    state => state.mr.downloads?.fileTypeFilter,
  );

  const user = useSelector(state => state.user.profile);
  const name = formatNameFirstLast(user.userFullName);
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
  const holdTimeMessagingUpdate = useSelector(selectHoldTimeMessagingUpdate);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { fromDate, toDate, option: dateFilterOption } = dateFilter;

  const progressBarRef = useRef(null);
  const noRecordsFoundRef = useRef(null);

  useFocusOutline(progressBarRef);
  useFocusOutline(noRecordsFoundRef);

  useEffect(
    () => {
      if (fileTypeFilter) {
        setFileType(fileTypeFilter);
      }
    },
    [fileTypeFilter],
  );

  useEffect(
    () => {
      setTimeout(() => {
        const noRecords = noRecordsFoundRef.current;
        const heading = progressBarRef?.current?.shadowRoot?.querySelector(
          'h2',
        );
        if (noRecordsFoundRef.current) {
          focusElement(noRecords);
        } else {
          focusElement(heading);
        }
      }, 400);
      updatePageTitle(pageTitles.DOWNLOAD_FORMS_PAGES_TITLE);
    },
    [noRecordsFoundRef, progressBarRef],
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
        isAcceleratingVaccines,
      };

      if (!isLoading && !isDataFetched) {
        dispatch(getBlueButtonReportData(options, dateFilter));
      }
    },
    [
      isDataFetched,
      recordFilter,
      dispatch,
      dateFilter,
      isAcceleratingVaccines,
      isLoading,
    ],
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

  const formatDateRange = useCallback(
    () => {
      return {
        fromDate:
          fromDate && fromDate !== 'any' ? formatDateLong(fromDate) : 'any',
        toDate: fromDate && fromDate !== 'any' ? formatDateLong(toDate) : 'any',
      };
    },
    [fromDate, toDate],
  );

  const logAal = status => {
    postCreateAAL({
      activityType: 'Download',
      action: 'Custom Download Requested',
      performerType: 'Self',
      status,
      oncePerSession: true,
    });
  };

  const generatePdf = useCallback(
    async () => {
      if (isGenerating) return; // Prevent double-clicks
      setIsGenerating(true);
      try {
        setDownloadStarted(true);
        dispatch(clearAlerts());

        if (isDataFetched) {
          const title = 'Blue Button report';
          const subject = 'VA Medical Record';
          const scaffold = generatePdfScaffold(user, title, subject);
          const pdfName = `VA-Blue-Button-report-${getNameDateAndTime(user)}`;
          const pdfData = {
            ...formatDateRange(),
            recordSets: generateBlueButtonData(
              recordData,
              recordFilter,
              holdTimeMessagingUpdate,
            ),
            failedDomains: getFailedDomainList(
              failedDomains,
              BB_DOMAIN_DISPLAY_MAP,
            ),
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
            'blueButtonReport',
            'Medical Records - Blue Button report - PDF generation error',
            runningUnitTest,
          );
          logAal(1);
          dispatch({ type: Actions.Downloads.BB_SUCCESS });
        }
      } catch (error) {
        logAal(0);
        sendDatadogError(error, 'Blue Button report - download_report_pdf');
        dispatch(addAlert(ALERT_TYPE_BB_ERROR, error));
      } finally {
        setIsGenerating(false);
      }
    },
    [
      isGenerating,
      dispatch,
      isDataFetched,
      user,
      formatDateRange,
      recordData,
      recordFilter,
      holdTimeMessagingUpdate,
      failedDomains,
      name,
      dob,
      refreshStatus,
      runningUnitTest,
    ],
  );

  const generateTxt = useCallback(
    async () => {
      if (isGenerating) return; // Prevent double-clicks
      setIsGenerating(true);
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
          const dateRange = formatDateRange();
          const failedDomainsList = getFailedDomainList(
            failedDomains,
            BB_DOMAIN_DISPLAY_MAP,
          );
          const content = getTxtContent(
            recordData,
            user,
            dateRange,
            failedDomainsList,
            holdTimeMessagingUpdate,
          );

          generateTextFile(content, pdfName, user);
          logAal(1);
          dispatch({ type: Actions.Downloads.BB_SUCCESS });
        }
      } catch (error) {
        logAal(0);
        sendDatadogError(error, 'Blue Button report - download_report_txt');
        dispatch(addAlert(ALERT_TYPE_BB_ERROR, error));
      } finally {
        setIsGenerating(false);
      }
    },
    [
      isGenerating,
      dispatch,
      failedDomains,
      formatDateRange,
      holdTimeMessagingUpdate,
      isDataFetched,
      recordData,
      user,
    ],
  );

  const checkFileTypeValidity = useCallback(
    () => {
      const isValid = !!fileType;
      setFileTypeError(isValid ? '' : 'Please select a file type');
      return isValid;
    },
    [fileType],
  );

  const selectFileTypeHandler = e => {
    checkFileTypeValidity();
    if (e?.detail?.value) setFileTypeError(null);
  };

  const handleBack = () => {
    history.push('/download/record-type');
    sendDataDogAction('File type - Back - Record type');
  };

  const handleSubmit = e => {
    e.preventDefault();
    selectFileTypeHandler();
    focusOnErrorField();
    if (fileType === 'pdf') {
      generatePdf().then(() => history.push('/download'));
    } else if (fileType === 'txt') {
      generateTxt().then(() => history.push('/download'));
    }
    postRecordDatadogAction(statsdFrontEndActions.DOWNLOAD_BLUE_BUTTON);
    sendDataDogAction('Download report');
  };

  const handleValueChange = e => {
    const { value } = e.detail;
    setFileType(value);
    // Immediately update Redux when a radio button is selected
    dispatch(updateReportFileType(value));
    const typeText = value === 'pdf' ? 'PDF' : 'Text file';
    sendDataDogAction(`${typeText} - File type`);
    selectFileTypeHandler(e);
  };

  return (
    <div>
      <h1>Select records and download report</h1>
      <div style={{ margin: '1.9rem 0' }}>
        <va-segmented-progress-bar
          current={3}
          heading-text="Select file type"
          total={3}
          header-level={2}
          ref={progressBarRef}
        />
      </div>
      <h2>Select file type</h2>
      {!isDataFetched && (
        <div className="vads-u-padding-bottom--2">
          <TrackedSpinner
            id="download-records-spinner"
            message="Loading your records..."
          />
        </div>
      )}
      {isDataFetched &&
        recordCount === 0 && (
          <div className="vads-u-padding-bottom--2">
            <va-alert data-testid="no-records-alert" status="error">
              <h2 slot="headline" id="no-records-found" ref={noRecordsFoundRef}>
                No records found
              </h2>
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
          <form onSubmit={e => handleSubmit(e)}>
            <fieldset>
              <legend
                className="vads-u-display--block vads-u-width--full vads-u-font-size--source-sans-normalized vads-u-font-weight--normal vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light"
                data-testid="record-count"
              >
                You’re downloading <strong>{recordCount} total records</strong>
              </legend>

              <VaRadio
                label="If you use assistive technology, a text file may work better for you."
                onVaValueChange={handleValueChange}
                error={fileTypeError}
              >
                <va-radio-option
                  label="PDF"
                  value="pdf"
                  name="file-type"
                  checked={fileType === 'pdf'}
                />
                <va-radio-option
                  label="Text file"
                  value="txt"
                  name="file-type"
                  checked={fileType === 'txt'}
                />
              </VaRadio>
              {downloadStarted && <DownloadSuccessAlert />}
              <div className="vads-u-margin-top--1">
                <DownloadingRecordsInfo description="Blue Button Report" />
              </div>
            </fieldset>

            <div className="medium-screen:vads-u-display--flex medium-screen:vads-u-flex-direction--row vads-u-align-items--center">
              <button
                type="button"
                className="usa-button-secondary vads-u-margin-y--0p5"
                onClick={handleBack}
              >
                <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
                  <va-icon icon="navigate_far_before" size={2} />
                  <span className="vads-u-margin-left--0p5">Back</span>
                </div>
              </button>
              <button
                type="submit"
                className="vads-u-margin-y--0p5 vads-u-width--auto"
                data-testid="download-report-button"
                disabled={isGenerating}
                aria-disabled={isGenerating || undefined}
                aria-busy={isGenerating || undefined}
              >
                Download report
              </button>
            </div>
          </form>
        )}
      <NeedHelpSection />
    </div>
  );
};

export default DownloadFileType;

DownloadFileType.propTypes = {
  runningUnitTest: PropTypes.bool,
};
