import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  usePrintTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  updatePageTitle,
  generatePdfScaffold,
  formatName,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
} from '../../util/helpers';
import { pageTitles, dischargeSummarySortFields } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateNotesIntro,
  generateDischargeSummaryContent,
} from '../../util/pdfHelpers/notes';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { setIsDetails } from '../../actions/isDetails';

const AdmissionAndDischargeDetails = props => {
  const { record, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const [downloadStarted, setDownloadStarted] = useState(false);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(setIsDetails(true));
      return () => {
        dispatch(setIsDetails(false));
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${record.name} - ${pageTitles.CARE_SUMMARIES_AND_NOTES_PAGE_TITLE}`,
      );
    },
    [record],
  );

  usePrintTitle(
    pageTitles.CARE_SUMMARIES_AND_NOTES_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateCareNotesPDF = async () => {
    setDownloadStarted(true);
    const { title, subject, preface } = generateNotesIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateDischargeSummaryContent(record) };
    const pdfName = `VA-summaries-and-notes-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Admission/discharge details', runningUnitTest);
  };

  const generateCareNotesTxt = () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Review a summary of your stay at a hospital or other health facility (called an admission and discharge summary).\n
${txtLine}\n\n
Details\n
Location: ${record.location}\n
Date admitted: ${record.admissionDate}\n
Date discharged: ${record.dischargeDate}\n
Discharged by: ${record.dischargedBy}\n
${txtLine}\n\n
Summary\n
${record.summary}`;

    generateTextFile(
      content,
      `VA-summaries-and-notes-details-${getNameDateAndTime(user)}`,
    );
  };

  const displayHeaderDate = note => {
    let dateLabel = 'Date admitted';
    let displayDate = note.admissionDate;
    if (note.sortByField === dischargeSummarySortFields.DISCHARGE_DATE) {
      dateLabel = 'Date discharged';
      displayDate = note.dischargeDate;
    } else if (note.sortByField === dischargeSummarySortFields.DATE_ENTERED) {
      dateLabel = 'Date entered';
      displayDate = note.dateEntered;
    }
    return (
      <DateSubheading
        date={displayDate}
        label={dateLabel}
        id="admission-discharge-date"
        testId="ds-note-date-heading"
      />
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="admission-discharge-date"
        data-testid="admission-discharge-name"
      >
        {record.name}
      </h1>

      {displayHeaderDate(record)}

      <p className="vads-u-margin-bottom--0">
        Review a summary of your stay at a hospital or other health facility
        (called an admission and discharge summary).
      </p>

      {downloadStarted && <DownloadSuccessAlert />}
      <PrintDownload
        downloadPdf={generateCareNotesPDF}
        downloadTxt={generateCareNotesTxt}
        allowTxtDownloads={allowTxtDownloads}
      />
      <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />

      <div className="test-details-container max-80">
        <h2>Details</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Location
        </h3>
        <p data-testid="note-record-location"> {record.location}</p>
        {record.sortByField !== dischargeSummarySortFields.ADMISSION_DATE &&
          record.sortByField !== null && (
            <>
              <h3 className="vads-u-font-size--base vads-u-font-family--sans">
                Date admitted
              </h3>
              <p data-testid="note-admission-date">{record.admissionDate}</p>
            </>
          )}
        {record.sortByField !== dischargeSummarySortFields.DISCHARGE_DATE && (
          <>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Date discharged
            </h3>
            <p data-testid="note-discharge-date">{record.dischargeDate}</p>
          </>
        )}
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Discharged by
        </h3>
        <p data-testid="note-discharged-by">{record.dischargedBy}</p>
      </div>

      <div className="test-results-container">
        <h2>Summary</h2>
        <p
          data-testid="note-summary"
          style={{ lineHeight: '40px' }}
          className="monospace"
        >
          {record.summary}
        </p>
      </div>
    </div>
  );
};

export default AdmissionAndDischargeDetails;

AdmissionAndDischargeDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
