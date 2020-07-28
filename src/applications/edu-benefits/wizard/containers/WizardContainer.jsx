import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Wizard, {
  getReferredBenefit,
  getWizardStatus,
  WIZARD_STATUS_COMPLETE,
  formIdSuffixes,
  NO_BENEFIT_REFERRED,
} from '../../../static-pages/wizard';
import pageComponents from '../pages';

const WizardContainer = ({ setWizardStatus }) => {
  /**
   * @param {string} formId The form id of the referred benefit
   */
  const setBenefitReferred = formId =>
    sessionStorage.setItem('benefitReferred', formId);

  const getCurrentFormId = () => {
    const formIds = Object.values(formIdSuffixes);
    for (const formId of formIds) {
      if (window.location.href.includes(formId)) return formId;
    }
    return NO_BENEFIT_REFERRED;
  };
  const currentFormId = getCurrentFormId();
  return (
    <div className="wizard-container">
      <h2>Find out if this is the right form</h2>
      <p>
        To see if this is the right form for you, please answer a few questions.
      </p>
      <Wizard
        pages={pageComponents}
        expander
        setBenefitReferred={setBenefitReferred}
        setWizardStatus={setWizardStatus}
        buttonText="Let's get started"
      />
      <h2>Already know this is the right form?</h2>
      <p>
        If you already know that VA Form 22-1990 is correct or if you were
        directed to complete this application, you can go straight to the
        application without answering the questions above.
      </p>
      <a
        href="#"
        className="vads-u-display--inline-block vads-u-margin-bottom--3"
        onClick={e => {
          e.preventDefault();
          setBenefitReferred(currentFormId);
          setWizardStatus(WIZARD_STATUS_COMPLETE);
        }}
      >
        If you know VA Form 22-1990 is right, apply now
      </a>
    </div>
  );
};

WizardContainer.defaultProps = {
  setWizardStatus: () => {},
};

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func.isRequired,
};

export default WizardContainer;
