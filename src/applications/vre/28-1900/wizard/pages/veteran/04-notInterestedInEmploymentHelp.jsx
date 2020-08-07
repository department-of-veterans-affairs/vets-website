import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from '../pageList';

const options = [
  { value: pageNames.amVeteran, label: 'Yes' },
  { value: pageNames.amServiceMember, label: 'No' },
];

const notInterestedInEmploymentHelp = ({ setPageState, state = {} }) => (
  <div className="feature">
    <p>
      You can start this application whenever you are ready. For more info
      please visit the lin
    </p>
    <a href="#">Veteran Readiness and Employment (Chapter 31)</a>
  </div>
);

export default {
  name: pageNames.notInterestedInEmploymentHelp,
  component: notInterestedInEmploymentHelp,
};
