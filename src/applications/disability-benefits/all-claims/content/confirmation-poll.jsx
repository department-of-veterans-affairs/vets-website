import React from 'react';

export const successMessage = claimId => (
  <div className="vads-u-font-size--base">
    <strong>Claim ID number</strong>
    <div>{claimId}</div>
  </div>
);

export const checkLaterMessage = () => <div />;

export const errorMessage = () => <div />;

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
