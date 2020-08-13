import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { veteranPathPageNames } from '../pageList';

const interestedInEmploymentHelp = ({ setPageState, state = {} }) => (
  <a type="button" className="usa-button-primary va-button-primary">
    Apply for career counseling
  </a>
);

export default {
  name: veteranPathPageNames.interestedInEmploymentHelp,
  component: interestedInEmploymentHelp,
};
