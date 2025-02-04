import React from 'react';

const ErrorAlert = () => {
  return (
    <va-alert data-testid="error" status="error">
      <h2>We’re sorry. We’ve run into a problem.</h2>
      <p>
        Something went wrong on our end. Please refresh the page and try again.
      </p>
    </va-alert>
  );
};

export default ErrorAlert;
