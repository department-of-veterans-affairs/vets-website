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
import InfoAlert from '../shared/InfoAlert';
import { generateTextFile } from '../../util/helpers';

import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

import {
  generateLabsIntro,
  generateMicrobioContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';

const MicroDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, [record]);

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateMicrobiologyPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateMicrobioContent(record),
    };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    try {
      await makePdf(
        pdfName,
        pdfData,
        'medicalRecords',
        'Medical Records - Microbiology details - PDF generation error',
        runningUnitTest,
      );
    } catch {
      // makePdf handles error logging to Datadog/Sentry
    }
  };

  const generateMicroTxt = async () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
Date: ${record.date}\n
${txtLine}\n\n
Details about this test\n
${
  record.name !== 'Microbiology' && record.labType
    ? `Lab type: ${record.labType}\n`
    : ''
}
Site or sample tested: ${record.sampleTested}\n
Collection sample: ${record.sampleFrom}\n
Ordered by: ${record.orderedBy}\n
Location: ${record.collectingLocation}\n
Date completed: ${record.dateCompleted}\n
${txtLine}\n\
Results\n\
Your provider will review your results. If you need to do anything, your provider will contact you. If you have questions, send a message to the care team that ordered this test.\n
${record.results}`;

    generateTextFile(
      content,
      `VA-labs-and-tests-details-${getNameDateAndTime(user)}`,
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby="microbio-date"
        data-testid="microbio-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - microbio name]"
      >
        <DateSubheading
          date={record.date}
          id="microbio-date"
          label="Date and time collected"
          labelClass="vads-font-weight-regular"
        />

        {downloadStarted && <DownloadSuccessAlert />}

        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            {record.name !== 'Microbiology' && record.labType && (
              <LabelValue
                label="Lab type"
                value={record.labType}
                testId="microbio-lab-type"
                action-name="[lab and tests - microbio lab type]"
              />
            )}
            <LabelValue
              label="Site or sample tested"
              value={record.sampleTested}
              testId="microbio-sample-tested"
              actionName="[lab and tests - microbio site]"
            />
            <LabelValue
              label="Collection sample"
              value={record.sampleFrom}
              testId="microbio-sample-from"
              actionName="[lab and tests - microbio sample]"
            />
            <LabelValue
              label="Ordered by"
              value={record.orderedBy}
              testId="microbio-ordered-by"
              actionName="[lab and tests - microbio ordered by]"
            />
            <LabelValue
              label="Location"
              value={record.collectingLocation}
              testId="microbio-collecting-location"
              actionName="[lab and tests - microbio location]"
            />
            <LabelValue
              label="Date completed"
              value={record.dateCompleted}
              testId="microbio-date-completed"
              actionName="[lab and tests - microbio date]"
            />
          </HeaderSection>
        </div>

        <div className="test-results-container">
          <HeaderSection header="Results" className="test-results-header">
            <InfoAlert fullState={fullState} />
            <p
              className="vads-u-font-size--base monospace vads-u-line-height--3"
              data-dd-privacy="mask"
              data-dd-action-name="[lab and tests - microbio results]"
            >
              {record.results}
            </p>
          </HeaderSection>
        </div>
        <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
        <DownloadingRecordsInfo description="L&TR Detail" />
        <PrintDownload
          description="L&TR Detail"
          downloadPdf={generateMicrobiologyPdf}
          downloadTxt={generateMicroTxt}
        />
        <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
      </HeaderSection>
    </div>
  );
};

export default MicroDetails;

MicroDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
