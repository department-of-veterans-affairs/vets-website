import React from 'react';
import { useSelector } from 'react-redux';
import { signInServiceName } from 'platform/user/authentication/selectors';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';

export default function Verify() {
  const isAuthenticated = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const isVerified = useSelector(state => state?.user?.profile?.verified);
  const loading = useSelector(state => state?.user?.profile?.loading);
  const loginServiceName = useSelector(signInServiceName);

  let renderServiceNames;
  if (!loading && isAuthenticated) {
    renderServiceNames = (
      <strong>{loginServiceName === 'idme' ? 'ID.me' : 'Login.gov'}</strong>
    );
  } else {
    renderServiceNames = (
      <>
        <strong>Login.gov</strong> or <strong>ID.me</strong>
      </>
    );
  }

  // Handle button content based on authentication and login service
  let buttonContent;
  if (!loading && isAuthenticated) {
    if (loginServiceName === 'idme') {
      buttonContent = <VerifyIdmeButton />;
    } else {
      buttonContent = <VerifyLogingovButton />;
    }
  } else {
    buttonContent = (
      <>
        <VerifyLogingovButton useOAuth />
        <VerifyIdmeButton useOAuth />
      </>
    );
  }

  return (
    <section data-testid="unauthenticated-verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            <h1 className="vads-u-margin-top--2">Verify your identity</h1>

            {/* If authenticated and verified */}
            {isAuthenticated &&
              isVerified && (
                <>
                  <va-alert status="success">
                    <h2>You’re verified</h2>
                    <p>
                      We confirmed you’ve already completed the identity
                      verification process for VA online services.
                    </p>
                    <p>
                      This one-time step helps protect your information and
                      prevents scammers from stealing your benefits. You can now
                      access your VA benefits, services, and information online.
                    </p>
                  </va-alert>
                  <p>
                    <a href="/my-va">Go to My VA</a>
                  </p>
                </>
              )}

            {!isVerified &&
              !loading && (
                <>
                  <p>
                    We need you to verify your identity for your{' '}
                    {renderServiceNames} account. This step helps us protect all
                    Veterans’ information and prevent scammers from stealing
                    your benefits.
                  </p>
                  <p>
                    This one-time process often takes about 10 minutes. You’ll
                    need to provide certain personal information and
                    identification.
                  </p>
                  <div data-testid="verify-button-group">{buttonContent}</div>
                  <a href="/resources/verifying-your-identity-on-vagov/">
                    Learn more about verifying your identity
                  </a>
                </>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
