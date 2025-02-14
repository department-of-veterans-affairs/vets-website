import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  generatePdfScaffold,
  updatePageTitle,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  generateTextFile,
  getNameDateAndTime,
  makePdf,
} from '../../util/helpers';

import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';

import {
  generateLabsIntro,
  generateEkgContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';

const EkgDetails = props => {
  const { record, runningUnitTest } = props;
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const user = useSelector(state => state.user.profile);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [record.date, record.name],
  );

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateEkgDetailsPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = { ...scaffold, subtitles, ...generateEkgContent(record) };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Electrocardiogram details', runningUnitTest);
  };

  const generateEkgTxt = async () => {
    setDownloadStarted(true);
    const content = `
    ${record.name} \n
    Date: ${record.date} \n
    ${txtLine} \n
    \t Ordering location: ${record.facility} \n
    \t Results: Your EKG results aren’t available in this tool. To get your EKG
    results, you can request a copy of your complete medical record from
    your VA health facility.\n`;

    const fileName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="ekg-date"
        data-testid="ekg-record-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - ekg name]"
      >
        {record.name}
      </h1>
      <DateSubheading
        date={record.date}
        id="ekg-date"
        label="Date and time collected"
      />

      {downloadStarted && <DownloadSuccessAlert />}
      <PrintDownload
        description="L&TR Detail"
        downloadPdf={generateEkgDetailsPdf}
        allowTxtDownloads={allowTxtDownloads}
        downloadTxt={generateEkgTxt}
      />
      <DownloadingRecordsInfo
        description="L&TR Detail"
        allowTxtDownloads={allowTxtDownloads}
      />

      <div className="test-details-container max-80">
        <h2 className="vads-u-font-size--md vads-u-font-family--sans">
          Location
        </h2>
        <p
          data-testid="ekg-record-facility"
          data-dd-privacy="mask"
          data-dd-action-name="[lab and tests - ekg facility]"
        >
          {record.facility || 'There is no facility reported at this time'}
        </p>
        <h2 className="vads-u-font-size--md vads-u-font-family--sans">
          Results
        </h2>
        <p data-testid="ekg-results">
          Your EKG results aren’t available in this tool. To get your EKG
          results, you can request a copy of your complete medical record from
          your VA health facility.
        </p>
        <p className="vads-u-margin-top--3 no-print">
          <a href="https://www.va.gov/resources/how-to-get-your-medical-records-from-your-va-health-facility/">
            Learn how to get records from your VA health facility
          </a>
        </p>
      </div>
    </div>
  );
};

export default EkgDetails;

EkgDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
