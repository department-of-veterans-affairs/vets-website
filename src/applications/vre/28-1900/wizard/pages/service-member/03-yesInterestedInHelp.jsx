import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';

const yesInterestedInHelp = () => (
  <a type="button" className="usa-button-primary va-button-primary">
    Apply for career counseling
  </a>
);

export default {
  name: serviceMemberPathPageNames.yesInterestedInHelp,
  component: yesInterestedInHelp,
};
