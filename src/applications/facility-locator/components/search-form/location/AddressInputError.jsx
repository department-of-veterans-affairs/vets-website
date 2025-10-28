import PropTypes from 'prop-types';
import React from 'react';

function AddressInputError({ showError }) {
  function ErrorContent() {
    if (!showError) {
      return null;
    }

    return (
      <>
        <span className="usa-sr-only sr-only">Error</span>
        <span className="usa-error-message">
          Enter a zip code or a city and state in the search box
        </span>
      </>
    );
  }

  return (
    <span className="usa-input-error-message" role="alert">
      <ErrorContent />
    </span>
  );
}

AddressInputError.propTypes = {
  showError: PropTypes.bool,
};

export default AddressInputError;
