import React from 'react';
import IDMeSVG from 'platform/user/authentication/components/IDMeSVG';
import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';

const SignIn = ({ onSignIn }) => {
  const handleLoginGovClick = () => {
    onSignIn('Login.gov Authenticated User');
  };

  const handleIdMeClick = () => {
    onSignIn('ID.me Authenticated User');
  };

  return (
    <main id="main" className="main">
      <div className="section">
        <section className="login">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="container">
              <div className="row">
                <div className="columns small-12">
                  <h1
                    id="signin-signup-modal-title"
                    className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2"
                  >
                    Sign in or create an account
                  </h1>
                </div>
              </div>

              <div className="row">
                <div className="usa-width-two-thirds medium-8 columns print-full-width sign-in-wrapper">
                  <button
                    type="button"
                    className="usa-button logingov-button vads-u-margin-y--1p5 vads-u-padding-y--2"
                    onClick={handleLoginGovClick}
                  >
                    Login with
                    <LoginGovSVG />
                  </button>

                  <button
                    type="button"
                    className="usa-button idme-button vads-u-margin-y--1p5 vads-u-padding-y--2"
                    onClick={handleIdMeClick}
                  >
                    Login with
                    <IDMeSVG />
                  </button>
                </div>
              </div>

              <div id="loginNote">
                <a href="https://www.va.gov/resources/creating-an-account-for-vagov">
                  Learn more about creating a Login.gov or ID.me account
                </a>
              </div>

              <div>
                <h2>Other sign-in options</h2>
                <h3 id="mhvH3">
                  My HealtheVet sign-in option
                  <span className="vads-u-display--block vads-u-font-size--md vads-u-font-family--sans">
                    Available through January 31, 2025
                  </span>
                </h3>
                <p>
                  You’ll still be able to use the <strong>My HealtheVet</strong>{' '}
                  website after this date. You’ll just need to start signing in
                  with a <strong>Login.gov</strong> or <strong>ID.me</strong>{' '}
                  account.
                </p>
                <button
                  type="button"
                  className="usa-button mhv-button vads-u-margin-y--1p5 vads-u-padding-y--2"
                  aria-describedby="mhvH3"
                >
                  My HealtheVet
                </button>
                <h3
                  id="dslogonH3"
                  className="vads-u-margin-bottom--0 vads-u-margin-top--3"
                >
                  DS Logon sign-in option
                  <span className="vads-u-display--block vads-u-font-size--base vads-u-font-family--sans">
                    Available through September 30, 2025
                  </span>
                </h3>
                <p>
                  You’ll still be able to use your <strong>DS Logon</strong>{' '}
                  account on Defense Department websites after this date.
                </p>
                <button
                  type="button"
                  className="usa-button dslogon-button vads-u-margin-y--1p5 vads-u-padding-y--2"
                  aria-describedby="dslogonH3"
                >
                  DS Logon
                </button>
              </div>

              <div className="row">
                <div className="usa-width-two-thirds medium-8 columns print-full-width sign-in-wrapper">
                  <div className="help-info">
                    <h2 className="vads-u-margin-top--0">
                      Having trouble signing in?
                    </h2>
                    <p>
                      Get answers to common{' '}
                      <a href="/resources/signing-in-to-vagov/">
                        questions about signing in
                      </a>{' '}
                      and{' '}
                      <a href="/resources/verifying-your-identity-on-vagov/">
                        verifying your identity
                      </a>
                      .
                    </p>
                    <p>
                      <span>
                        Call our MyVA411 main information line for help at{' '}
                        800-698-2411 (<va-telephone contact="711" />
                        ). We’re here 24/7.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignIn;
