import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const LoadingSpinner = ({ margin }) => (
  <div className={`vads-u-margin--${margin}`}>
    <LoadingIndicator message="Please wait while we load the application for you." />
  </div>
);

export default LoadingSpinner;
