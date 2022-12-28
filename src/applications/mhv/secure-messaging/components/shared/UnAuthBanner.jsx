import React from 'react';

const UnAuthBanner = () => {
  return (
    <va-alert
      background-only
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <div>
        <h3 className="vads-u-margin-top--0" slot="headline">
          Sign in to send secure messages
        </h3>
        <p className="vads-u-margin-top--0">
          Sign in with your
          <strong> Login.gov</strong>, <strong>ID.me</strong>, or{' '}
          <strong>My HealtheVet</strong> account. If you don’t have any of these
          accounts, you can create a free account now.
        </p>
        <button className="va-button-primary">Sign in or create account</button>
      </div>
    </va-alert>
  );
};

export default UnAuthBanner;
