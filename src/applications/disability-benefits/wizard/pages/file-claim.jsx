import React from 'react';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import manifest from '../../all-claims/manifest.json';
import { pageNames } from './pageList';

/**
 * Remove link to introduction page once show526Wizard flipper is at 100%
 */
const FileClaimPage = ({ setWizardStatus }) => (
  <p>
    {window.location.pathname.includes(manifest.rootUrl) ? (
      <button
        onClick={() => setWizardStatus(WIZARD_STATUS_COMPLETE)}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </button>
    ) : (
      <a
        href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </a>
    )}
  </p>
);

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
};
