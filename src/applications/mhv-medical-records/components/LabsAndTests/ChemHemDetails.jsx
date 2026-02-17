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
  txtLineDotted,
  usePrintTitle,
  makePdf,
  getNameDateAndTime,
  formatNameFirstLast,
  formatUserDob,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import ItemList from '../shared/ItemList';
import ChemHemResults from './ChemHemResults';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import {
  processList,
  generateTextFile,
  itemListWrapper,
} from '../../util/helpers';
import { pageTitles } from '../../util/constants';
import DateSubheading from '../shared/DateSubheading';
import {
  generateLabsIntro,
  generateChemHemContent,
} from '../../util/pdfHelpers/labsAndTests';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';

const ChemHemDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, [record.date, record.name]);

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
    updatePageTitle,
  );

  const generateChemHemPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateChemHemContent(record),
    };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    try {
      await makePdf(
        pdfName,
        pdfData,
        'medicalRecords',
        'Medical Records - Chem/Hem details - PDF generation error',
        runningUnitTest,
      );
    } catch {
      // makePdf handles error logging to Datadog/Sentry
    }
  };

  const generateChemHemTxt = async () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
Date entered: ${record.date}\n
${txtLine}\n\n
Type of test: ${record.type} \n
Site or sample tested: ${record.sampleTested} \n
Ordered by: ${record.orderedBy} \n
Location: ${record.collectingLocation} \n
Lab comments: ${processList(record.comments)} \n
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
Lab comments: ${entry.labComments}\n`,
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
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--1"
        aria-describedby="chem-hem-date"
        data-testid="chem-hem-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - name]"
      >
        <DateSubheading
          date={record.date}
          id="chem-hem-date"
          label="Date and time collected"
          labelClass="vads-u-font-weight--normal"
        />

        {downloadStarted && <DownloadSuccessAlert />}

        {/*                   TEST DETAILS                          */}
        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              label="Type of test"
              value={record.category}
              testId="chem-hem-category"
              data-dd-action-name="[lab and tests - category]"
            />
            <LabelValue
              label="Site or sample tested"
              value={record.sampleTested}
              testId="chem-hem-sample-tested"
              data-dd-action-name="[lab and tests - site]"
            />
            <LabelValue
              label="Ordered by"
              value={record.orderedBy}
              testId="chem-hem-ordered-by"
              data-dd-action-name="[lab and tests - ordered by]"
            />
            <LabelValue
              label="Location"
              value={record.collectingLocation}
              testId="chem-hem-collecting-location"
              data-dd-action-name="[lab and tests - location]"
            />
            <LabelValue
              label="Lab comments"
              element={itemListWrapper(record?.comments)}
              testId="chem-hem-lab-comments"
            >
              <ItemList list={record.comments} />
            </LabelValue>
          </HeaderSection>
        </div>
        {/*         RESULTS CARDS            */}
        <div className="test-results-container">
          <HeaderSection header="Results" className="test-results-header">
            <InfoAlert highLowResults fullState={fullState} />
            <div className="print-only">
              <p>
                Your provider will review your results and explain what they
                mean for your health. To ask a question now, send a secure
                message to your care team.
              </p>
              <LabelValue label="Standard range">
                The standard range is one tool your providers use to understand
                your results. If your results are outside the standard range,
                this doesn’t automatically mean you have a health problem. Your
                provider will explain what your results mean for your health.
              </LabelValue>
            </div>
            <ChemHemResults results={record.results} />
          </HeaderSection>
        </div>
        <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
        <DownloadingRecordsInfo description="L&TR Detail" />
        <PrintDownload
          description="L&TR Detail"
          downloadPdf={generateChemHemPdf}
          downloadTxt={generateChemHemTxt}
        />
        <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
      </HeaderSection>
    </div>
  );
};

export default ChemHemDetails;

ChemHemDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
