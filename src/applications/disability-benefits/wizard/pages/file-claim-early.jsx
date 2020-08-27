import React from 'react';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { pageNames } from './pageList';

const FileClaimPage = ({ setWizardStatus }) => (
  <div>
    <p>
      {/* Remove link to introduction page once show526Wizard flipper is at 100% */}
      {window.location.pathname.includes(DISABILITY_526_V2_ROOT_URL) ? (
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
  </div>
);

export default {
  name: pageNames.fileClaimEarly,
  component: FileClaimPage,
};
