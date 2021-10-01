import React from 'react';

import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { login, signup } from 'platform/user/authentication/utilities';

const vaGovFullDomain = environment.BASE_URL;

function loginHandler(loginType) {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType, 'v1');
}

function signupHandler(loginType) {
  signup({ version: 'v1', queryParams: { csp: loginType } });
}

export default function SignInButtons({ isDisabled, useLoginGov }) {
  return (
    <div>
      {useLoginGov && (
        <button
          disabled={isDisabled}
          type="button"
          className="usa-button default"
          onClick={() => loginHandler('logingov')}
        >
          Sign in with
          <img
            alt="Login.gov"
            src={`${vaGovFullDomain}/img/signin/login-gov-logo-rev.svg`}
          />
        </button>
      )}
      <button
        disabled={isDisabled}
        type="button"
        className="usa-button default"
        onClick={() => loginHandler('idme')}
      >
        Sign in with
        <span className="sr-only">ID.me</span>
        <img
          alt="ID.me"
          src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
        />
      </button>
      <button
        disabled={isDisabled}
        type="button"
        className="usa-button default"
        onClick={() => loginHandler('dslogon')}
      >
        Sign in with
        <span className="sr-only">DS Logon</span>
        <img
          alt="DS Logon"
          src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
        />
      </button>
      <button
        disabled={isDisabled}
        type="button"
        className="usa-button default default-mhv"
        onClick={() => loginHandler('mhv')}
      >
        Sign in with
        <span className="sr-only">My HealtheVet</span>
        <img
          alt="My HealtheVet"
          className="mhv-icon"
          src={`${vaGovFullDomain}/img/signin/mhv-logo-white.svg`}
        />
      </button>
      <span className="sidelines">OR</span>
      <div className="alternate-signin">
        <h2 className="vads-u-font-size--sm vads-u-margin-top--0">
          Don't have those accounts?
        </h2>
        {useLoginGov && (
          <button
            disabled={isDisabled}
            type="button"
            className="usa-button usa-button-secondary create-account"
            onClick={() => signupHandler('logingov')}
          >
            Create an account with
            <span className="sr-only">Login.gov</span>
            <img
              alt="Login.gov"
              src={`${vaGovFullDomain}/img/signin/login-gov-logo.svg`}
            />
          </button>
        )}
        <button
          disabled={isDisabled}
          type="button"
          className="usa-button usa-button-secondary create-account"
          onClick={() => signupHandler('idme')}
        >
          Create an account with
          <span className="sr-only">ID.me</span>
          <img
            alt="ID.me"
            src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
          />
        </button>
      </div>
    </div>
  );
}
