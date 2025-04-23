import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import manifest from '../../manifest.json';

const StartFormButton = ({ setWizardStatus, label, ariaId }) => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-cta-displayed',
    });
  }, []);

  return (
    <a
      href={`${manifest.rootUrl}/introduction`}
      className="vads-c-action-link--green"
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
      data-testid="start-button"
    >
      {label}
    </a>
  );
};

StartFormButton.propTypes = {
  ariaId: PropTypes.string,
  label: PropTypes.string,
  setWizardStatus: PropTypes.func,
};

export default StartFormButton;
