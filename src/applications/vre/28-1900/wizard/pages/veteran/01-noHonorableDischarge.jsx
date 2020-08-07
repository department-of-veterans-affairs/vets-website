import React from 'react';
import { veteranPathPageNames } from '../pageList';

const noHonorableDischarge = ({ setPageState, state = {} }) => (
  <div className="feature">
    <p>
      To apply for VR&E benefits, you must have received an other than
      dishonorable discharge.
    </p>
    <a href="/">How to Apply for a Discharge Upgrade</a>
  </div>
);

export default {
  name: veteranPathPageNames.noHonorableDischarge,
  component: noHonorableDischarge,
};
