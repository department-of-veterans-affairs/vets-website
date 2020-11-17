import React from 'react';
import PropTypes from 'prop-types';

import Wizard from 'applications/static-pages/wizard';
import pages from './pages';

const WizardContainer = ({ setWizardStatus }) => (
  <div className="wizard-container">
    <h2>Is this the form I need?</h2>
    <p>
      Use this form if you disagree with VA’s decision on your claim and want to
      request that a senior reviewer take a new look at your case and the
      evidence you provided. You can’t submit any new evidence with a
      Higher-Level Review.
    </p>
    <p>Answer a few questions to get started.</p>
    <Wizard pages={pages} expander={false} setWizardStatus={setWizardStatus} />
  </div>
);

WizardContainer.defaultProps = {
  setWizardStatus: () => {},
};

WizardContainer.propTypes = {
  setWizardStatus: PropTypes.func.isRequired,
};

export default WizardContainer;
