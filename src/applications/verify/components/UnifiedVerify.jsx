import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  isAuthenticatedWithOAuth,
  signInServiceName,
} from 'platform/user/authentication/selectors';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';
import { hasSession } from 'platform/user/profile/utilities';

const Verify = () => {
  const isAuthenticated = hasSession();
  const isAuthenticatedOAuth = useSelector(isAuthenticatedWithOAuth);
  const loginServiceName = useSelector(signInServiceName); // Get the current SIS (e.g., idme or logingov)

  let buttonContent;

  if (isAuthenticated) {
    buttonContent = (
      <>
        <VerifyLogingovButton />
        <VerifyIdmeButton />
      </>
    );
  } else if (isAuthenticatedOAuth) {
    // Use the loginServiceName to determine which button to show
    if (loginServiceName === 'idme') {
      buttonContent = <VerifyIdmeButton useOAuth />;
    } else if (loginServiceName === 'logingov') {
      buttonContent = <VerifyLogingovButton useOAuth />;
    }
  } else {
    buttonContent = (
      <>
        <VerifyLogingovButton useOAuth />
        <VerifyIdmeButton useOAuth />
      </>
    );
  }

  const renderServiceNames = () => {
    if (isAuthenticated) {
      return (
        <strong>{loginServiceName === 'idme' ? 'ID.me' : 'Login.gov'}</strong>
      );
    }
    return (
      <>
        <strong>Login.gov</strong> or <strong>ID.me</strong>
      </>
    );
  };

  return (
    <section data-testid="unauthenticated-verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            <h1 className="vads-u-margin-top--2">Verify your identity</h1>
            <p>
              We need you to verify your identity for your{' '}
              {renderServiceNames()} account. This step helps us protect all
              Veterans’ information and prevent scammers from stealing your
              benefits.
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
};

Verify.propTypes = {
  loginType: PropTypes.string,
};

export default Verify;
