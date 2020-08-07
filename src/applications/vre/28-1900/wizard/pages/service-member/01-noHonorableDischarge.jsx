import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';

const options = [
  { value: serviceMemberPathPageNames.amVeteran, label: 'Yes' },
  { value: serviceMemberPathPageNames.notWithin12Years, label: 'No' },
];

const noHonorableDischargeSM = ({ setPageState, state = {} }) => (
  <div className="feature">
    <p>
      To apply for VR&E benefits, you must have received an other than
      dishonorable discharge.
    </p>
    <a href="/">How to Apply for a Discharge Upgrade</a>
  </div>
);

export default {
  name: serviceMemberPathPageNames.noHonorableDischargeSM,
  component: noHonorableDischargeSM,
};
