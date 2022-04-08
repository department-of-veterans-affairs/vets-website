import React, { useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { IDENTITY_WIZARD_QUESTIONS } from '../constants';
import { generateWizardAnswers } from '../utilities';

/*
  The identity Wizard feature might not be
  implemented
*/
export default function IdentityWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [choices, setChoices] = useState({});

  const { Answer, showNextQuestion, shouldShowAnswer } = generateWizardAnswers(
    choices,
  );

  function toggleWizardVisibility() {
    setIsOpen(!isOpen);
  }

  function handleRadioSelected(event) {
    event.stopPropagation();
    setChoices(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <div className="wizard-container">
      <button
        type="button"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="wizardOptions"
        onClick={toggleWizardVisibility}
        className={`usa-button-primary wizard-button ${!isOpen &&
          'va-button-primary'}`}
      >
        Find your identity partner
      </button>
      <div
        id="wizardOptions"
        className={`form-expanding-group-open wizard-content ${!isOpen &&
          'wizard-content-closed'}`}
      >
        <div className="wizard-content-inner">
          {IDENTITY_WIZARD_QUESTIONS.map(({ question, options }, index) => (
            <VaRadio
              key={index}
              label={question}
              className={`${
                !showNextQuestion && index !== 0 ? `vads-u-display--none` : ''
              }`}
              onRadioOptionSelected={handleRadioSelected}
            >
              {options.map(radioOption => (
                <va-radio-option key={radioOption.value} {...radioOption} />
              ))}
            </VaRadio>
          ))}
          <div className="vads-u-padding-bottom--2">
            {shouldShowAnswer && <Answer />}
          </div>
        </div>
      </div>
    </div>
  );
}
