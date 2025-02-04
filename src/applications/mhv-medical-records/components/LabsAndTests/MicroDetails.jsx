import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  generatePdfScaffold,
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  makePdf,
  formatUserDob,
} from '../../util/helpers';

import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

import {
  generateLabsIntro,
  generateMicrobioContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';

const MicroDetails = props => {
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
    makePdf(pdfName, pdfData, 'Microbiology details', runningUnitTest);
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
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="microbio-date"
        data-testid="microbio-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - microbio name]"
      >
        {record.name}
      </h1>
      <DateSubheading
        date={record.date}
        id="microbio-date"
        label="Date and time collected"
        labelClass="vads-font-weight-regular"
      />

      {downloadStarted && <DownloadSuccessAlert />}
      <PrintDownload
        description="L&TR Detail"
        downloadPdf={generateMicrobiologyPdf}
        allowTxtDownloads={allowTxtDownloads}
        downloadTxt={generateMicroTxt}
      />
      <DownloadingRecordsInfo
        description="L&TR Detail"
        allowTxtDownloads={allowTxtDownloads}
      />

      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        {record.name !== 'Microbiology' &&
          record.labType && (
            <>
              <h3 className="vads-u-font-size--md vads-u-font-family--sans">
                Lab type
              </h3>
              <p
                data-testid="microbio-lab-type"
                data-dd-privacy="mask"
                data-dd-action-name="[lab and tests - microbio lab type]"
              >
                {record.labType}
              </p>
            </>
          )}
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Site or sample tested
        </h3>
        <p
          data-testid="microbio-sample-tested"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - microbio site]"
        >
          {record.sampleTested}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Collection sample
        </h3>
        <p
          data-testid="microbio-sample-from"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - microbio sample]"
        >
          {record.sampleFrom}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Ordered by
        </h3>
        <p
          data-testid="microbio-ordered-by"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - microbio ordered by]"
        >
          {record.orderedBy}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Location
        </h3>
        <p
          data-testid="microbio-collecting-location"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - microbio location]"
        >
          {record.collectingLocation}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Date completed
        </h3>
        <p
          data-testid="microbio-date-completed"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - microbio date]"
        >
          {record.dateCompleted}
        </p>
      </div>

      <div className="test-results-container">
        <h2 className="test-results-header">Results</h2>
        <InfoAlert fullState={fullState} />
        <p
          className="vads-u-font-size--base monospace vads-u-line-height--3"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - microbio results]"
        >
          {record.results}
        </p>{' '}
      </div>
    </div>
  );
};

export default MicroDetails;

MicroDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
