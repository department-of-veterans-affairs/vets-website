import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from '../pageList';

const options = [
  { value: pageNames.amVeteran, label: 'Yes' },
  { value: pageNames.amServiceMember, label: 'No' },
];

const interestedInEmploymentHelp = ({ setPageState, state = {} }) => (
  <a type="button" className="usa-button-primary va-button-primary">
    Apply for career counseling
  </a>
);

export default {
  name: pageNames.interestedInEmploymentHelp,
  component: interestedInEmploymentHelp,
};
