import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const ErrorMessage = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <va-alert status="error">
      <h1 tabIndex="-1" slot="headline">
        We couldn’t check you in
      </h1>
      <p data-testid="error-message">
        We’re sorry. Something went wrong on our end. Check in with a staff
        member.
      </p>
    </va-alert>
  );
};

export default ErrorMessage;
