import React from 'react';
import UserNav from 'platform/site-wide/user-nav/containers/Main';

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
        <div className="dhp-login-button">
          <UserNav isHeaderV2 />
        </div>
      </va-alert>
    </>
  );
};
