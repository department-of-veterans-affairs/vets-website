import React from 'react';
import { veteranPathPageNames } from '../pageList';

const NoActiveDutySeparation = () => {
  return (
    <div className="feature vads-u-background-color--gray-lightest">
      <p>
        To apply for VR&E benefits, you must be within 12 years of whichever is
        later: your date of discharge or the date you received your disability
        rating.
      </p>
      <a href="/careers-employment/vocational-rehabilitation/eligibility/">
        Learn more about VR&E eligibility
      </a>
    </div>
  );
};

export default {
  name: veteranPathPageNames.noActiveDutySeparation,
  component: NoActiveDutySeparation,
};
