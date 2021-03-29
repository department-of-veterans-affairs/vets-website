import React from 'react';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { rootUrl } from '../../manifest.json';

const StartFormButton = ({ setWizardStatus, label, ariaId }) => {
  return (
    <a
      href={`${rootUrl}/introduction`}
      className="usa-button-primary va-button-primary"
      onClick={event => {
        event.preventDefault();
        setWizardStatus(WIZARD_STATUS_COMPLETE);
      }}
      aria-describedby={ariaId}
    >
      {label}
    </a>
  );
};

export default StartFormButton;
