import React from 'react';
import { pageNames } from '../pageList';

const options = [
  { value: pageNames.amVeteran, label: 'Yes' },
  { value: pageNames.notWithin12Years, label: 'No' },
];

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
  name: pageNames.noHonorableDischarge,
  component: noHonorableDischarge,
};
