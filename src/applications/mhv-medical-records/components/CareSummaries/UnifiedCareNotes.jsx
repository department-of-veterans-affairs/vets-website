import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  usePrintTitle,
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  formatNameFirstLast,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import { generateTextFile } from '../../util/helpers';
import {
  EMPTY_FIELD,
  pageTitles,
  dischargeSummarySortFields,
  loincCodes,
} from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateNotesIntro,
  generateDischargeSummaryContent,
  generateProgressNoteContent,
} from '../../util/pdfHelpers/notes';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';

const UnifiedCareNotes = props => {
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

  const isDischargeSummary = record.type === loincCodes.DISCHARGE_SUMMARY;

  const generateCareNotesPDF = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateNotesIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...(isDischargeSummary
        ? generateDischargeSummaryContent(record)
        : generateProgressNoteContent(record)),
    };
    const pdfName = `VA-summaries-and-notes-${getNameDateAndTime(user)}`;
    makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      `Medical Records - ${
        isDischargeSummary
          ? 'Admission/discharge details'
          : 'Progress note details'
      } - PDF generation error`,
      runningUnitTest,
    );
  };

  const generateCareNotesTxt = () => {
    setDownloadStarted(true);
    let content;
    if (isDischargeSummary) {
      content = `\n\n${crisisLineHeader}\n\n${
        record.name
      }\n${formatNameFirstLast(
        user.userFullName,
      )}\nDate of birth: ${formatUserDob(
        user,
      )}\n${reportGeneratedBy}\nReview a summary of your stay at a hospital or other health facility (called an admission and discharge summary).\n${txtLine}\n\nDetails\nDate admitted: ${
        record.admissionDate
      }\nLocation: ${record.location}\nDate discharged: ${
        record.dischargeDate
      }\nDischarged by: ${record.dischargedBy}\n${txtLine}\n\nSummary\n${
        record.summary
      }`;
    } else {
      content = `\n\n${crisisLineHeader}\n\n${
        record.name
      }\n${formatNameFirstLast(
        user.userFullName,
      )}\nDate of birth: ${formatUserDob(
        user,
      )}\n${reportGeneratedBy}\n${txtLine}\n\nDetails\nDate entered: ${
        record.date
      }\nLocation: ${record.location}\nWritten by: ${record.writtenBy}\n${
        record.signedBy !== EMPTY_FIELD ? `Signed by: ${record.signedBy}\n` : ''
      }Date signed: ${record.dateSigned}\n${txtLine}\n\nNote\n${record.note}`;
    }
    generateTextFile(
      content,
      `VA-summaries-and-notes-details-${getNameDateAndTime(user)}`,
    );
  };

  // Helper for header date
  const displayHeaderDate = note => {
    if (!isDischargeSummary) {
      return (
        <DateSubheading
          date={note.date}
          id="progress-note-date"
          label="Date entered"
        />
      );
    }
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
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby={
          isDischargeSummary ? 'admission-discharge-date' : 'progress-note-date'
        }
        data-testid={
          isDischargeSummary ? 'admission-discharge-name' : 'progress-note-name'
        }
        data-dd-privacy="mask"
        data-dd-action-name={
          isDischargeSummary
            ? '[admission discharge summary - name]'
            : '[progress note - name]'
        }
      >
        {displayHeaderDate(record)}
        {isDischargeSummary && (
          <p className="vads-u-margin-bottom--0">
            Review a summary of your stay at a hospital or other health facility
            (called an admission and discharge summary).
          </p>
        )}
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
          <HeaderSection header="Details">
            {isDischargeSummary ? (
              <>
                <LabelValue
                  label="Location"
                  value={record.location}
                  testId="note-record-location"
                  actionName="[admission discharge summary - location]"
                />
                {record.sortByField !==
                  dischargeSummarySortFields.ADMISSION_DATE &&
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
              </>
            ) : (
              <>
                <LabelValue
                  label="Location"
                  value={record.location}
                  testId="progress-location"
                  actionName="[progress note - location]"
                />
                <LabelValue
                  label="Written by"
                  value={record.writtenBy}
                  testId="note-record-written-by"
                  actionName="[progress note - written by]"
                />
                <LabelValue
                  label="Signed by"
                  value={record.signedBy}
                  testId="note-record-signed-by"
                  actionName="[progress note - signed by]"
                />
                <LabelValue
                  label="Date signed"
                  value={record.dateSigned}
                  testId="progress-signed-date"
                  actionName="[progress note - date signed]"
                />
              </>
            )}
          </HeaderSection>
        </div>
        <div className="test-results-container">
          {isDischargeSummary ? (
            <LabelValue
              label="Summary"
              value={record.note} // No separate summary property, only "note"
              headerClass="test-results-header"
              testId="note-summary"
              actionName="[admission discharge summary - Summary]"
              monospace
            />
          ) : (
            <LabelValue
              label="Note"
              value={record.note}
              headerClass="test-results-header"
              testId="note-record"
              actionName="[progress note - summary Note]"
              monospace
            />
          )}
        </div>
      </HeaderSection>
    </div>
  );
};

export default UnifiedCareNotes;

UnifiedCareNotes.propTypes = {
  record: PropTypes.object.isRequired,
  runningUnitTest: PropTypes.bool,
};
