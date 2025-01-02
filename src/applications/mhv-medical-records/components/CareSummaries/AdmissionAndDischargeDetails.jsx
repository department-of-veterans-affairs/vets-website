import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  usePrintTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  updatePageTitle,
  generatePdfScaffold,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
} from '../../util/helpers';
import { pageTitles, dischargeSummarySortFields } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateNotesIntro,
  generateDischargeSummaryContent,
} from '../../util/pdfHelpers/notes';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import Section from '../shared/Section';
import LabelValue from '../shared/LabelValue';

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

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
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
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
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

      <Section
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby="admission-discharge-date"
        data-testid="admission-discharge-name"
        data-dd-privacy="mask"
        data-dd-action-name="[admission discharge summary - name]"
      >
        {displayHeaderDate(record)}

        <p className="vads-u-margin-bottom--0">
          Review a summary of your stay at a hospital or other health facility
          (called an admission and discharge summary).
        </p>

        {downloadStarted && <DownloadSuccessAlert />}
        <PrintDownload
          description="CS&N Detail"
          downloadPdf={generateCareNotesPDF}
          downloadTxt={generateCareNotesTxt}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo
          description="CS&N Detail"
          allowTxtDownloads={allowTxtDownloads}
        />

        <div className="test-details-container max-80">
          <Section header="Details">
            <LabelValue
              label="Location"
              value={record.location}
              testId="note-record-location"
              actionName="[admission discharge summary - location]"
            />
            {record.sortByField !== dischargeSummarySortFields.ADMISSION_DATE &&
              record.sortByField !== null && (
                <LabelValue
                  label="Date admitted"
                  value={record.admissionDate}
                  testId="note-admission-date"
                  actionName="[admission discharge summary - admission date]"
                />
              )}
            {record.sortByField !==
              dischargeSummarySortFields.DISCHARGE_DATE && (
              <LabelValue
                label="Date discharged"
                value={record.dischargeDate}
                testId="note-discharge-date"
                actionName="[admission discharge summary - discharge date]"
              />
            )}
            <LabelValue
              label="Discharged by"
              value={record.dischargedBy}
              testId="note-discharged-by"
              actionName="[admission discharge summary - discharged by]"
            />
          </Section>
        </div>

        <div className="test-results-container">
          <LabelValue
            label="Summary"
            value={record.summary}
            headerClass="test-results-header"
            testId="note-summary"
            actionName="[admission discharge summary - Summary]"
            monospace
          />
        </div>
      </Section>
    </div>
  );
};

export default AdmissionAndDischargeDetails;

AdmissionAndDischargeDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
