import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  generatePdfScaffold,
  updatePageTitle,
  formatName,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
} from '../../util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateNotesIntro,
  generateProgressNoteContent,
} from '../../util/pdfHelpers/notes';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { setIsDetails } from '../../actions/isDetails';

const ProgressNoteDetails = props => {
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
    const pdfData = { ...scaffold, ...generateProgressNoteContent(record) };
    const pdfName = `VA-summaries-and-notes-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Progress note details', runningUnitTest);
  };

  const generateCareNotesTxt = () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
${txtLine}\n\n
Details\n
Date: ${record.date}\n
Location: ${record.location}\n
Written by: ${record.writtenBy}\n
${record.signedBy !== EMPTY_FIELD && `Signed by: ${record.signedBy}\n`}
Date signed: ${record.dateSigned}\n
${txtLine}\n\n
Note\n
${record.note}`;
    generateTextFile(
      content,
      `VA-summaries-and-notes-details-${getNameDateAndTime(user)}`,
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="progress-note-date"
        data-testid="progress-note-name"
      >
        {record.name}
      </h1>

      <DateSubheading
        date={record.date}
        id="progress-note-date"
        label="Date entered"
      />

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
        <p data-testid="progress-location">{record.location}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Written by
        </h3>
        <p data-testid="note-record-written-by">{record.writtenBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Signed by
        </h3>
        <p data-testid="note-record-signed-by">{record.signedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date signed
        </h3>
        <p data-testid="progress-signed-date">{record.dateSigned}</p>
      </div>

      <div className="test-results-container">
        <h2>Note</h2>
        <p
          data-testid="note-record"
          className="monospace vads-u-line-height--6"
        >
          {record.note}
        </p>
      </div>
    </div>
  );
};

export default ProgressNoteDetails;

ProgressNoteDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
