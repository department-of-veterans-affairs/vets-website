import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ className }) => (
  <div className={className}>
    <va-loading-indicator
      message="Please wait while we load the application for you."
      label="Loading"
      set-focus
    />
  </div>
);

Loader.propTypes = {
  className: PropTypes.string,
};
export default Loader;
