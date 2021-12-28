import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';

const ErrorMessage = ({
  header = 'We couldn’t check you in',
  message = 'We’re sorry. Something went wrong on our end. Check in with a staff member.',
  showAlert = true,
}) => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  const body = (
    <>
      <h1 tabIndex="-1" slot="headline">
        {header}
      </h1>
      <p data-testid="error-message">{message}</p>
    </>
  );
  if (showAlert) {
    return <va-alert status="error">{body}</va-alert>;
  }
  return { body };
};

ErrorMessage.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  showAlert: PropTypes.bool,
};

export default ErrorMessage;
