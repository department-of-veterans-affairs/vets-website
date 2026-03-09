import React from 'react';
import PropTypes from 'prop-types';

const VerificationErrorAlert = ({ message }) => {
  return (
    <va-alert
      data-testid="verification-error-alert"
      class="vads-u-margin-top--4"
      status="error"
      visible
      slim
    >
      <p className="vads-u-margin-y--0">{message}</p>
    </va-alert>
  );
};

export default VerificationErrorAlert;

VerificationErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
};
