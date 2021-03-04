import React from 'react';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import manifest from '../../manifest.json';

const ROOT_URL = manifest.rootUrl;

const StartFormButton = ({ setWizardStatus, label, ariaId }) => {
  return (
    <a
      href={`${ROOT_URL}/introduction`}
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
