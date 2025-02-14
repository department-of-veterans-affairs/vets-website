import PropTypes from 'prop-types';
import React from 'react';

function AddressInputError({ showError }) {
  if (!showError) {
    return null;
  }
  return (
    <span className="usa-input-error-message" role="alert">
      <span className="sr-only">Error</span>
      Please fill in a city, state, or postal code.
    </span>
  );
}

AddressInputError.propTypes = {
  showError: PropTypes.bool,
};

export default AddressInputError;
