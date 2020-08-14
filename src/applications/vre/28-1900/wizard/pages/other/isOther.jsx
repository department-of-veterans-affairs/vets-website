import React from 'react';
import { otherPathPageNames } from '../pageList';

const amOther = () => (
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
