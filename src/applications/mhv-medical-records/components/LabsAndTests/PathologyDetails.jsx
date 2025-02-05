import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import {
  makePdf,
  getNameDateAndTime,
  generateTextFile,
  formatNameFirstLast,
  formatUserDob,
} from '../../util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

import {
  generateLabsIntro,
  generatePathologyContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';

const PathologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
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
    makePdf(pdfName, pdfData, 'Pathology details', runningUnitTest);
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
Site or sample tested: ${record.sampleTested} \n
Collection sample: ${record.sampleFrom} \n
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
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="pathology-date"
        data-testid="pathology-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - pathology name]"
      >
        {record.name}
      </h1>
      <DateSubheading
        date={record.dateCollected}
        id="pathology-date"
        label="Date and time collected"
        labelClass="vads-font-weight-regular"
      />

      {downloadStarted && <DownloadSuccessAlert />}
      <PrintDownload
        description="L&TR Detail"
        downloadPdf={generatePathologyPdf}
        allowTxtDownloads={allowTxtDownloads}
        downloadTxt={generatePathologyTxt}
      />
      <DownloadingRecordsInfo
        description="L&TR Detail"
        allowTxtDownloads={allowTxtDownloads}
      />

      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Site or sample tested
        </h3>
        <p
          data-testid="pathology-sample-tested"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - pathology site]"
        >
          {record.sampleTested}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Collection sample
        </h3>
        <p
          data-testid="pathology-sample-tested"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - pathology sample]"
        >
          {record.sampleFrom}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Location
        </h3>
        <p
          data-testid="pathology-location"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - pathology location]"
        >
          {record.labLocation}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Date completed
        </h3>
        <p
          data-testid="date-completed"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - pathology date]"
        >
          {record.date}
        </p>
      </div>
      <div className="test-results-container">
        <h2 className="test-results-header">Results</h2>
        <InfoAlert fullState={fullState} />
        <p
          data-testid="pathology-report"
          className="monospace"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - pathology results]"
        >
          {record.results}
        </p>
      </div>
    </div>
  );
};

export default PathologyDetails;

PathologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
