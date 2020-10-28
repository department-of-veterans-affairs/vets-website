import React, { useEffect } from 'react';
import { veteranPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  CHAPTER_31_ROOT_URL,
} from 'applications/vre/28-1900/constants';

const InterestedInEmploymentHelp = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
  });
  return (
    <a
      href={`${CHAPTER_31_ROOT_URL}/introduction`}
      type="button"
      className="usa-button-primary va-button-primary"
    >
      Apply for Veteran Readiness and Employment
    </a>
  );
};

export default {
  name: veteranPathPageNames.interestedInEmploymentHelp,
  component: InterestedInEmploymentHelp,
};
