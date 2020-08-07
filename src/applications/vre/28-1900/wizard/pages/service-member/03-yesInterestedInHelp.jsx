import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const yesInterestedInHelp = ({ setPageState, state = {} }) => (
  <a type="button" className="usa-button-primary va-button-primary">
    Apply for career counseling
  </a>
);

export default {
  name: serviceMemberPathPageNames.yesInterestedInHelp,
  component: yesInterestedInHelp,
};
