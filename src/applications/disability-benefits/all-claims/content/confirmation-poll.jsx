import React from 'react';

export const successMessage = claimId => (
  <div className="vads-u-font-size--base">
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
  const label = longWait
    ? 'we’re still trying to submit your application'
    : 'submitting your application';
  return <va-loading-indicator message={message} label={label} />;
};

export const alertBody = (
  <>
    <p>Your submission is in progress.</p>
    <p>
      It may take up to 10 days for us to receive your form in our system. We’ll
      send you an email to confirm your submission.
    </p>
    <p>There’s nothing else you need to do right now.</p>
  </>
);
