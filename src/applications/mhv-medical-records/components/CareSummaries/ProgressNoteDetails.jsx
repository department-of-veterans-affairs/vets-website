import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
  formatNameFirstLast,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import { generateTextFile } from '../../util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateNotesIntro,
  generateProgressNoteContent,
} from '../../util/pdfHelpers/notes';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';

const ProgressNoteDetails = props => {
  const { record, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
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
    const { title, subject, subtitles } = generateNotesIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateProgressNoteContent(record),
    };
    const pdfName = `VA-summaries-and-notes-${getNameDateAndTime(user)}`;
    makePdf(
      pdfName,
      pdfData,
      'medicalRecords',
      'Medical Records - Progress note details - PDF generation error',
      runningUnitTest,
    );
  };

  const generateCareNotesTxt = () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
${txtLine}\n\n
Details\n
Date entered: ${record.date}\n
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
    <div
      className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5"
      data-dd-privacy="mask"
    >
      <PrintHeader />
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby="progress-note-date"
        data-testid="progress-note-name"
        data-dd-privacy="mask"
        data-dd-action-name="[progress note - name]"
      >
        <DateSubheading
          date={record.date}
          id="progress-note-date"
          label="Date entered"
        />

        {downloadStarted && <DownloadSuccessAlert />}

        <div className="test-details-container max-80">
          <HeaderSection header="Details">
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
          </HeaderSection>
        </div>
        <div className="test-results-container">
          <LabelValue
            label="Note"
            value={record.note}
            headerClass="test-results-header"
            testId="note-record"
            actionName="[progress note - summary Note]"
            monospace
          />
        </div>
      </HeaderSection>
      <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
      <DownloadingRecordsInfo description="CS&N Detail" />
      <PrintDownload
        description="CS&N Detail"
        downloadPdf={generateCareNotesPDF}
        downloadTxt={generateCareNotesTxt}
      />
      <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
    </div>
  );
};

export default ProgressNoteDetails;

ProgressNoteDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
