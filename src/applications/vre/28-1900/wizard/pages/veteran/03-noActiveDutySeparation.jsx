import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from '../pageList';

const noActiveDutySeparation = ({ setPageState, state = {} }) => (
  <div className="feature">
    <p>
      To apply for VR&E benefits, you must be within 12 years of whichever is
      later: your date of discharge or the date you received your disability
      rating.
    </p>
  </div>
);

export default {
  name: pageNames.noActiveDutySeparation,
  component: noActiveDutySeparation,
};
