import React, { useState } from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

import { higherLevelReviewFeature } from '../helpers';
import { BASE_URL } from '../constants';

import {
  wizardButtonText,
  wizardLabels,
  claimDescription,
  legacyDescription,
  startPageText,
  alertHeading,
  AlertOtherTypeContent,
  AlertLegacyContent,
} from '../content/wizardLabels';

export const name = 'higher-level-review';

// initChoice & initExpanded set for testing
export const HLRWizard = ({
  initExpanded = false,
  initClaimChoice = null,
  initLegacyChoice = null,
  allowHlr = false,
  testHlr = false,
}) => {
  const [claimChoice, setClaimChoice] = useState(initClaimChoice);
  const [legacyChoice, setLegacyChoice] = useState(initLegacyChoice);
  const [expanded, setExpanded] = useState(initExpanded);

  if (!(allowHlr || testHlr)) {
    // Don't render if feature isn't set for the user
    return null;
  }

  const claimOptions = [
    { value: 'compensation', label: wizardLabels.compensation },
    { value: 'other', label: wizardLabels.other },
  ];
  const legacyOptions = [
    { value: 'no', label: wizardLabels.no },
    { value: 'yes', label: wizardLabels.yes },
  ];

  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="wizardOptions"
        className={`usa-button-primary wizard-button${
          expanded ? '' : ' va-button-primary'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        {wizardButtonText}
      </button>

      {expanded && (
        <div
          className="form-expanding-group-open wizard-content vads-u-margin-top--2"
          id="wizardOptions"
        >
          <div className="wizard-content-inner" role="presentation">
            <ErrorableRadioButtons
              id={`${name}-claim`}
              label={claimDescription}
              options={claimOptions}
              onValueChange={({ value }) => setClaimChoice(value)}
              value={{ value: claimChoice }}
              additionalFieldsetClass={`${name}-claim vads-u-margin-top--0`}
            />

            {claimChoice === 'compensation' && (
              <ErrorableRadioButtons
                id={`${name}-legacy`}
                label={legacyDescription}
                options={legacyOptions}
                onValueChange={({ value }) => setLegacyChoice(value)}
                value={{ value: legacyChoice }}
                additionalFieldsetClass={`${name}-legacy vads-u-margin-top--0`}
              />
            )}

            {(claimChoice === 'other' || legacyChoice === 'yes') && (
              <AlertBox
                headline={alertHeading}
                content={
                  (claimChoice === 'other' && AlertOtherTypeContent) ||
                  (legacyChoice === 'yes' && AlertLegacyContent)
                }
                status="info"
                isVisible
              />
            )}

            {claimChoice === 'compensation' &&
              legacyChoice === 'no' && (
                <a
                  href={BASE_URL}
                  className="usa-button usa-button-primary va-button-primary"
                >
                  {startPageText}
                </a>
              )}
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  allowHlr: higherLevelReviewFeature(state),
});

export default connect(mapStateToProps)(HLRWizard);
