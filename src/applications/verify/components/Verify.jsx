import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  isAuthenticatedWithOAuth,
  signInServiceName,
} from 'platform/user/authentication/selectors';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
  verifyHandler,
} from 'platform/user/authentication/components/VerifyButton';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';

const Verify = () => {
  const isAuthenticated = useSelector(isAuthenticatedWithOAuth);
  const loginServiceName = useSelector(signInServiceName); // Get the current SIS (e.g., idme or logingov)

  useEffect(
    () => {
      // Automatically start verification if returning from login
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get('postLogin') === 'true') {
        const policy =
          loginServiceName === 'idme'
            ? SERVICE_PROVIDERS.idme.policy
            : SERVICE_PROVIDERS.logingov.policy;

        verifyHandler({ policy, queryParams: {} });
      }
    },
    [loginServiceName],
  );

  let buttonContent;

  if (isAuthenticated) {
    // Use the loginServiceName to determine which button to show
    if (loginServiceName === 'idme') {
      buttonContent = (
        <VerifyIdmeButton
          queryParams={{ operation: 'authenticated_verify_page' }}
        />
      );
    } else if (loginServiceName === 'logingov') {
      buttonContent = (
        <VerifyLogingovButton
          queryParams={{ operation: 'authenticated_verify_page' }}
        />
      );
    }
  } else {
    buttonContent = (
      <>
        <VerifyLogingovButton
          queryParams={{ operation: 'unauthenticated_verify_page' }}
        />
        <VerifyIdmeButton
          queryParams={{ operation: 'unauthenticated_verify_page' }}
        />
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
