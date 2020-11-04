import React from 'react';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';

import pageNames from './pageNames';

// Does not have a legacy appeal
const LegacyNo = ({ setWizardStatus }) => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    You can request a Higher-Level Review online using{' '}
    <strong>VA Form 20-0996</strong>.
    <p>
      <button
        onClick={() => setWizardStatus(WIZARD_STATUS_COMPLETE)}
        className="usa-button-primary va-button-primary"
      >
        Request a Higher-Level Review online
      </button>
    </p>
    <a href="/decision-reviews/higher-level-review">
      Learn about other ways you can request a Higher-Level Review
    </a>
  </div>
);

export default {
  name: pageNames.legacyNo,
  component: LegacyNo,
};
