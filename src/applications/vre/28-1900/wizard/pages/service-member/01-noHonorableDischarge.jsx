import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';

const NoHonorableDischargeSM = () => {
  return (
    <div className="feature">
      <p>
        To apply for VR&E benefits, you must have received an other than
        dishonorable discharge.
      </p>
      <a href="/discharge-upgrade-instructions/">
        How to Apply for a Discharge Upgrade
      </a>
    </div>
  );
};

export default {
  name: serviceMemberPathPageNames.noHonorableDischargeSM,
  component: NoHonorableDischargeSM,
};
