import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import {
  login,
  signup,
  loginGovSignupUrl,
  idmeSignupUrl,
} from 'platform/user/authentication/utilities';
import LoginGovSVG from 'applications/login/components/LoginGov';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType, 'v1');
}

function signupHandler(loginType) {
  recordEvent({ event: `register-link-clicked-${loginType}` });
}

const LoginGovButtons = ({ isDisabled }) => (
  <div className="columns small-12" id="sign-in-wrapper">
    <button
      disabled={isDisabled}
      type="button"
      aria-label="Sign in with Login.gov"
      className="usa-button logingov-button vads-u-margin-y--1p5 vads-u-padding-y--2"
      onClick={() => loginHandler('logingov')}
    >
      <LoginGovSVG />
    </button>
    <button
      disabled={isDisabled}
      type="button"
      aria-label="Sign in with ID.me"
      className="usa-button idme-button vads-u-margin-y--1p5 vads-u-padding-y--2"
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
      className="usa-button dslogon-button vads-u-margin-y--1p5 vads-u-padding-y--2"
      onClick={() => loginHandler('dslogon')}
    >
      DS Logon
    </button>
    <button
      disabled={isDisabled}
      type="button"
      aria-label="Sign in with My HealtheVet"
      className="usa-button mhv-button vads-u-margin-y--1p5 vads-u-padding-y--2"
      onClick={() => loginHandler('mhv')}
    >
      My HealtheVet
    </button>
    <div id="create-account">
      <h2 className="vads-u-margin-top--3">Or create an account</h2>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <a
          href={loginGovSignupUrl}
          className="vads-c-action-link--blue logingov"
          aria-label="Create an account on the Login.gov website"
          disabled={isDisabled}
          onClick={() => signupHandler('logingov')}
        >
          Create an account with Login.gov
        </a>
        <a
          href={idmeSignupUrl}
          className="vads-c-action-link--blue"
          aria-label="Create an account on the ID.me website"
          disabled={isDisabled}
          onClick={() => signupHandler('idme')}
        >
          Create an account with ID.me
        </a>
      </div>
    </div>
  </div>
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
        onClick={() => signup('v1')}
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

export default function SignInButtons({ isDisabled, loginGovEnabled }) {
  return (
    <div>
      {!loginGovEnabled ? (
        <OriginalButtons isDisabled={isDisabled} />
      ) : (
        <LoginGovButtons
          isDisabled={isDisabled}
          loginGovEnabled={loginGovEnabled}
        />
      )}
    </div>
  );
}
