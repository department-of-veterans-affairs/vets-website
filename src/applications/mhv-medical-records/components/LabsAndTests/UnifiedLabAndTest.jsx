import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  usePrintTitle,
  makePdf,
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

import { generateTextFile, itemListWrapper } from '../../util/helpers';

import {
  pageTitles,
  LABS_AND_TESTS_DISPLAY_LABELS,
} from '../../util/constants';

import UnifiedLabAndTestObservations from './UnifiedLabAndTestObservations';
import { pdfPrinter, txtPrinter } from '../../util/printHelper';

const UnifiedLabsAndTests = props => {
  const { record, user, runningUnitTest = false } = props;

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
  );

  const [downloadStarted, setDownloadStarted] = useState(false);

  const generatePdf = async () => {
    setDownloadStarted(true);
    const data = pdfPrinter({ record, user });
    makePdf(data.title, data.body, 'medicalRecords', runningUnitTest);
  };

  const generateTxt = async () => {
    setDownloadStarted(true);
    const data = txtPrinter({ record, user });
    generateTextFile(data.body, data.title);
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

        {/*                   TEST DETAILS                          */}
        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.TEST_CODE}
              value={record.testCode}
              testId="lab-and-test-code"
              data-dd-action-name="[lab and tests - test code]"
            />
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.SAMPLE_TESTED}
              value={record.sampleTested}
              testId="lab-and-test-sample-tested"
              data-dd-action-name="[lab and tests - sample tested]"
            />
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.BODY_SITE}
              value={record.bodySite}
              testId="lab-and-test-body-site"
              data-dd-action-name="[lab and tests - body site]"
            />
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.ORDERED_BY}
              value={record.orderedBy}
              testId="lab-and-test-ordered-by"
              data-dd-action-name="[lab and tests - ordered by]"
            />
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.LOCATION}
              value={record.location}
              testId="lab-and-test-collecting-location"
              data-dd-action-name="[lab and tests - location]"
            />
            <LabelValue
              label={LABS_AND_TESTS_DISPLAY_LABELS.COMMENTS}
              element={itemListWrapper(record?.comments)}
              testId="lab-and-test-comments"
            >
              <ItemList list={record.comments} />
            </LabelValue>
            <LabelValue
              ifEmpty="None Noted"
              label={LABS_AND_TESTS_DISPLAY_LABELS.RESULTS}
              value={record.result}
              testId="lab-and-test-results"
            />
          </HeaderSection>
        </div>
        {/*         RESULTS CARDS            */}
        {record.observations && (
          <div
            className="test-results-container"
            data-testid="test-observations"
          >
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
      <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
      <DownloadingRecordsInfo description="L&TR Detail" />
      <PrintDownload
        description="L&TR Detail"
        downloadPdf={generatePdf}
        downloadTxt={generateTxt}
      />
      <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
    </div>
  );
};

export default UnifiedLabsAndTests;

UnifiedLabsAndTests.propTypes = {
  record: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    testCode: PropTypes.string,
    sampleTested: PropTypes.string,
    bodySite: PropTypes.string,
    orderedBy: PropTypes.string,
    location: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.string),
    result: PropTypes.string,
    observations: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  runningUnitTest: PropTypes.bool,
  user: PropTypes.object,
};
