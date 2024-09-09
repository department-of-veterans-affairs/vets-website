import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({
  className,
  message = 'Please wait while we load the application for you.',
}) => (
  <div className={className}>
    <va-loading-indicator
      message={message}
      label="Loading"
      aria-hidden="true"
    />
  </div>
);

Loader.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
};
export default Loader;
