import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { signInServiceName } from 'platform/user/authentication/selectors';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from 'platform/user/authentication/components/VerifyButton';

function usePrevious(value) {
  const ref = useRef();
  useEffect(
    () => {
      ref.current = value;
    },
    [value],
  );
  return ref.current;
}

export default function Verify() {
  const isAuthenticated = useSelector(
    state => state?.user?.login?.currentlyLoggedIn,
  );
  const isVerified = useSelector(state => state?.user?.profile?.verified);
  const loginServiceName = useSelector(signInServiceName);

  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const prevVerified = usePrevious(isVerified);

  // Simulate loading (e.g., for OAuth transition)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Trigger redirect after verification is completed
  useEffect(
    () => {
      if (prevVerified === false && isVerified === true) {
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = '/my-va';
        }, 2000);
      }
    },
    [isVerified, prevVerified],
  );

  const renderServiceNames = isAuthenticated ? (
    <strong>{loginServiceName === 'idme' ? 'ID.me' : 'Login.gov'}</strong>
  ) : (
    <>
      <strong>Login.gov</strong> or <strong>ID.me</strong>
    </>
  );

  let buttonContent;

  if (isAuthenticated) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirecting) {
    return (
      <section data-testid="unauthenticated-verify-app" className="verify">
        <div className="container">
          <div className="row">
            <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
              <va-alert status="success" visible>
                <h2 slot="headline">You’re verified</h2>
                <p>Redirecting you to My VA...</p>
              </va-alert>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="unauthenticated-verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2 vads-u-margin-y--2">
            {isVerified ? (
              <>
                <va-alert status="success" visible>
                  <h2 slot="headline">You’re already verified</h2>
                  <p>
                    You’ve already completed identity verification. You can now
                    access all the tools and benefits available to you on
                    VA.gov.
                  </p>
                </va-alert>
                <p>
                  <a href="/my-va">Go to My VA</a>
                </p>
              </>
            ) : (
              <>
                <h1 className="vads-u-margin-top--2">Verify your identity</h1>
                <p>
                  We need you to verify your identity for your{' '}
                  {renderServiceNames} account. This step helps us protect all
                  Veterans’ information and prevent scammers from stealing your
                  benefits.
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
