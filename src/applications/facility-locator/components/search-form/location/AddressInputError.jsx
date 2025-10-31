import PropTypes from 'prop-types';
import React from 'react';

const AddressInputError = React.forwardRef(({ showError, errorId }, ref) => {
  if (!showError) {
    return null;
  }
  return (
    <span
      className="usa-input-error-message"
      role="alert"
      ref={ref}
      tabIndex="-1"
    >
      <span className="sr-only">Error</span>
      <span id={errorId}>
        Enter a zip code or a city and state in the search box
      </span>
    </span>
  );
});

AddressInputError.displayName = 'AddressInputError';

AddressInputError.propTypes = {
  errorId: PropTypes.string,
  showError: PropTypes.bool,
};

export default AddressInputError;
