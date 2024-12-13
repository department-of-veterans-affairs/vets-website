import React from 'react';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';

export default function Authentication() {
  const deprecationDatesContent = (
    <p>
      You’ll need to sign in with a different account after{' '}
      <strong>January 31, 2025</strong>. After this date, we’ll remove the{' '}
      <strong>My HealtheVet</strong> sign-in option. You’ll need to sign in
      using a <strong>Login.gov</strong> or <strong>ID.me</strong> account.
    </p>
  );

  return (
    <section data-testid="unauthenticated-verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            <h1 className="vads-u-margin-top--2">Verify your identity</h1>
            <>
              {deprecationDatesContent}
              <div data-testid="verify-button-group">
                <VerifyLogingovButton />
                <VerifyIdmeButton />
              </div>
              <a href="/resources/verifying-your-identity-on-vagov/">
                Learn more about verifying your identity
              </a>
            </>
          </div>
        </div>
      </div>
    </section>
  );
}
