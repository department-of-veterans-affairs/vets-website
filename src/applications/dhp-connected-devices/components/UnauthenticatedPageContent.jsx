import React from 'react';
import LoginModalButton from 'platform/user/authentication/components/LoginModalButton';

export const UnauthenticatedPageContent = () => {
  return (
    <>
      <h2>Connected devices</h2>
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h3 slot="headline">Please sign in to connect a device</h3>
        <div>
          Sign in with your existing ID.me, DS Logon, or My HealtheVet account.
          If you don’t have any of these accounts, you can create a free ID.me
          account now.
        </div>
        <p />
        <span id="login-button">
          <LoginModalButton
            className="usa-button"
            message="Sign in or create an account"
          />
        </span>
      </va-alert>
    </>
  );
};

export default UnauthenticatedPageContent;
