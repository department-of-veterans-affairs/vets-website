import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Wizard, {
  getReferredBenefit,
  getWizardStatus,
  WIZARD_STATUS_COMPLETE,
  NO_BENEFIT_REFERRED,
  formIdSuffixes,
} from 'applications/static-pages/wizard';
import pages from '../pages';
import { VA_FORM_IDS } from 'platform/forms/constants';

const WizardContainer = ({ setWizardStatus }) => {
  /**
   * @param {string} formIdSuffix The form id suffix of the referred benefit
   */
  const setReferredBenefit = formIdSuffix =>
    sessionStorage.setItem('benefitReferred', formIdSuffix);

  const getCurrentFormIdSuffix = () => {
    const formIDSuffixes = Object.values(formIdSuffixes);
    const urlSections = window.location.href.split('/');
    for (const formIDSuffix of formIDSuffixes) {
      const urlContainsFormIDSuffix = urlSections.find(
        urlSection => formIDSuffix === urlSection,
      );
      if (urlContainsFormIDSuffix) return formIDSuffix;
    }
    return NO_BENEFIT_REFERRED;
  };
  /**
   * @param {string} currentFormIdSuffix The suffix of the current VA form id
   */
  const getCurrentVAFormId = currentFormIdSuffix => {
    const VAFormIDs = Object.values(VA_FORM_IDS);
    for (const VAFormID of VAFormIDs) {
      if (VAFormID.includes(currentFormIdSuffix)) return VAFormID;
    }
    return null;
  };

  const currentFormIdSuffix = getCurrentFormIdSuffix();
  const currentVAFormId = getCurrentVAFormId(currentFormIdSuffix);
  return (
    <div className="wizard-container">
      <h2>Is this the form I need?</h2>
      <p>
        Answer a few questions to find out if you should use VA Form{' '}
        {currentVAFormId} or another application form to apply for the VA
        education benefits you need.
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
      <button
        className="va-button-link vads-u-display--inline-block vads-u-margin-bottom--3 skip-wizard-link"
        onClick={e => {
          e.preventDefault();
          setReferredBenefit(currentFormIdSuffix);
          setWizardStatus(WIZARD_STATUS_COMPLETE);
        }}
      >
        Apply online with VA Form {currentVAFormId}
      </button>
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
