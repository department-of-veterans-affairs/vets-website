import React from 'react';
import { veteranPathPageNames } from '../pageList';

const NoHonorableDischarge = () => {
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
