import React from 'react';

export default function SignInAlertBox() {
  return (
    <va-alert close-btn-aria-label="Close notification" status="info" visible>
      <h2 id="track-your-status-on-mobile" slot="headline">
        Sign in with your Login.gov or ID.me account
      </h2>
      <div>
        <p className="vads-u-margin-y--0">
          Soon all VA websites will follow a new, more secure sign-in process.
          You’ll need to sign in using your Login.gov or ID.me account. So
          you’re ready for the change, try signing in now with Login.gov or
          ID.me.
        </p>
      </div>
      <div>
        <p className="vads-u-margin-y--0">
          <a href="https://www.va.gov/resources/creating-an-account-for-vagov/">
            Learn more about creating a Login.gov or ID.me account{' '}
          </a>
        </p>
      </div>
    </va-alert>
  );
}
