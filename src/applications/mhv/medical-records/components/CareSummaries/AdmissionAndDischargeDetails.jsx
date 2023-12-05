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
} from '../../../shared/util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

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
    const title = `Admission and discharge summary on ${formatDateLong(
      record.date,
    )}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      header: 'Details',
      items: [
        {
          title: 'Location',
          value: record.location,
          inline: true,
        },
        {
          title: 'Admission date',
          value: record.admissionDate,
          inline: true,
        },
        {
          title: 'Discharge date',
          value: record.dischargeDate,
          inline: true,
        },
        {
          title: 'Admitted by',
          value: record.admittedBy,
          inline: true,
        },
        {
          title: 'Discharged by',
          value: record.dischargedBy,
          inline: true,
        },
      ],
    };
    scaffold.results = {
      header: 'Summary',
      items: [
        {
          items: [
            {
              title: '',
              value: record.summary,
              inline: false,
            },
          ],
        },
      ],
    };

    makePdf(
      'care_summaries_report',
      scaffold,
      'Care Summary details',
      runningUnitTest,
    );
  };

  const generateCareNotesTxt = () => {
    const content = `\n
Admission and discharge summary\n
_____________________________________________________\n\n
Details\n
Location: ${record.location}\n
Admission date: ${record.startDate}\n
Discharge date: ${record.endDate}\n
Admitted by: ${record.admittingPhysician}\n
Discharged by: ${record.dischargePhysician}\n
_____________________________________________________\n\n
Summary\n
${record.summary}`;

    generateTextFile(
      content,
      `VA-care-summaries-and-notes-details-${getNameDateAndTime(user)}`,
    );
  };

  const dates =
    record.admissionDate &&
    record.dischargeDate &&
    `${record.admissionDate} to ${record.dischargeDate}`;

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="admission-discharge-date"
      >
        {record.name}
      </h1>

      <DateSubheading
        date={dates}
        label="Dates"
        id="admission-discharge-date"
      />

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
        <p>{record.location}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Admission date
        </h3>
        <p>{record.admissionDate}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Discharge date
        </h3>
        <p>{record.dischargeDate}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Admitted by
        </h3>
        <p>{record.admittedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Discharged by
        </h3>
        <p>{record.dischargedBy}</p>
      </div>

      <div className="test-results-container">
        <h2>Summary</h2>
        <p>{record.summary}</p>
      </div>
    </div>
  );
};

export default AdmissionAndDischargeDetails;

AdmissionAndDischargeDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
