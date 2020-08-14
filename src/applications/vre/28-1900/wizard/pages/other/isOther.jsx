import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import {
  veteranPathPageNames,
  serviceMemberPathPageNames,
  otherPathPageNames,
} from '../pageList';

const options = [
  { value: veteranPathPageNames.isVeteran, label: 'Veteran' },
  {
    value: serviceMemberPathPageNames.isServiceMember,
    label: 'Current service member',
  },
  { value: otherPathPageNames.isOther, label: 'Neither of these' },
];

const amOther = ({ setPageState, state = {} }) => (
  <div className="feature">
    <p>
      To apply for VR&E benefits, you must be either a Veteran or active-duty
      service member.
    </p>
    <a href="#">Find out about VA educational and career counseling</a>
  </div>
);

export default {
  name: otherPathPageNames.isOther,
  component: amOther,
};
