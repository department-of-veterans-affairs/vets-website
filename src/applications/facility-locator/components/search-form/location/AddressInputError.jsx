import PropTypes from 'prop-types';
import React from 'react';

function AddressInputError({ showError }) {
  if (!showError) {
    return null;
  }
  return (
    <span className="usa-input-error-message" role="alert">
      <span className="sr-only">Error</span>
      Enter a zip code or a city and state in the search box
    </span>
  );
}

AddressInputError.propTypes = {
  showError: PropTypes.bool,
};

export default AddressInputError;
