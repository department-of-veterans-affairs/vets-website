import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  usePrintTitle,
  generatePdfScaffold,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  txtLineDotted,
} from '@department-of-veterans-affairs/mhv/exports';
import PrintHeader from '../shared/PrintHeader';
import InfoAlert from '../shared/InfoAlert';
import DateSubheading from '../shared/DateSubheading';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';
import ItemList from '../shared/ItemList';
import PrintDownload from '../shared/PrintDownload';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';

import {
  makePdf,
  getNameDateAndTime,
  generateTextFile,
  formatNameFirstLast,
  formatUserDob,
} from '../../util/helpers';

import {
  pageTitles,
  LABS_AND_TESTS_DISPLAY_LABELS,
  OBSERVATION_DISPLAY_LABELS,
} from '../../util/constants';
import {
  generateLabsIntro,
  generateGenericContent,
} from '../../util/pdfHelpers/labsAndTests';

import UnifiedLabAndTestObservations from './UnifiedLabAndTestObservations';

const UnifiedLabsAndTests = props => {
  const { record, user, runningUnitTest = false } = props;

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [record],
  );
  // THOUGHT: this could probably be taken to the parent component?
  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
  );

  const [downloadStarted, setDownloadStarted] = useState(false);

  const generatePdf = async () => {
    setDownloadStarted(true);
    const { title, subject, subtitles } = generateLabsIntro(record);
    const scaffold = generatePdfScaffold(user, title, subject);
    const pdfData = {
      ...scaffold,
      subtitles,
      ...generateGenericContent(record),
    };
    const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Chem/Hem details', runningUnitTest);
  };

  const generateTxt = async () => {
    setDownloadStarted(true);
    const content = [
      `${crisisLineHeader}\n`,
      `${record.name}`,
      `${formatNameFirstLast(user.userFullName)}`,
      `Date of birth: ${formatUserDob(user)}`,
      `${reportGeneratedBy}`,
      `${LABS_AND_TESTS_DISPLAY_LABELS.DATE}: ${record.date}`,
      `${txtLine}\n`,
      record.testCode
        ? `${LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE}: ${record.testCode}`
        : `${LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE}: None Noted`,
      record.sampleTested
        ? `${LABS_AND_TESTS_DISPLAY_LABELS.SAMPLE_TESTED}: ${
            record.sampleTested
          }`
        : '',
      record.bodySite
        ? `${LABS_AND_TESTS_DISPLAY_LABELS.BODY_SITE}: ${record.bodySite}`
        : '',
      record.orderedBy
        ? `${LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY}: ${record.orderedBy}`
        : `${LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY}: None Noted`,
      record.location
        ? `${LABS_AND_TESTS_DISPLAY_LABELS.LOCATION}: ${record.location}`
        : `${LABS_AND_TESTS_DISPLAY_LABELS.LOCATION}: None Noted`,
      record.comments
        ? `${LABS_AND_TESTS_DISPLAY_LABELS.COMMENTS}: ${record.comments}`
        : '',
      `${txtLine}\n`,
    ];
    if (record.result) {
      const results = [
        'Results: \n',
        'Your provider will review your results. If you need to do anything, your provider will contact you. If you have questions, send a message to the care team that ordered this test.\n',
        'Note: If you have questions about more than 1 test ordered by the same care team, send 1 message with all of your questions.\n',
        `${record.result}`,
      ];
      content.push(...results);
    }
    if (record.observations) {
      const observations = [
        'Results: \n',
        ...record.observations.map(entry =>
          [
            `${txtLine}`,
            `${entry.testCode}`,
            `${txtLineDotted}`,
            `${OBSERVATION_DISPLAY_LABELS.VALUE}: ${entry.value.text}`,
            `${OBSERVATION_DISPLAY_LABELS.REFERENCE_RANGE}: ${
              entry.referenceRange
            }`,
            `${OBSERVATION_DISPLAY_LABELS.STATUS}: ${entry.status}`,
            entry.bodySite
              ? `${OBSERVATION_DISPLAY_LABELS.BODY_SITE}: ${entry.bodySite}`
              : '',
            entry.sampleTested
              ? `${OBSERVATION_DISPLAY_LABELS.SAMPLE_TESTED}: ${
                  entry.sampleTested
                }`
              : '',
            entry.comments
              ? `${OBSERVATION_DISPLAY_LABELS.COMMENTS}: ${entry.comments}`
              : '',
          ]
            .filter(line => line)
            .join(`\n`),
        ),
      ];
      content.push(...observations);
    }

    const txt = content.filter(line => line).join(`\n`);
    const txtName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}.txt`;
    generateTextFile(txt, txtName);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby="test-result-date"
        data-testid="lab-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - name]"
      >
        <DateSubheading
          date={record.date}
          id="test-result-date"
          label={LABS_AND_TESTS_DISPLAY_LABELS.DATE}
          labelClass="vads-font-weight-regular"
        />

        {downloadStarted && <DownloadSuccessAlert />}

        <PrintDownload
          description="L&TR Detail"
          downloadPdf={generatePdf}
          downloadTxt={generateTxt}
          allowTxtDownloads
        />
        <DownloadingRecordsInfo description="L&TR Detail" allowTxtDownloads />

        {/*                   TEST DETAILS                          */}
        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE}
              value={record.testCode}
              testId="chem-hem-category"
              data-dd-action-name="[lab and tests - test code]"
            />
            {record.sampleTested && (
              <LabelValue
                ifEmpty="None Noted"
                label={LABS_AND_TESTS_DISPLAY_LABELS.SAMPLE_TESTED}
                value={record.sampleTested}
                testId="chem-hem-sample-tested"
                data-dd-action-name="[lab and tests - sample tested]"
              />
            )}
            {record.bodySite && (
              <LabelValue
                ifEmpty="None Noted"
                label={LABS_AND_TESTS_DISPLAY_LABELS.BODY_SITE}
                value={record.bodySite}
                testId="chem-hem-sample-tested"
                data-dd-action-name="[lab and tests - body site]"
              />
            )}
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY}
              value={record.orderedBy}
              testId="chem-hem-ordered-by"
              data-dd-action-name="[lab and tests - ordered by]"
            />
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.LOCATION}
              value={record.location}
              testId="chem-hem-collecting-location"
              data-dd-action-name="[lab and tests - location]"
            />

            {record.comments && (
              <>
                <LabelValue
                  label={LABS_AND_TESTS_DISPLAY_LABELS.COMMENTS}
                  ifEmpty=""
                />
                <ItemList list={record.comments} />
              </>
            )}
            {record.result && (
              <>
                <LabelValue
                  ifEmpty="None Noted"
                  label={LABS_AND_TESTS_DISPLAY_LABELS.RESULTS}
                  value={record.result}
                />
              </>
            )}
          </HeaderSection>
        </div>
        {/*         RESULTS CARDS            */}
        {record.observations && (
          <div className="test-results-container">
            <HeaderSection header="Results" className="test-results-header">
              <InfoAlert highLowResults />
              <div className="print-only">
                <p>
                  Your provider will review your results and explain what they
                  mean for your health. To ask a question now, send a secure
                  message to your care team.
                </p>
                <LabelValue label="Standard range">
                  The standard range is one tool your providers use to
                  understand your results. If your results are outside the
                  standard range, this doesn’t automatically mean you have a
                  health problem. Your provider will explain what your results
                  mean for your health.
                </LabelValue>
              </div>
              <UnifiedLabAndTestObservations results={record.observations} />
            </HeaderSection>
          </div>
        )}
      </HeaderSection>
    </div>
  );
};

export default UnifiedLabsAndTests;

UnifiedLabsAndTests.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
  user: PropTypes.object,
};
