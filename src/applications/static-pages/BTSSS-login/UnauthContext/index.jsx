import React from 'react';

const UnauthContent = () => (
  <>
    <va-alert
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <h3 id="track-your-status-on-mobile" slot="headline">
        Sign in to file a travel pay claim
      </h3>
      <div>
        <p className="vads-u-margin-top--0">
          Sign in with your existing Login.gov, ID.me, DS Logon, or My
          HealtheVet account. If you don’t have any of these accounts, you can
          create a free Login.gov or ID.me account now.
        </p>
        <button className="va-button-primary">
          Sign in or create an account
        </button>
      </div>
    </va-alert>
  </>
);

export default UnauthContent;
