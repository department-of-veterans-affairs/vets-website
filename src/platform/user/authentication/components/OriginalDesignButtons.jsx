import React from 'react';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login({ policy: loginType });
}

export default function OriginalDesignButtons({ isDisabled }) {
  return (
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
}
