import React from 'react';
import PropTypes from 'prop-types';

import Wizard from 'applications/static-pages/wizard';
import pages from './pages';

const WizardContainer = ({ setWizardStatus }) => (
  <div className="wizard-container">
    <h2>Find out if this is the right form</h2>
    <p>
      If a Veteran or their representative wants to dispute a decision they
      received on a claim, they can file a Higher-Level Review. When you request
      a Higher-Level Review, you're asking to have a more senior, experienced
      reviewer take a look at your case and the evidence you already provided.
      this more senior person will determine whether the decision can be changed
      based on a difference of opinion or a VA error. You cannot submit any new
      evidence.
    </p>
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
