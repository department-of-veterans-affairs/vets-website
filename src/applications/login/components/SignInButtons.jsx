import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';
import LoginGovSVG from 'applications/login/components/LoginGov';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login({
    policy: loginType,
  });
}

const LoginGovButtons = ({
  isDisabled,
  externalApplication,
  loginGovCreateAccountEnabled,
}) => (
  <>
    {externalApplication !== 'mhv' && (
      <button
        disabled={isDisabled}
        type="button"
        aria-label="Sign in with Login.gov"
        className="usa-button usa-button-big logingov-button vads-u-margin-y--1p5"
        onClick={() => loginHandler('logingov')}
      >
        <LoginGovSVG />
      </button>
    )}
    <button
      disabled={isDisabled}
      type="button"
      aria-label="Sign in with ID.me"
      className="usa-button usa-button-big idme-button vads-u-margin-y--1p5"
      onClick={() => loginHandler('idme')}
    >
      <img
        alt="Sign in with ID.me"
        src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
      />
    </button>
    <button
      disabled={isDisabled}
      type="button"
      aria-label="Sign in with DS Logon"
      className="usa-button usa-button-big dslogon-button vads-u-margin-y--1p5"
      onClick={() => loginHandler('dslogon')}
    >
      DS Logon
    </button>
    <button
      disabled={isDisabled}
      type="button"
      aria-label="Sign in with My HealtheVet"
      className="usa-button usa-button-big mhv-button vads-u-margin-y--1p5"
      onClick={() => loginHandler('mhv')}
    >
      My HealtheVet
    </button>
    <div id="create-account">
      <h2 className="vads-u-margin-top--3">Or create an account</h2>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        {externalApplication !== 'mhv' &&
          loginGovCreateAccountEnabled && (
            <button
              type="button"
              aria-label="Create an account with Login.gov"
              disabled={isDisabled}
              onClick={() => signup({ csp: 'logingov' })}
            >
              Create an account with Login.gov
            </button>
          )}
        <button
          type="button"
          aria-label="Create an account with ID.me"
          disabled={isDisabled}
          onClick={() => signup({ csp: 'idme' })}
        >
          Create an account with ID.me
        </button>
      </div>
    </div>
  </>
);

const OriginalButtons = ({ isDisabled }) => (
  <>
    <button
      disabled={isDisabled}
      className="dslogon"
      onClick={() => loginHandler('dslogon')}
    >
      <img
        aria-hidden="true"
        role="presentation"
        alt="DS Logon"
        src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
      />
      <strong> Sign in with DS Logon</strong>
    </button>
    <button
      disabled={isDisabled}
      className="mhv"
      onClick={() => loginHandler('mhv')}
    >
      <img
        aria-hidden="true"
        role="presentation"
        alt="My HealtheVet"
        src={`${vaGovFullDomain}/img/signin/mhv-icon.svg`}
      />
      <strong> Sign in with My HealtheVet</strong>
    </button>
    <button
      disabled={isDisabled}
      className="usa-button-primary va-button-primary"
      onClick={() => loginHandler('idme')}
    >
      <img
        aria-hidden="true"
        role="presentation"
        alt="ID.me"
        src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
      />
      <strong> Sign in with ID.me</strong>
    </button>
    <span className="sidelines">OR</span>
    <div className="alternate-signin">
      <h2 className="vads-u-font-size--sm vads-u-margin-top--0">
        Don’t have those accounts?
      </h2>
      <button
        disabled={isDisabled}
        className="idme-create usa-button usa-button-secondary"
        onClick={() => signup()}
      >
        <img
          aria-hidden="true"
          role="presentation"
          alt="ID.me"
          src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
        />
        <strong> Create an ID.me account</strong>
      </button>
      <p>Use your email, Google, or Facebook</p>
    </div>
  </>
);

export default function SignInButtons({
  isDisabled,
  loginGovEnabled,
  externalApplication,
  loginGovCreateAccountEnabled,
}) {
  return (
    <div>
      {!loginGovEnabled ? (
        <OriginalButtons isDisabled={isDisabled} />
      ) : (
        <LoginGovButtons
          isDisabled={isDisabled}
          loginGovEnabled={loginGovEnabled}
          loginGovCreateAccountEnabled={loginGovCreateAccountEnabled}
          externalApplication={externalApplication}
        />
      )}
    </div>
  );
}
