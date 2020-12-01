import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';

const NoHonorableDischargeSM = () => {
  return (
    <div className="feature vads-u-background-color--gray-lightest">
      <p>
        To apply for VR&E benefits, you must have received an other than
        dishonorable discharge.
      </p>
      <a href="/discharge-upgrade-instructions/">
        Learn more about how to apply for a discharge upgrade
      </a>
    </div>
  );
};

export default {
  name: serviceMemberPathPageNames.noHonorableDischargeSM,
  component: NoHonorableDischargeSM,
};
