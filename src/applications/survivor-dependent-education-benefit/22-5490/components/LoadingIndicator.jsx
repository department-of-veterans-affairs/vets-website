import React from 'react';
import PropTypes from 'prop-types';

export default function LoadingIndicator({
  className = 'vads-u-margin-y--5',
  message = 'Please wait while we load the application for you.',
}) {
  return (
    <div className={className}>
      <va-loading-indicator label="Loading" message={message} set-focus />
    </div>
  );
}

LoadingIndicator.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
};
