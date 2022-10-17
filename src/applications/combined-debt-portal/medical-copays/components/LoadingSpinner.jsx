import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ margin }) => (
  <div className={`vads-u-margin--${margin}`}>
    <va-loading-indicator message="Please wait while we load the application for you." />
  </div>
);

LoadingSpinner.propTypes = {
  margin: PropTypes.number,
};

export default LoadingSpinner;
