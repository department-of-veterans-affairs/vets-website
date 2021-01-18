import React from 'react';

import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';

export const formStartButton = ({
  setWizardStatus,
  label,
  linkUrl,
  ariaId,
}) => {
  const clickHandler = () => {
    setWizardStatus(WIZARD_STATUS_COMPLETE);
  };
  return (
    <a
      href={linkUrl}
      onClick={event => {
        /* Remove this check, keep the preventDefault once show526Wizard flipper
           is at 100% */
        if (window.location.pathname.includes(DISABILITY_526_V2_ROOT_URL)) {
          event.preventDefault();
        }
        clickHandler();
      }}
      className="usa-button-primary va-button-primary"
      aria-describedby={ariaId}
    >
      {label}
    </a>
  );
};
