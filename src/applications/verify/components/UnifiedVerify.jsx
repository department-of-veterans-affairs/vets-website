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
  const loginServiceName = useSelector(signInServiceName); // Get the current credential service provider (e.g., idme or logingov)

  let buttonContent;

  if (isAuthenticated) {
    // Use the loginServiceName to determine which VerifyButton to show
    buttonContent =
      loginServiceName === 'idme' ? (
        <VerifyIdmeButton />
      ) : (
        <VerifyLogingovButton />
      );
  } else {
    buttonContent = (
      <>
        <VerifyLogingovButton useOAuth />
        <VerifyIdmeButton useOAuth />
      </>
    );
  }

  const renderServiceNames = isAuthenticated ? (
    <strong>{loginServiceName === 'idme' ? 'ID.me' : 'Login.gov'}</strong>
  ) : (
    <>
      <strong>Login.gov</strong> or <strong>ID.me</strong>
    </>
  );

  return (
    <section data-testid="unauthenticated-verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            <h1 className="vads-u-margin-top--2">Verify your identity</h1>
            <p>
              We need you to verify your identity for your {renderServiceNames}{' '}
              account. This step helps us protect all Veterans’ information and
              prevent scammers from stealing your benefits.
            </p>
            <p>
              This one-time process often takes about 10 minutes. You’ll need to
              provide certain personal information and identification.
            </p>
            <div data-testid="verify-button-group">{buttonContent}</div>
            <a href="/resources/verifying-your-identity-on-vagov/">
              Learn more about verifying your identity
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
