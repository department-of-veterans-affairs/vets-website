import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { PCPG_ROOT_URL } from '../../constants';

const StartForm = props => {
  const { setWizardStatus } = props;
  useEffect(() => {
    setWizardStatus(WIZARD_STATUS_COMPLETE);
    recordEvent({
      event: 'howToWizard-cta-displayed',
    });
  });
  const handleClick = () => {
    recordEvent({
      event: 'cta-primary-button-click',
    });
  };
  return (
    <a
      id="startForm"
      onClick={handleClick}
      href={`${PCPG_ROOT_URL}/introduction`}
      className="vads-c-action-link--green"
    >
      Apply for career planning and guidance
    </a>
  );
};

export default {
  name: 'startForm',
  component: StartForm,
};
