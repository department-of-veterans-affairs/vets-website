import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import {
  makePdf,
  getNameDateAndTime,
  generateTextFile,
} from '../../util/helpers';
import {
  updatePageTitle,
  generatePdfScaffold,
  formatName,
} from '../../../shared/util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import { txtLine, crisisLineHeader } from '../../../shared/util/constants';
import {
  generateLabsIntro,
  generatePathologyContent,
} from '../../util/pdfHelpers/labsAndTests';

const PathologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
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
        `${record.name} - ${pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE}`,
      );
    },
    [record],
  );

  const generatePathologyPdf = async () => {
    const { title, subject, preface } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generatePathologyContent(record) };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Pathology details', runningUnitTest);
  };

  const generatePathologyTxt = async () => {
    const content = `
${crisisLineHeader}\n\n    
${record.name} \n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
Details about this test: \n
${txtLine} \n
Sample tested: ${record.sampleTested} \n
Lab location: ${record.labLocation} \n
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
      <DateSubheading date={record.date} id="pathology-date" />

      <div className="no-print">
        <PrintDownload
          download={generatePathologyPdf}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generatePathologyTxt}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Sample tested
        </h3>
        <p data-testid="pathology-sample-tested">{record.sampleTested}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Lab location
        </h3>
        <p data-testid="pathology-location">{record.labLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date completed
        </h3>
        <p data-testid="pathology-date-completed">{record.date}</p>
      </div>
      <div className="test-results-container">
        <h2>Results</h2>
        <InfoAlert fullState={fullState} />
        <p data-testid="pathology-results">{record.results}</p>
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
