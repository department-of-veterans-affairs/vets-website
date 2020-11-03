import React, { useEffect } from 'react';
import { serviceMemberPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  CHAPTER_31_ROOT_URL,
} from 'applications/vre/28-1900/constants';

const YesInterestedInHelp = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
  });
  return (
    <a
      href={`${CHAPTER_31_ROOT_URL}/introduction`}
      type="button"
      className="usa-button-primary va-button-primary"
    >
      Apply for career counseling
    </a>
  );
};

export default {
  name: serviceMemberPathPageNames.yesInterestedInHelp,
  component: YesInterestedInHelp,
};
