import React from 'react';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';

export default function UnauthenticatedVerify() {
  return (
    <section data-testid="unauthenticated-verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            <h1 className="vads-u-margin-top--2">Verify your identity</h1>
            <p>
              We need you to verify your identity for your{' '}
              <strong>Login.gov</strong> or <strong>ID.me</strong> account. This
              step helps us protect all Veterans’ information and prevent
              scammers from stealing your benefits.
            </p>
            <p>
              This one-time process often takes about 10 minutes. You’ll need to
              provide certain personal information and identification.
            </p>
            <div data-testid="verify-button-group">
              <VerifyLogingovButton
                queryParams={{ operation: 'unauthenticated_verify_page' }}
              />
              <VerifyIdmeButton
                queryParams={{ operation: 'unauthenticated_verify_page' }}
              />
            </div>
            <a href="/resources/verifying-your-identity-on-vagov/">
              Learn more about verifying your identity
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
