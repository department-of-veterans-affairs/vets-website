import React from 'react';
import PropTypes from 'prop-types';

export default function EnrollmentVerificationLoadingIndicator({
  message = 'Please wait while we load the application for you.',
}) {
  return (
    <div className="vads-u-margin-y--5">
      <va-loading-indicator label="Loading" message={message} set-focus />
    </div>
  );
}

EnrollmentVerificationLoadingIndicator.propTypes = {
  message: PropTypes.string,
};
