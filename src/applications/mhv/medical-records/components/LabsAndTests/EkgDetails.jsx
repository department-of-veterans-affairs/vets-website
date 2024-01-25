import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
import { txtLine } from '../../../shared/util/constants';
import {
  generateLabsIntro,
  generateEkgContent,
} from '../../util/pdfHelpers/labsAndTests';

const EkgDetails = props => {
  const { record, runningUnitTest } = props;
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const user = useSelector(state => state.user.profile);

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${record.name} - ${pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE}`,
      );
    },
    [record.date, record.name],
  );

  const generateEkgDetails = async () => {
    const { title, subject, preface } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateEkgContent(record) };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Electrocardiogram details', runningUnitTest);
  };

  const generateEkgTxt = async () => {
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
      <h1 className="vads-u-margin-bottom--0" aria-describedby="ekg-date">
        {record.name}
      </h1>
      <DateSubheading date={record.date} id="ekg-date" />

      <div className="electrocardiogram-buttons no-print">
        <PrintDownload
          download={generateEkgDetails}
          allowTxtDownloads={allowTxtDownloads}
          downloadTxt={generateEkgTxt}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      <div className="electrocardiogram-details max-80">
        <h2 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordering location
        </h2>
        <p>{record.facility || 'There is no facility reported at this time'}</p>
        <h2 className="vads-u-font-size--base vads-u-font-family--sans">
          Results
        </h2>
        <p>
          Your EKG results aren’t available in this tool. To get your EKG
          results, you can request a copy of your complete medical record from
          your VA health facility.
        </p>
        <p className="vads-u-margin-top--2 no-print">
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
