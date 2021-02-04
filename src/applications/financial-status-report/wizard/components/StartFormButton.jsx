import React from 'react';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';

const ROOT_URL = '/manage-va-debt/request-debt-help-5655';

const StartFormButton = ({ setWizardStatus, label, ariaId }) => {
  return (
    <a
      href={`${ROOT_URL}/introduction`}
      className="usa-button-primary va-button-primary"
      onClick={event => {
        // Remove this check, keep the preventDefault once flipper is at 100%
        if (window.location.pathname.includes(ROOT_URL)) {
          event.preventDefault();
        }
        setWizardStatus(WIZARD_STATUS_COMPLETE);
      }}
      aria-describedby={ariaId}
    >
      {label}
    </a>
  );
};

export default StartFormButton;
