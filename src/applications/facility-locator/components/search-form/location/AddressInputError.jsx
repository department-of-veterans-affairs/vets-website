import PropTypes from 'prop-types';
import React from 'react';

const AddressInputError = React.forwardRef(({ showError, errorId }, ref) => {
  // This method of rendering two new span elements inside the error container
  // copies the method of error handling displayed in the platform's
  // standard error handling on an input
  function ErrorContent() {
    if (!showError) {
      return null;
    }

    return (
      <>
        <span className="usa-sr-only sr-only">Error</span>
        <span className="usa-error-message" id={errorId}>
          Enter a zip code or a city and state in the search box
        </span>
      </>
    );
  }

  return (
    <span
      className="usa-input-error-message"
      role="alert"
      ref={ref}
      tabIndex={showError ? -1 : 0}
    >
      <ErrorContent />
    </span>
  );
});

AddressInputError.displayName = 'AddressInputError';

AddressInputError.propTypes = {
  errorId: PropTypes.string,
  showError: PropTypes.bool,
};

export default AddressInputError;
