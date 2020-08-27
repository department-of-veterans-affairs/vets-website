import React from 'react';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { pageNames } from './pageList';

/**
 * Remove link to introduction page once show526Wizard flipper is at 100%
 */
const FileClaimPage = ({ setWizardStatus }) => (
  <p>
    {window.location.pathname.includes('how-to-file-claim') ? (
      <a
        href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </a>
    ) : (
      <button
        onClick={() => setWizardStatus(WIZARD_STATUS_COMPLETE)}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </button>
    )}
  </p>
);

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
};
