import React, { useEffect } from 'react';
import { serviceMemberPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  CHAPTER_31_ROOT_URL,
} from 'applications/vre/28-1900/constants';

const NotInterestedInHelp = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
  });
  return (
    <div className="feature">
      <p>
        You can apply for Veteran Readiness & Employment benefits when you’re
        ready. Come back to this page to begin your application.
      </p>
      <a href={`${CHAPTER_31_ROOT_URL}/introduction`}>
        Veteran Readiness and Employment (Chapter 31)
      </a>
    </div>
  );
};

export default {
  name: serviceMemberPathPageNames.notInterestedInHelp,
  component: NotInterestedInHelp,
};
