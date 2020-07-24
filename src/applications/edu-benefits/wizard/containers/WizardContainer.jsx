import React from 'react';
import PropTypes from 'prop-types';
import Wizard from '../../../static-pages/wizard';
import pages from '../pages';

const WizardContainer = () => (
  <div className="wizard-container">
    <h2>Find out if this is the right form</h2>
    <p>
      To see if this is the right form for you, please answer a few questions.
    </p>
    <Wizard pages={pages} expander buttonText="Let's get started" />
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
        // this.setEduBenefitFormSelected('FORM_ID_1990');
        // this.setWizardCompletionStatus('WIZARD_STATUS_COMPLETE');
      }}
    >
      If you know VA Form 22-1990 is right, apply now
    </a>
  </div>
);

WizardContainer.defaultProps = {};

WizardContainer.propTypes = {};

export default WizardContainer;
