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
  generateTextFile,
  getNameDateAndTime,
  makePdf,
} from '../../util/helpers';
import {
  formatName,
  generatePdfScaffold,
  updatePageTitle,
} from '../../../shared/util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '../../../shared/util/constants';
import {
  generateLabsIntro,
  generateMicrobioContent,
} from '../../util/pdfHelpers/labsAndTests';
import usePrintTitle from '../../../shared/hooks/usePrintTitle';

const MicroDetails = props => {
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

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    formatDateLong,
    updatePageTitle,
  );

  const generateMicrobiologyPdf = async () => {
    const { title, subject, preface } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateMicrobioContent(record) };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Microbiology details', runningUnitTest);
  };

  const generateMicroTxt = async () => {
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Date: ${record.date}\n
${txtLine}\n\n
Details about this test\n
Sample tested: ${record.sampleTested}\n
Sample from: ${record.sampleFrom}\n
Ordered by: ${record.orderedBy}\n
Ordering location: ${record.orderingLocation}\n
Collecting location: ${record.collectingLocation}\n
Lab location: ${record.labLocation}\n
Date completed: ${record.date}\n
${txtLine}\n\n
Results\n
${record.results}`;

    generateTextFile(
      content,
      `VA-labs-and-tests-details-${getNameDateAndTime(user)}`,
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--0" aria-describedby="microbio-date">
        {record.name}
      </h1>
      <DateSubheading date={record.date} id="microbio-date" />

      <div className="no-print">
        <PrintDownload
          download={generateMicrobiologyPdf}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generateMicroTxt}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Sample tested
        </h3>
        <p>{record.sampleTested}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Sample from
        </h3>
        <p>{record.sampleFrom}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordered by
        </h3>
        <p>{record.orderedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordering location
        </h3>
        <p>{record.orderingLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Collecting location
        </h3>
        <p>{record.collectingLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Lab location
        </h3>
        <p>{record.labLocation}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date completed
        </h3>
        <p>{record.date}</p>
      </div>

      <div className="test-results-container">
        <h2>Results</h2>
        <InfoAlert fullState={fullState} />
        <p className="vads-u-font-size--base monospace">
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
