import React from 'react';
import { veteranPathPageNames } from '../pageList';

const notInterestedInEmploymentHelp = () => (
  <div className="feature">
    <p>
      You can start this application whenever you are ready. For more info
      please visit the link
    </p>
    <a href="#">Veteran Readiness and Employment (Chapter 31)</a>
  </div>
);

export default {
  name: veteranPathPageNames.notInterestedInEmploymentHelp,
  component: notInterestedInEmploymentHelp,
};
