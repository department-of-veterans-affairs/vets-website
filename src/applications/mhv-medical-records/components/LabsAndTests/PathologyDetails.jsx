import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  generatePdfScaffold,
  formatName,
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
} from '../../util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

import {
  generateLabsIntro,
  generatePathologyContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { useIsDetails } from '../../hooks/useIsDetails';

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

  const dispatch = useDispatch();
  useIsDetails(dispatch);

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${record.name} - ${pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE}`,
      );
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
    const { title, subject, preface } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generatePathologyContent(record) };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Pathology details', runningUnitTest);
  };

  const generatePathologyTxt = async () => {
    setDownloadStarted(true);
    const content = `
${crisisLineHeader}\n\n    
${record.name} \n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
Details about this test: \n
${txtLine} \n
Site or sample tested: ${record.sampleTested} \n
Location: ${record.labLocation} \n
Date completed: ${record.date} \n
Results: \n
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
        downloadPdf={generatePathologyPdf}
        allowTxtDownloads={allowTxtDownloads}
        downloadTxt={generatePathologyTxt}
      />
      <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />

      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Site or sample tested
        </h3>
        <p data-testid="pathology-sample-tested">{record.sampleTested}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Location
        </h3>
        <p data-testid="pathology-location">{record.labLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date completed
        </h3>
        <p data-testid="pathology-lab-comments">{record.date}</p>
      </div>
      <div className="test-results-container">
        <h2>Results</h2>
        <InfoAlert fullState={fullState} />
        <p data-testid="pathology-report" className="monospace">
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
