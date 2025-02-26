import PropTypes from 'prop-types';
import React from 'react';

function InputError({ errorMessage, showError }) {
  if (!showError) {
    return null;
  }

  return (
    <span className="usa-input-error-message" role="alert">
      <span className="sr-only">Error</span>
      {errorMessage}
    </span>
  );
}

InputError.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  showError: PropTypes.bool.isRequired,
};

export default InputError;
