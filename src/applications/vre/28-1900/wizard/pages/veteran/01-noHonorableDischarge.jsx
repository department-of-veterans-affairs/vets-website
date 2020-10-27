import React, { useEffect } from 'react';
import { veteranPathPageNames } from '../pageList';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_INELIGIBLE,
} from 'applications/vre/28-1900/constants';

const NoHonorableDischarge = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
  });
  return (
    <div className="feature">
      <p>
        To apply for VR&E benefits, you must have received{' '}
        <strong>an other than</strong> dishonorable discharge.
      </p>
      <a href="/discharge-upgrade-instructions/">
        How to Apply for a Discharge Upgrade
      </a>
    </div>
  );
};

export default {
  name: veteranPathPageNames.noHonorableDischarge,
  component: NoHonorableDischarge,
};
