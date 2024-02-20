import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PrintHeader from '../shared/PrintHeader';
import ItemList from '../shared/ItemList';
import ChemHemResults from './ChemHemResults';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import {
  makePdf,
  processList,
  generateTextFile,
  getNameDateAndTime,
} from '../../util/helpers';
import {
  generatePdfScaffold,
  updatePageTitle,
  formatName,
} from '../../../shared/util/helpers';
import {
  txtLine,
  txtLineDotted,
  crisisLineHeader,
  reportGeneratedBy,
} from '../../../shared/util/constants';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateLabsIntro,
  generateChemHemContent,
} from '../../util/pdfHelpers/labsAndTests';
import usePrintTitle from '../../../shared/hooks/usePrintTitle';

const ChemHemDetails = props => {
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
    [record.date, record.name],
  );

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    formatDateLong,
    updatePageTitle,
  );

  const generateChemHemPdf = async () => {
    const { title, subject, preface } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateChemHemContent(record) };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Chem/Hem details', runningUnitTest);
  };

  const generateChemHemTxt = async () => {
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatName(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
Date entered: ${record.date}\n
${txtLine}\n\n
Type of test: ${record.type} \n
Sample tested: ${record.sampleTested} \n
Ordered by: ${record.orderedBy} \n
Order location: ${record.orderingLocation} \n
Collecting location: ${record.collectingLocation} \n
Provider notes: ${processList(record.comments)} \n
${txtLine}\n\n
Results:
${record.results
      .map(
        entry => `
${txtLine}\n
${entry.name}
${txtLineDotted}
Result: ${entry.result}
Standard range: ${entry.standardRange}
Status: ${entry.status}
Lab location: ${entry.labLocation}
Interpretation: ${entry.interpretation}\n`,
      )
      .join('')}`;

    generateTextFile(
      content,
      `VA-labs-and-tests-details-${getNameDateAndTime(user)}`,
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--1"
        aria-describedby="chem-hem-date"
        data-testid="chem-hem-name"
      >
        {record.name}
      </h1>
      <DateSubheading date={record.date} id="chem-hem-date" />

      <div className="no-print">
        <PrintDownload
          download={generateChemHemPdf}
          downloadTxt={generateChemHemTxt}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>
      {/*                   TEST DETAILS                          */}
      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Type of test
        </h3>
        <p data-testid="chem-hem-category">{record.category}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Sample tested
        </h3>
        <p data-testid="chem-hem-sample-tested">{record.sampleTested}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordered by
        </h3>
        <p data-testid="chem-hem-ordered-by">{record.orderedBy}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Ordering location
        </h3>
        <p data-testid="chem-hem-ordering-location">
          {record.orderingLocation}
        </p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Collecting location
        </h3>
        <p data-testid="chem-hem-collecting-location">
          {record.collectingLocation}
        </p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Provider notes
        </h3>
        <ItemList list={record.comments} />
      </div>
      {/*         RESULTS CARDS            */}
      <div className="test-results-container">
        <h2>Results</h2>
        <InfoAlert highLowResults fullState={fullState} />
        <div className="print-only">
          <p>
            Your provider will review your results and explain what they mean
            for your health. To ask a question now, send a secure message to
            your care team.
          </p>
          <h4 className="vads-u-margin--0 vads-u-font-size--base vads-u-font-family--sans">
            Standard range
          </h4>
          <p className="vads-u-margin-top--0">
            The standard range is one tool your providers use to understand your
            results. If your results are outside the standard range, this
            doesn’t automatically mean you have a health problem. Your provider
            will explain what your results mean for your health.
          </p>
        </div>
        <ChemHemResults results={record.results} />
      </div>
    </div>
  );
};

export default ChemHemDetails;

ChemHemDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
