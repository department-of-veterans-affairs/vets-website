import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  txtLine,
  usePrintTitle,
  makePdf,
  getNameDateAndTime,
  formatNameFirstLast,
  formatUserDob,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import { generateTextFile } from '../../util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

import {
  generateLabsIntro,
  generatePathologyContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';

const PathologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [record],
  );

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generatePathologyPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generatePathologyContent(record),
    };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    try {
      await makePdf(
        pdfName,
        pdfData,
        'medicalRecords',
        'Medical Records - Pathology details - PDF generation error',
        runningUnitTest,
      );
    } catch {
      // makePdf handles error logging to Datadog/Sentry
    }
  };

  const generatePathologyTxt = async () => {
    setDownloadStarted(true);
    const content = `
${crisisLineHeader}\n\n    
${record.name} \n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
Details about this test: \n
${txtLine} \n
Date and time collected: ${record.dateCollected}\n
Site or sample tested: ${record.sampleFrom}\n
Location: ${record.labLocation} \n
Date completed: ${record.date} \n
Results: \n
'Your provider will review your results. If you need to do anything, 
your provider will contact you. If you have questions, 
send a message to the care team that ordered this test.\n
'Note: If you have questions about more than 1 test ordered by the same care team, 
send 1 message with all of your questions.\n
${record.results} \n`;

    const fileName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby="pathology-date"
        data-testid="pathology-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - pathology name]"
      >
        <DateSubheading
          date={record.dateCollected}
          id="pathology-date"
          label="Date and time collected"
          labelClass="vads-font-weight-regular"
        />

        {downloadStarted && <DownloadSuccessAlert />}

        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              label="Site or sample tested"
              value={record.sampleFrom}
              testId="pathology-sample-tested"
              actionName="[lab and tests - pathology site]"
            />
            <LabelValue
              label="Location"
              value={record.labLocation}
              testId="pathology-location"
              actionName="[lab and tests - pathology location]"
            />
            <LabelValue
              label="Date completed"
              value={record.date}
              testId="date-completed"
              actionName="[lab and tests - pathology date]"
            />
          </HeaderSection>
        </div>
        <div className="test-results-container">
          <HeaderSection header="Results" className="test-results-header">
            <InfoAlert fullState={fullState} />
            <p
              data-testid="pathology-report"
              className="monospace"
              data-dd-privacy="mask"
              data-dd-action-name="[lab and tests - pathology results]"
            >
              {record.results}
            </p>
          </HeaderSection>
        </div>
        <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
        <DownloadingRecordsInfo description="L&TR Detail" />
        <PrintDownload
          description="L&TR Detail"
          downloadPdf={generatePathologyPdf}
          downloadTxt={generatePathologyTxt}
        />
        <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
      </HeaderSection>
    </div>
  );
};

export default PathologyDetails;

PathologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
