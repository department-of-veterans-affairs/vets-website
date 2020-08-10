import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { serviceMemberPathPageNames } from '../pageList';

const notInterestedInHelp = ({ setPageState, state = {} }) => (
  <div className="feature">
    <p>
      You can start this application whenever you are ready. For more info
      please visit the link
    </p>
    <a href="#">Veteran Readiness and Employment (Chapter 31)</a>
  </div>
);

export default {
  name: serviceMemberPathPageNames.notInterestedInHelp,
  component: notInterestedInHelp,
};
