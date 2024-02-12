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
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../../shared/util/constants';
import { EMPTY_FIELD } from '../../util/constants';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
} from '../../../shared/util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateNotesIntro,
  generateDischargeSummaryContent,
} from '../../util/pdfHelpers/notes';

const AdmissionAndDischargeDetails = props => {
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
    const { title, subject, preface } = generateNotesIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateDischargeSummaryContent(record) };
    const pdfName = `VA-summaries-and-notes-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Admission/discharge details', runningUnitTest);
  };

  const generateCareNotesTxt = () => {
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
Discharge date: ${record.dischargeDate}\n
Discharged by: ${record.dischargedBy}\n
${txtLine}\n\n
Summary\n
${record.summary}`;

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
        aria-describedby="admission-discharge-date"
      >
        {record.name}
      </h1>

      {record.admissionDate !== EMPTY_FIELD ? (
        <div>
          <p id="admission-discharge-date">
            Admitted on {record.admissionDate}
          </p>
        </div>
      ) : (
        <DateSubheading
          date={record.admissionDate}
          label="Admission date"
          id="admission-discharge-date"
        />
      )}

      <p className="vads-u-margin-bottom--0">
        Review a summary of your stay at a hospital or other health facility
        (called an admission and discharge summary).
      </p>
      <div className="no-print">
        <PrintDownload
          download={generateCareNotesPDF}
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
        <p data-testid="note-record-location"> {record.location}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Discharge date
        </h3>
        <p data-testid="note-discharge-date">{record.dischargeDate}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Discharged by
        </h3>
        <p data-testid="note-discharged-by">{record.dischargedBy}</p>
      </div>

      <div className="test-results-container">
        <h2>Summary</h2>
        <p data-testid="note-summary">{record.summary}</p>
      </div>
    </div>
  );
};

export default AdmissionAndDischargeDetails;

AdmissionAndDischargeDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
