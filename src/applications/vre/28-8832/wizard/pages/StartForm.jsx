import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  PCPG_ROOT_URL,
} from '../../constants';

const StartForm = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-cta-displayed',
    });
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
  });
  const handleClick = () => {
    recordEvent({
      event: 'cta-primary-button-click',
    });
  };
  return (
    <a
      onClick={handleClick}
      href={`${PCPG_ROOT_URL}/introduction`}
      className="usa-button-primary va-button-primary"
    >
      Apply for career planning and guidance
    </a>
  );
};

export default {
  name: 'startForm',
  component: StartForm,
};
