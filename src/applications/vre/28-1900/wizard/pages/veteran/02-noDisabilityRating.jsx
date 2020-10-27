import React, { useEffect } from 'react';
import { veteranPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_INELIGIBLE,
  CAREERS_EMPLOYMENT_ROOT_URL,
} from 'applications/vre/28-1900/constants';

const NoDisabilityRating = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
  });
  return (
    <div className="feature">
      <p>
        To be eligible for VR&E benefits, you must have a service-connected
        disability and an employment handicap in which your disability limits
        your ability to get a job.
      </p>
      <a href={CAREERS_EMPLOYMENT_ROOT_URL}>
        Find out about VA educational and career counseling
      </a>
    </div>
  );
};

export default {
  name: veteranPathPageNames.noDisabilityRating,
  component: NoDisabilityRating,
};
