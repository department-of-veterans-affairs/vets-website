import React, { useState } from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';

import { BASE_URL } from '../constants';

import {
  wizardButtonText,
  wizardDescription,
  wizardLabels,
  startPageText,
  alertHeading,
  AlertContent,
} from '../content/wizardLabels';

// initChoice & initExpanded set for testing
const HLRWizard = ({ initChoice = null, initExpanded = false }) => {
  const [choice, setChoice] = useState(initChoice);
  const [expanded, setExpanded] = useState(initExpanded);

  const name = 'higher-level-review';
  const options = [
    { value: 'compensation', label: wizardLabels.compensation },
    { value: 'other', label: wizardLabels.other },
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
              name={name}
              id={name}
              label={wizardDescription}
              options={options}
              onValueChange={({ value }) => setChoice(value)}
              value={{ value: choice }}
              additionalFieldsetClass={'vads-u-margin-top--0'}
            />

            {choice === 'other' && (
              <AlertBox
                headline={alertHeading}
                content={AlertContent}
                status="info"
                isVisible
              />
            )}
            {choice &&
              choice !== 'other' && (
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

export default HLRWizard;
