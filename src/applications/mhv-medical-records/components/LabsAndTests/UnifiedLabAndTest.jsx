import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import PrintHeader from '../shared/PrintHeader';
import InfoAlert from '../shared/InfoAlert';

import DateSubheading from '../shared/DateSubheading';

import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';
import ItemList from '../shared/ItemList';

import UnifiedLabAndTestObservations from './UnifiedLabAndTestObservations';

const UnifiedLabsAndTests = props => {
  const { record } = props;

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [record],
  );

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
          label="Date and time collected"
          labelClass="vads-font-weight-regular"
        />

        {/*                   TEST DETAILS                          */}
        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              ifEmpty="None Noted"
              label="Type of test"
              value={record.testCode}
              testId="chem-hem-category"
              data-dd-action-name="[lab and tests - test code]"
            />
            {record.sampleTested && (
              <LabelValue
                ifEmpty="None Noted"
                label="Site or sample tested"
                value={record.sampleTested}
                testId="chem-hem-sample-tested"
                data-dd-action-name="[lab and tests - sample tested]"
              />
            )}
            {record.bodySite && (
              <LabelValue
                ifEmpty="None Noted"
                label="Body site tested"
                value={record.bodySite}
                testId="chem-hem-sample-tested"
                data-dd-action-name="[lab and tests - body site]"
              />
            )}
            <LabelValue
              ifEmpty="None Noted"
              label="Ordered by"
              value={record.orderedBy}
              testId="chem-hem-ordered-by"
              data-dd-action-name="[lab and tests - ordered by]"
            />
            <LabelValue
              ifEmpty="None Noted"
              label="Location"
              value={record.location}
              testId="chem-hem-collecting-location"
              data-dd-action-name="[lab and tests - location]"
            />

            {record.comments && (
              <>
                <LabelValue label="Lab comments" />
                <ItemList list={record.comments} />
              </>
            )}
            {record.result && (
              <>
                <LabelValue
                  ifEmpty="None Noted"
                  label="Result"
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
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
