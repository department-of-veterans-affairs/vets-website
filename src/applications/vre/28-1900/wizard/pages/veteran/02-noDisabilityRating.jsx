import React, { useEffect } from 'react';
import { veteranPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_INELIGIBLE,
} from 'applications/vre/28-1900/constants';

const NoDisabilityRating = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
  });
  return (
    <div className="feature">
      <p>
        To apply for VR&E benefits, you must be within 12 years of whichever is
        later: your date of discharge or the date you received your disability
        rating.
      </p>
    </div>
  );
};

export default {
  name: veteranPathPageNames.noDisabilityRating,
  component: NoDisabilityRating,
};
