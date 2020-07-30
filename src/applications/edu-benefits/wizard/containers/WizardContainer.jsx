import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Wizard, {
  getReferredBenefit,
  getWizardStatus,
  WIZARD_STATUS_COMPLETE,
  formIdSuffixes,
  NO_BENEFIT_REFERRED,
} from '../../../static-pages/wizard';
import pages from '../pages';

const WizardContainer = ({ setWizardStatus }) => {
  /**
   * @param {string} formId The form id suffix of the referred benefit
   */
  const setReferredBenefit = formId =>
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
      <h2>Is this the form I need?</h2>
      <p>
        Answer a few questions to find out if you should use VA Form 22-1990 or
        another application form to apply for the VA education benefits you
        need.
      </p>
      <Wizard
        pages={pages}
        expander
        setReferredBenefit={setReferredBenefit}
        setWizardStatus={setWizardStatus}
        buttonText="Find the right application form"
      />
      <h2>I know this is the form I need. How do I apply?</h2>
      <p>
        Click on the link below to go to our online application without
        answering the questions above.
      </p>
      <a
        href="#"
        className="vads-u-display--inline-block vads-u-margin-bottom--3 skip-wizard-link"
        onClick={e => {
          e.preventDefault();
          setReferredBenefit(currentFormId);
          setWizardStatus(WIZARD_STATUS_COMPLETE);
        }}
      >
        Apply online with VA Form 22-1990
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
