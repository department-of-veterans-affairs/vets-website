import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
} from '../../util/helpers';
import {
  generatePdfScaffold,
  updatePageTitle,
  formatName,
} from '../../../shared/util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../../shared/util/constants';
import {
  generateNotesIntro,
  generateProgressNoteContent,
} from '../../util/pdfHelpers/notes';

const ProgressNoteDetails = props => {
  const { record, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
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

  const generateCareNotesPDF = async () => {
    const { title, subject, preface } = generateNotesIntro(
      record,
      record.dateSigned,
    );
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateProgressNoteContent(record) };
    const pdfName = `VA-summaries-and-notes-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Progress note details', runningUnitTest);
  };

  const generateCareNotesTxt = () => {
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
${txtLine}\n\n
Details\n
Location: ${record.location}\n
Signed by: ${record.signedBy}\n
${record.coSignedBy !== EMPTY_FIELD && `Co-signed by: ${record.coSignedBy}`}
Date signed: ${record.dateSigned}\n
${txtLine}\n\n
Note\n
${record.note}`;
    generateTextFile(
      content,
      `VA-summaries-and-notes-details-${getNameDateAndTime(user)}`,
    );
  };

  const download = () => {
    generateCareNotesPDF();
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="progress-note-date"
      >
        {record.name}
      </h1>

      <DateSubheading date={record.dateSigned} id="progress-note-date" />

      <div className="no-print">
        <PrintDownload
          download={download}
          downloadTxt={generateCareNotesTxt}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>

      <div className="test-details-container max-80">
        <h2>Details</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Location
        </h3>
        <p data-testid="progress-location">{record.location}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Signed by
        </h3>
        <p data-testid="note-record-signed-by">{record.signedBy}</p>
        {record.coSignedBy !== EMPTY_FIELD && (
          <>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans">
              Co-signed by
            </h3>
            <p data-testid="note-record-cosigned-by">{record.coSignedBy}</p>
          </>
        )}
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date signed
        </h3>
        <p data-testid="progress-signed-date">{record.dateSigned}</p>
      </div>

      <div className="test-results-container">
        <h2>Note</h2>
        <p data-testid="note-record">{record.note}</p>
      </div>
    </div>
  );
};

export default ProgressNoteDetails;

ProgressNoteDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
