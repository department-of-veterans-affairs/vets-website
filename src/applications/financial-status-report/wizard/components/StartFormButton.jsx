import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { rootUrl } from '../../manifest.json';

const StartFormButton = ({ setWizardStatus, label, ariaId }) => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-cta-displayed',
    });
  }, []);

  return (
    <a
      href={`${rootUrl}/introduction`}
      className="usa-button-primary va-button-primary"
      onClick={event => {
        event.preventDefault();
        setWizardStatus(WIZARD_STATUS_COMPLETE);
        recordEvent({
          event: 'cta-button-click',
          'button-type': 'primary',
          'button-click-label': label,
        });
      }}
      aria-describedby={ariaId}
    >
      {label}
    </a>
  );
};

export default StartFormButton;
