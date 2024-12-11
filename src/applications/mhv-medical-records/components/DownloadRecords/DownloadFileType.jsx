import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  generatePdfScaffold,
  formatName,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isBefore, isAfter } from 'date-fns';
import NeedHelpSection from './NeedHelpSection';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import {
  getNameDateAndTime,
  makePdf,
  generateTextFile,
} from '../../util/helpers';
import { getTxtContent } from '../../util/txtHelpers/blueButton';
import { getBlueButtonReportData } from '../../actions/blueButtonReport';
import { generateBlueButtonData } from '../../util/pdfHelpers/blueButton';
import { clearAlerts } from '../../actions/alerts';

const DownloadFileType = props => {
  const { runningUnitTest = false } = props;
  const history = useHistory();
  const [fileType, setFileType] = useState('');

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);
  const name = formatName(user.userFullName);
  const dob = formatDateLong(user.dob);
  const [blueButtonRequested, setBlueButtonRequested] = useState(false);
  const [downloadType, setDownloadType] = useState('');

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

  const recordFilter = useSelector(state => state.mr.downloads?.recordFilter);
  const dateFilter = useSelector(state => state.mr.downloads?.dateFilter);

  const [downloadStarted, setDownloadStarted] = useState(false);

  const allAreDefined = arrayOfArrays => {
    return arrayOfArrays.every(
      data =>
        (typeof data === 'object' && Object.keys(data)?.length) ||
        (typeof data === 'string' && data?.length) ||
        (Array.isArray(data) && !!data?.length),
    );
  };

  useEffect(() => {
    if (!dateFilter) {
      history.push('/download/date-range');
    } else if (!recordFilter) {
      history.push('/download/record-type');
    }
  });

  const [filterFromDate, filterToDate] = useMemo(
    () => {
      return dateFilter ? dateFilter.split('<->') : [null, null];
    },
    [dateFilter],
  );

  const filterByDate = recDate => {
    return (
      isBefore(new Date(filterFromDate), new Date(recDate)) &&
      isAfter(new Date(filterToDate), new Date(recDate))
    );
  };

  const recordData = useMemo(() => {
    if (
      !allAreDefined([
        labsAndTests,
        notes,
        vaccines,
        allergies,
        conditions,
        vitals,
      ])
    ) {
      dispatch(getBlueButtonReportData());
    } else {
      return {
        labsAndTests: recordFilter?.includes('labTests')
          ? labsAndTests.filter(rec => filterByDate(rec.sortDate))
          : null,
        notes: recordFilter?.includes('careSummaries')
          ? notes.filter(rec => filterByDate(rec.sortByDate))
          : null,
        vaccines: recordFilter?.includes('vaccines')
          ? vaccines.filter(rec => filterByDate(rec.date))
          : null,
        allergies:
          recordFilter?.includes('allergies') ||
          recordFilter?.includes('medications')
            ? allergies
            : null,
        conditions: recordFilter?.includes('conditions') ? conditions : null,
        vitals: recordFilter?.includes('vitals')
          ? vitals.filter(rec => filterByDate(rec.date))
          : null,
        medications: recordFilter?.includes('medications')
          ? medications.filter(rec => filterByDate(rec.lastFilledOn))
          : null,
        appointments:
          recordFilter?.includes('upcomingAppts') ||
          recordFilter?.includes('pastAppts')
            ? appointments.filter(
                rec =>
                  filterByDate(rec.date) &&
                  ((recordFilter.includes('upcomingAppts') && rec.isUpcoming) ||
                    (recordFilter.includes('pastAppts') && !rec.isUpcoming)),
              )
            : null,
        demographics: recordFilter?.includes('demographics')
          ? demographics
          : null,
        militaryService: recordFilter?.includes('militaryService')
          ? militaryService
          : null,
        accountSummary,
      };
    }
    return {};
  });

  const recordCount = useMemo(() => {
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
  });

  const generatePdf = useCallback(
    async () => {
      setDownloadStarted(true);
      setDownloadType('pdf');
      setBlueButtonRequested(true);
      dispatch(clearAlerts());
      const allDefd = allAreDefined([
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
      ]);
      if (!allDefd) {
        dispatch(getBlueButtonReportData());
      } else {
        setBlueButtonRequested(false);
        const title = 'Blue Button report';
        const subject = 'VA Medical Record';
        const scaffold = generatePdfScaffold(user, title, subject);
        const pdfName = `VA-Blue-Button-report-${getNameDateAndTime(user)}`;
        const pdfData = {
          recordSets: generateBlueButtonData(recordData),
          ...scaffold,
          name,
          dob,
        };
        makePdf(pdfName, pdfData, title, runningUnitTest, 'blueButtonReport');
      }
    },
    [
      accountSummary,
      allergies,
      appointments,
      conditions,
      demographics,
      dispatch,
      dob,
      labsAndTests,
      medications,
      militaryService,
      name,
      notes,
      user,
      vaccines,
      vitals,
    ],
  );

  /**
   *  Generate text function
   */
  const generateTxt = useCallback(
    async () => {
      setDownloadStarted(true);
      setDownloadType('txt');
      setBlueButtonRequested(true);
      dispatch(clearAlerts());
      if (
        !allAreDefined([
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
        ])
      ) {
        dispatch(getBlueButtonReportData());
      } else {
        setBlueButtonRequested(false);
        const title = 'Blue Button report';
        const subject = 'VA Medical Record';
        const pdfName = `VA-Blue-Button-report-${getNameDateAndTime(
          user,
          title,
          subject,
        )}`;
        const content = getTxtContent(recordData, user);

        generateTextFile(content, pdfName, user);
      }
    },
    [
      accountSummary,
      allergies,
      appointments,
      conditions,
      demographics,
      dispatch,
      dob,
      labsAndTests,
      medications,
      militaryService,
      name,
      notes,
      user,
      vaccines,
      vitals,
    ],
  );

  useEffect(
    () => {
      if (
        allAreDefined([
          labsAndTests,
          notes,
          vaccines,
          allergies,
          conditions,
          vitals,
        ]) &&
        blueButtonRequested
      ) {
        if (downloadType === 'pdf') {
          generatePdf();
        } else {
          generateTxt();
        }
      }
    },
    [
      labsAndTests,
      notes,
      vaccines,
      allergies,
      conditions,
      vitals,
      generatePdf,
      generateTxt,
      downloadType,
      blueButtonRequested,
    ],
  );

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
      <div className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <p>
          You’re downloading <strong>{recordCount} total records</strong>
        </p>
      </div>
      <VaRadio
        label="If you use assistive technology, a text file may work better for you."
        onVaValueChange={e => setFileType(e.detail.value)}
      >
        <va-radio-option label="PDF" value="pdf" />
        <va-radio-option label="Text file" value="txt" />
      </VaRadio>
      {downloadStarted && <DownloadSuccessAlert />}
      <div className="vads-u-margin-top--1">
        <DownloadingRecordsInfo />
      </div>
      <div className="medium-screen:vads-u-display--flex medium-screen:vads-u-flex-direction--row vads-u-align-items--center">
        <button
          className="usa-button-secondary vads-u-margin-y--0p5"
          onClick={() => history.push('/download/record-type')}
        >
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
            <va-icon icon="navigate_far_before" size={2} />
            <span className="vads-u-margin-left--0p5">Back</span>
          </div>
        </button>
        <button
          className="vads-u-margin-y--0p5"
          onClick={() => {
            if (fileType === 'pdf') {
              generatePdf().then(() => history.push('/download'));
            } else if (fileType === 'txt') {
              generateTxt().then(() => history.push('/download'));
            }
          }}
        >
          Download report
        </button>
      </div>
      <NeedHelpSection />
    </div>
  );
};

export default DownloadFileType;

DownloadFileType.propTypes = {
  runningUnitTest: PropTypes.bool,
};
