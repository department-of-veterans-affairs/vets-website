import React, { useEffect } from 'react';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  PCPG_ROOT_URL,
} from '../../constants';

const StartForm = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
  });
  return (
    <a
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
