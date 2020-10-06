import React from 'react';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';

import pageNames from './pageNames';

// Does not have a legacy appeal
const LegacyNo = ({ setWizardStatus }) => (
  <button
    onClick={() => setWizardStatus(WIZARD_STATUS_COMPLETE)}
    className="usa-button-primary va-button-primary"
  >
    Request a Higher-Level Review
  </button>
);

export default {
  name: pageNames.legacyNo,
  component: LegacyNo,
};
