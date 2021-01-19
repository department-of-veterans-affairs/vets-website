import React from 'react';

import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';

export const formStartButton = ({ setWizardStatus, label, ariaId }) => (
  <a
    href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
    className="usa-button-primary va-button-primary"
    onClick={event => {
      /* Remove this check, keep the preventDefault once show526Wizard flipper
          is at 100% */
      if (window.location.pathname.includes(DISABILITY_526_V2_ROOT_URL)) {
        event.preventDefault();
      }
      setWizardStatus(WIZARD_STATUS_COMPLETE);
    }}
    aria-describedby={ariaId}
  >
    {label}
  </a>
);
