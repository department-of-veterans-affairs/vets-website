import React from 'react';
import { serviceMemberPathPageNames } from '../pageList';

const notInterestedInHelp = () => (
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
