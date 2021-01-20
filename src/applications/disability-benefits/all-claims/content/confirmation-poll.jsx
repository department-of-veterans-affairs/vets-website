import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

export const successMessage = claimId => (
  <div>
    <strong>Claim ID number</strong>
    <div>{claimId}</div>
  </div>
);

export const checkLaterMessage = () => <div />;

export const errorMessage = () => <div />;

export const pendingMessage = longWait => {
  const message = !longWait
    ? 'Please wait while we submit your application and give you a confirmation number.'
    : 'We’re sorry. It’s taking us longer than expected to submit your application. Thank you for your patience.';
  return <LoadingIndicator message={message} />;
};
