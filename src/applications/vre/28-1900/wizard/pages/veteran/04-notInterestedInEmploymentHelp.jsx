import React, { useEffect } from 'react';
import { veteranPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  CHAPTER_31_ROOT_URL,
} from 'applications/vre/28-1900/constants';

const NotInterestedInEmploymentHelp = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
  });
  return (
    <div className="feature">
      <p>
        You can start this application whenever you are ready. Come back to this
        page to begin your application
      </p>
      <a href={`${CHAPTER_31_ROOT_URL}/introduction`}>
        Veteran Readiness and Employment (Chapter 31)
      </a>
    </div>
  );
};

export default {
  name: veteranPathPageNames.notInterestedInEmploymentHelp,
  component: NotInterestedInEmploymentHelp,
};
